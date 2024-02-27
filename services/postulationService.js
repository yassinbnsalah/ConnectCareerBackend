const Postulation = require("../models/postulation");
const User = require("../models/user");
async function CreateNewCandidate(req, res, admin) {
  try {
    const { owner, job, useMyResume } = req.body;
    const State = "InProgress";
    let Resume = "";
    console.log(useMyResume);
    let user = await User.findById(owner);
    if(user.nbapplies){
      user.nbapplies = user.nbapplies + 1 
    }else{
      user.nbapplies = 1 
    }
    
    await user.save()
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
    }
    const nPostulation = new Postulation({
      owner,
      job,
      State,
      Resume,
    });

    await nPostulation.save();
  } catch (error) {
    console.error(error);
  }
}

async function getApplications(owner) {
  try {
    const postulations = await Postulation.find({ owner: owner }).populate(
      "job"
    );
    return postulations;
  } catch (error) {
    console.error("Error fetching postulations by owner:", error);
    throw error;
  }
}

async function verifyIfApplicatedOnOpportunite(owner, job) {
  try {
    const postula = await Postulation.find({ owner: owner, job: job });
    return postula;
  } catch (error) {
    console.error("Erroo");
    throw error;
  }
}

async function getApplicationbyJobID(job) {
  try {
    const applications = await Postulation.find({ job: job }).populate("owner");
    return applications;
  } catch (error) {
    console.error("Erroo");
    throw error;
  }
}
async function getApplicationDetails(applicationID) {
  try {
    const application = await Postulation.findById(applicationID).populate("owner");
    return application;
  } catch (error) {
    console.error(error); 
    throw error;
  }
}

async function UpdateApplicationState(applicationiD , state){
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
  UpdateApplicationState
};
