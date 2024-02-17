const Job = require("../models/job");

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
     
      location,
      typeofworkplace,
      jobType,
      salary,
      description,

      termsAndConditions,
      isActive,
    } = req.body;

    console.log(req.body);

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
    });
    await newJob.save();
  } catch (error) {
    console.error(error);
  }
}

async function getJobDetails(jobID) {
  try {
    const job = await Job.findById(jobID).populate("recruiter");
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
    if (!jobs || jobs.length === 0) {
      return { status: 404, message: "No jobs found" }; // Return a status code and message
    }
    return { status: 200, data: jobs }; // Return a status code and the jobs data
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Server Error" }; // Return a status code and error message
  }
}

module.exports = {
  getJobByRecruiter,
  getJobDetails,
  AddJob,
  getAllJob,
};
