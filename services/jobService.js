const Entreprise = require("../models/entreprise");
const Job = require("../models/job");
const Skills = require("../models/skills");
const User = require("../models/user");
const admin = require("firebase-admin");
/////////////////
require('dotenv').config();
const { Client } = require("@octoai/client");
const pdf = require('pdf-parse');
const mammoth = require("mammoth");
const prompts = require('prompts');
const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');
prompts.override(require('yargs').argv);

// Vérifiez si la clé ENV est définie, sinon, demandez à l'utilisateur de renommer le fichier .env.example en .env et d'ajouter la clé
if (!process.env.OCTOAI_TOKEN) {
  console.log('No OctoAI API key found. Please rename .env.example to .env and add your OctoAI API key.');
  return;
}

// Connectez-vous au client OctoML
const client = new Client(process.env.OCTOAI_TOKEN);
const model = "mistral-7b-instruct";


async function summarizeJobFile(jobFile, model) {
  try {
    const response = await axios.get(jobFile, { responseType: 'arraybuffer' });
    const dataBuffer = Buffer.from(response.data, 'binary');

    const url = new URL(jobFile);
    const pathname = url.pathname;
    const fileType = path.extname(pathname).toLowerCase();  // This will correctly extract .docx

    if (fileType === '.pdf') {
      docText = await pdf(dataBuffer).then(data => data.text);
    } else if (fileType === '.docx') {
      docText = await mammoth.extractRawText({ buffer: dataBuffer }).then(result => result.value);
    } else {
      throw new Error("Unsupported file format: " + fileType);
    }


    const chunkSize = 500 * 4;
    const jobChunks = [];
    for (let i = 0; i < docText.length; i += chunkSize) {
      jobChunks.push(docText.slice(i, i + chunkSize));
    }

    const summaries = [];
    for (let i = 0; i < jobChunks.length; i++) {
      const completion = await client.chat.completions.create({
        messages: [
          { role: "system", content: "You are a tool that summarizes job files." },
          { role: "assistant", content: `Job content:\n${jobChunks[i]}` }
        ],
        model: model,
        max_tokens: 500,
        presence_penalty: 0,
        temperature: 0.1,
        top_p: 0.9
      });

      summaries.push(completion.choices[0].message.content);
    }

    return summaries.join('\n\n');
  } catch (error) {
    throw new Error(`Error summarizing job file: ${error.message}`);
  }
}





async function getJobsByEntrepriseId(entrepriseId) {
  try {
    const jobs = await Job.find({
      $or: [
        { Relatedentreprise: entrepriseId },
        { "recruiter.entreprise": entrepriseId },
      ],
    })
      .populate("skills", "skillname")
      .populate("recruiter", "name");
    if (!jobs || jobs.length === 0) {
      return { status: 404, message: "No jobs found for this entreprise" };
    }
    return { status: 200, data: jobs };
  } catch (error) {
    console.error("Error fetching jobs by entreprise ID:", error);
    return { status: 500, message: "Server Error" };
  }
}
const scheduledFunctions = require("../scheduledFunctions/crons");
const Stats = require("../models/stats");
const Notification = require("../models/notification");

async function getJobByRecruiter(userId, res) {
  try {
    const jobs = await Job.find({ recruiter: userId }).populate("recruiter");
    if (!jobs) {
      return res.status(404).json({ message: "No jobs found for this user" });
    }
    return jobs;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

async function AddJob(req, res, admin) {
  try {
    const {
      recruiter,
      jobTitle,
      entrepriseID,
      location,
      typeofworkplace,
      jobType,
      salary,
      description,
      skills,
      termsAndConditions,
      duration,
      yearOfExperience,
      cible,
      closeDate,

    } = req.body;

    const user = await User.findById(recruiter);
    if (!user) {
      return res.status(404).json({ error: "Recruiter not found" });
    }

    if (user.nbopportunite) {
      user.nbopportunite += 1;
    } else {
      user.nbopportunite = 1;
    }
    await user.save();

    const skillsJob = [];
    const SKillTab = JSON.parse(skills);

    for (const element of SKillTab) {
      try {
        let skill = await Skills.findOne({ skillname: element });

        if (!skill) {
          skill = new Skills({ skillname: element });
          await skill.save();
        }

        skillsJob.push(skill._id);
      } catch (error) {
        // Handle any errors that occur during the operations
        console.error("Error occurred:", error);
      }
    }

    let jobDescription = req.body.description; 
    let jobFileUrl = "";

    if (req.files && req.files.jobFile && req.files.jobFile[0]) {
      const jobFile = req.files.jobFile[0];
      const bucket = admin.storage().bucket();
      const folderName = "jobFiles";
      const fileName = `${Date.now()}_${jobFile.originalname}`;
      const fileFullPath = `${folderName}/${fileName}`;
      const file = bucket.file(fileFullPath);
      await file.save(jobFile.buffer);
      jobFileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileFullPath)}?alt=media`;

        // Summarize the job file based on type
        const summary = await summarizeJobFile(jobFileUrl, "mistral-7b-instruct");
        console.log("Summary of the job file:", summary);
        jobDescription = summary;
    }


    const newJob = new Job({
      recruiter,
      state:"Active",
      jobTitle,
      location,
      typeofworkplace,
      jobType,
      salary,
      description: jobDescription,
      termsAndConditions,
      isActive: true,
      creationDate: new Date(),
      duration,
      yearOfExperience,
      cible,
      skills: skillsJob,
      closeDate,
      jobFile: jobFileUrl,
    });

    // await newJob.save();
    let entreprise;
    console.log(entrepriseID);
    if (entrepriseID) {
      entreprise = await Entreprise.findById(entrepriseID);
      if (!entreprise) {
        return res.status(404).json({ error: "Entreprise not found" });
      }
      newJob.Relatedentreprise = entreprise;
    } else {
      entreprise = await Entreprise.findById(user.entreprise);

      newJob.Relatedentreprise = entreprise;
    }
    const stats = entreprise.stats
    console.log(stats);
    const STATA = await Stats.findById(stats)
    STATA.totalNBOpportunite += 1;
    if (jobType == "fullTime") {
      STATA.nbFullTimeOP += 1
    } else if (jobType == "Summer internship") {
      STATA.nbSummerOP += 1
    } else if (jobType == "PFE") {
      STATA.nbPFEOP += 1
    }
    await STATA.save()
    if (closeDate != "null") {
      console.log("we ll send reports at" + closeDate);
      scheduledFunctions.initSendReports(closeDate, newJob);
      //scheduledFunctions.initScheduledJobs();
    }

    await newJob.save();
    // Send notification to the admin
    const adminNotif = await User.findOne({ role: 'Admin' });
    if (!adminNotif) {
      return res.status(404).json({ error: "Admin user not found" });
    }

    const notification = new Notification({
      recipient: adminNotif._id,
      sender: recruiter,
      message: `A new Opportunity has been created by "${entreprise.CompanyName}"`,
      path: '/liste/entreprises/'+entreprise._id
    });
    await notification.save();
    return newJob;
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error adding job" });
  }
}
async function getJobUpdateDetails(jobID, req, res, admin) {
  try {
    const job = await Job.findById(jobID)
      .populate("recruiter")
      .populate("skills", "skillname")
      .populate("Relatedentreprise");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    let entreprise;
    if (job.Relatedentreprise) {
      entreprise = job.Relatedentreprise;
    } else {
      const entrepriseData = await Entreprise.findById(
        job.recruiter?.entreprise
      );
      entreprise = entrepriseData;
    }
    const jobReturned = await Job.findById(jobID)
      .populate("recruiter")
      .populate("skills", "skillname");
    return { jobReturned, entreprise };
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}
async function getJobDetails(jobID) {
  try {
    const job = await Job.findById(jobID)
      .populate("recruiter")
      .populate("Relatedentreprise")
      .populate("recommendationCondidateurs")
      .populate("skills", "skillname");
    if (!job) {
      throw new Error("Job not found");
    }
    return job;
  } catch (error) {
    console.error(error);
    throw new Error("Server Error");
  }
}



async function getAllJob() {
  try {
    const jobs = await Job.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "recruiter",
          foreignField: "_id",
          as: "recruiter",
        },
      },
      {
        $unwind: "$recruiter",
      },
      {
        $lookup: {
          from: "entreprises",
          localField: "recruiter.entreprise",
          foreignField: "_id",
          as: "entreprise",
        },
      },
      {
        $unwind: "$entreprise",
      },
    ]);

    // Populating RelatedEntreprise for each job
    await Job.populate(jobs, { path: "Relatedentreprise" });
    if (!jobs || jobs.length === 0) {
      return { status: 404, message: "No jobs found" };
    }
    return { status: 200, data: jobs };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Server Error" };
  }
}

async function CloseJob(jobID) {
  try {
    const job = await Job.findById(jobID);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    const currentDate = new Date();
    const jobClosingDate = new Date(job.closeDate);
    
    // Comparaison des dates au format UTC
    const isJobClosed = currentDate.toISOString() > jobClosingDate.toISOString();
    
    // Si la date de fermeture est passée, le poste est fermé
    job.state = isJobClosed ? "Closed" : "Active";
    
    // Logging pour le débogage
    console.log(`Job ID: ${jobID} - Current State: ${job.state}`);
    console.log(`Current Date (UTC): ${currentDate.toISOString()}`);
    console.log(`Job Closing Date (UTC): ${jobClosingDate.toISOString()}`);

    sendMailToRecruiter(job);
    await job.save();
    return { job };
  } catch (error) {
    console.error("Error in CloseJob function:", error);
    res.status(500).json({ message: "Server Error" });
  }
}



async function sendMailTRecruiter(job) {
  const htmlTemplate = fs.readFileSync(
    'services/templateemails/EndedJobMail.html',
    'utf8',
  );
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'contact.fithealth23@gmail.com', // ethereal user
      pass: 'ebrh bilu ygsn zrkw', // ethereal password
    },
  });

  const msg = {
    from: {
      name: 'ConnectCareer Esprit',
      address: 'contact.fithealth23@gmail.com',
    },
    to: "yacinbnsalh@gmail.com",
    subject: `Scheduled Job Close `,
    html: htmlTemplate
      .replace('{{jobTitle}}', job.jobTitle),

  };
  const sendMail = async (transporter, msg) => {
    try {
      await transporter.sendMail(msg);
      console.log('Email has been sent !');
    } catch (error) {
      console.error(error);
    }
  };
  sendMail(transporter, msg);
}
module.exports = {
  getJobByRecruiter,
  getJobUpdateDetails,
  getJobDetails,
  AddJob,
  getAllJob,
  getJobsByEntrepriseId,
  CloseJob,
  summarizeJobFile,

};
