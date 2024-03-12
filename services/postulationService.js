const Job = require("../models/job");
const Postulation = require("../models/postulation");
const User = require("../models/user");
async function CreateNewCandidate(req, res, admin) {
  try {
    const { owner, job, useMyResume } = req.body;
    const State = "InProgress";
    let Resume = "";
    let user = await User.findById(owner);
    if (user.nbapplies) {
      user.nbapplies = user.nbapplies + 1;
    } else {
      user.nbapplies = 1;
    }
    let jobD = await Job.findById(job);
    jobD.nbapplies = jobD.nbapplies+1
    await jobD.save();
    await user.save();
    if (useMyResume == "false") {
      if (req.files["resume"]) {
        const resumeFile = req.files["resume"][0];
        const ResumeBucket = admin.storage().bucket();
        // Define the path where you want to store the resume files
        const folderName = "resumes";
        const fileName = resumeFile.originalname;
        const fileFullPath = `${folderName}/${fileName}`;

        const ResumeFileObject = ResumeBucket.file(fileFullPath);

        await ResumeFileObject.createWriteStream().end(resumeFile.buffer);

        let resume = `https://firebasestorage.googleapis.com/v0/b/${
          ResumeBucket.name
        }/o/${encodeURIComponent(fileFullPath)}?alt=media`;
        Resume = resume;
      }
    } else {
      Resume = user.resume;
    }
    let MotivationLetter;
    if (req.files["MotivationLettre"]) {
      const motivationFile = req.files["MotivationLettre"][0];
      const motivationBucket = admin.storage().bucket();
      // Define the path where you want to store the resume files
      const folderName = "motivations";
      const fileName = motivationFile.originalname;
      const fileFullPath = `${folderName}/${fileName}`;
      const motivationFileObject = motivationBucket.file(fileFullPath);
      await motivationFileObject.createWriteStream().end(motivationFile.buffer);

      let MotivationLettre = `https://firebasestorage.googleapis.com/v0/b/${
        motivationBucket.name
      }/o/${encodeURIComponent(fileFullPath)}?alt=media`;
      MotivationLetter = MotivationLettre;
    }
    const nPostulation = new Postulation({
      owner,
      job,
      State,
      Resume,
      MotivationLetter,
    });

   await nPostulation.save();
  } catch (error) {
    console.error(error);
  }
}

async function getApplications(owner) {
  try {
    return await Postulation.find({ owner: owner }).populate(
      "job"
    );

  } catch (error) {
    console.error("Error fetching postulations by owner:", error);
    throw error;
  }
}

async function verifyIfApplicatedOnOpportunite(owner, job) {
  try {
    return await Postulation.find({ owner: owner, job: job });
 
  } catch (error) {
    console.error("Erroo");
    throw error;
  }
}

async function getApplicationbyJobID(job) {
  try {
    return await Postulation.find({ job: job }).populate("owner");

  } catch (error) {
    console.error("Erroo");
    throw error;
  }
}
async function getApplicationDetails(applicationID) {
  try {
    return await Postulation.findById(applicationID).populate(
      "owner"
    );

  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function UpdateApplicationState(applicationiD, state) {
  try {
    const application = await Postulation.findById(applicationiD);
    application.State = state;
    await application.save();
    return application;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  CreateNewCandidate,
  getApplications,
  verifyIfApplicatedOnOpportunite,
  getApplicationbyJobID,
  getApplicationDetails,
  UpdateApplicationState,
};
