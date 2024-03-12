const Experience = require("../../models/experience");

const updateExperience = async (req, res, admin) => {
  try {
    const {
      entrepriseName,
      typeExperience,
      Lieu,
      jobDescription,
      startedOn,
      endAt,
      etat,
      entrepriseSecture,
    } = req.body;

    const experienceId = req.params.experienceId;
    const update = { entrepriseName, typeExperience, Lieu, jobDescription, startedOn, endAt, etat, entrepriseSecture };

    let attestationURL = "";
    if (req.files && req.files["attestation"] && req.files["attestation"][0]) {
      const attestationFile = req.files["attestation"][0];
      const AttestationBucket = admin.storage().bucket();
      const fileFullPath = `attestation/${attestationFile.originalname}`;

      // Uploading the file
      const uploadStream = AttestationBucket.file(fileFullPath).createWriteStream();
      uploadStream.end(attestationFile.buffer);
      await new Promise((resolve, reject) => {
        uploadStream.on('finish', resolve);
        uploadStream.on('error', reject);
      });

      attestationURL = `https://firebasestorage.googleapis.com/v0/b/${AttestationBucket.name}/o/${encodeURIComponent(fileFullPath)}?alt=media`;
      update.Attestation = attestationURL; // Ensuring to only add Attestation if the file was provided
    }

    // Directly update the document in the database
    const updatedExperience = await Experience.findByIdAndUpdate(
      experienceId, 
      { $set: update },
      { new: true }
    );

    if (!updatedExperience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.status(200).json({ message: "Experience updated successfully", experience: updatedExperience });
  } catch (error) {
    console.error("Error updating experience:", error);
    res.status(500).json({ message: "An error occurred while updating the experience" });
  }
};
module.exports = updateExperience;
