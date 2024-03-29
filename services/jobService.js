const Entreprise = require("../models/entreprise");
const Job = require("../models/job");
const Skills = require("../models/skills");
const User = require("../models/user");
const admin = require("firebase-admin");
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

    let jobFileUrl = "";

    if (req.files && req.files.jobFile && req.files.jobFile[0]) {
      const jobFile = req.files.jobFile[0];
      const bucket = admin.storage().bucket();

      const folderName = "jobFiles";
      const fileName = `${Date.now()}_${jobFile.originalname}`;
      const fileFullPath = `${folderName}/${fileName}`;

      const file = bucket.file(fileFullPath);

      await file.save(jobFile.buffer);

      jobFileUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(fileFullPath)}?alt=media`;
    }
    console.log(jobFileUrl);
    const newJob = new Job({
      recruiter,
      jobTitle,
      location,
      typeofworkplace,
      jobType,
      salary,
      description,
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

    await newJob.save();
    let entreprise;
    if (entrepriseID) {
       entreprise = await Entreprise.findById(entrepriseID);
      if (!entreprise) {
        return res.status(404).json({ error: "Entreprise not found" });
      }
      entreprise.nbOpportunitees += 1;

      await entreprise.save();
      newJob.Relatedentreprise = entreprise;
    } else {
       entreprise = await Entreprise.findById(user.entreprise);
      entreprise.nbOpportunitees = entreprise.nbOpportunitees + 1;
      await entreprise.save();

      newJob.Relatedentreprise = entreprise;
    }
    const stats = entreprise.stats
    console.log(stats);
    const STATA = await Stats.findById(stats)
    STATA.totalNBOpportunite += 1 ; 
    if(jobType=="fullTime"){
      STATA.nbFullTimeOP += 1 
    }else if (jobType=="Summer internship"){
      STATA.nbSummerOP += 1 
    }else if (jobType=="PFE"){
      STATA.nbPFEOP += 1 
    }
    await STATA.save()
    if (closeDate != "null") {
      console.log("we ll send reports at" + closeDate);
      scheduledFunctions.initSendReports(closeDate);
    }

    await newJob.save();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error adding job" });
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
      return res.status(404).json({ message: "Job not found" });
    }
    return job;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

async function getJobUpdateDetails(jobID) {
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
    job.state = "Close";
    await job.save();
    return { job };
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}
module.exports = {
  getJobByRecruiter,
  getJobUpdateDetails,
  getJobDetails,
  AddJob,
  getAllJob,
  getJobsByEntrepriseId,
  CloseJob,
};
