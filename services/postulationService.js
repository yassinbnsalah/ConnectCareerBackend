const Postulation = require("../models/postulation");
async function CreateNewCandidate(req, res, admin) {
  try {
    const { owner, job, useMyResume } = req.body;
    const State = "InProgress";
    let Resume = "";
    console.log(useMyResume);
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

module.exports = {
  CreateNewCandidate,
};
