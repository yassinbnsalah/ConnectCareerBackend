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

    // Check if Attestation is provided in the request body
    const isAttestationProvided = req.files && req.files["attestation"] && req.files["attestation"][0];

    let Attestation = "";
    if (isAttestationProvided) {
      const attestationFile = req.files["attestation"][0];
      const AttestationBucket = admin.storage().bucket();
      const folderName = "attestation";
      const fileName = attestationFile.originalname;
      const fileFullPath = `${folderName}/${fileName}`;
      const AttestationFileObject = AttestationBucket.file(fileFullPath);

      await AttestationFileObject.createWriteStream().end(attestationFile.buffer);

      let attestation = `https://firebasestorage.googleapis.com/v0/b/${
        AttestationBucket.name
      }/o/${encodeURIComponent(fileFullPath)}?alt=media`;
      Attestation = attestation;
    }

    const experienceId = req.params.experienceId;
    const existingExperience = await Experience.findById(experienceId);

    if (!existingExperience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    // Update only if the fields are provided in the request body
    if (entrepriseName) {
      existingExperience.entrepriseName = entrepriseName;
    }
    if (typeExperience) {
      existingExperience.typeExperience = typeExperience;
    }
    if (Lieu) {
      existingExperience.Lieu = Lieu;
    }
    if (jobDescription) {
      existingExperience.jobDescription = jobDescription;
    }
    if (startedOn) {
      existingExperience.startedOn = startedOn;
    }
    if (endAt) {
      existingExperience.endAt = endAt;
    }
    if (entrepriseSecture) {
      existingExperience.entrepriseSecture = entrepriseSecture;
    }
    
    // Update Attestation only if it's provided in the request body
    if (isAttestationProvided) {
      existingExperience.Attestation = Attestation;
    }

    if (etat !== undefined) {
      existingExperience.etat = false;
    }

    await existingExperience.save();

    res.status(200).json({ message: "Experience updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating the experience" });
  }
};

module.exports = updateExperience;
