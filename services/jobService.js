const Entreprise = require("../models/entreprise");
const Job = require("../models/job");
const Skills = require("../models/skills");
const User = require("../models/user");

async function getJobByRecruiter(userId) {
  try {
    const jobs = await Job.find({ recruiter: userId });
    if (!jobs) {
      return res.status(404).json({ message: "No jobs found for this user" });
    }
    return jobs;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

async function AddJob(req, res) {
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
      isActive,
      duration,
      yearOfExperience,
      cible,
      closeDate,
    } = req.body;
    
    let user = await User.findById(recruiter);
    if (user.nbopportunite) {
      user.nbopportunite = user.nbopportunite + 1;
    } else {
      user.nbopportunite = 1;
    }
    await user.save();
    let skillsJob = [];
    let SKillTab = JSON.parse(skills);
    
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
    console.log(skillsJob);
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
      skills : skillsJob , 
      closeDate,
    });
    if (entrepriseID) {
      let entreprise = await Entreprise.findById(entrepriseID);
      newJob.Relatedentreprise = entreprise;
    }
    await newJob.save();
  } catch (error) {
    console.error(error);
  }
}

async function getJobDetails(jobID) {
  try {
    const job = await Job.findById(jobID).populate("recruiter").populate("skills","skillname");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return job;
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

module.exports = {
  getJobByRecruiter,
  getJobDetails,
  AddJob,
  getAllJob,
};
