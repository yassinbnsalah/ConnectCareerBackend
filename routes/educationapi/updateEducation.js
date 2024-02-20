const Education = require("../../models/education");

const updateEducation = async (req, res, admin) => {
  try {
    const {
      uni_name,
      diplome,
      startedOn,
      endAt,
    } = req.body;

    let Attestation = ""; // Default value is an empty string

    // Check if attestation file is provided in the request
    if (req.files && req.files["attestation"] && req.files["attestation"][0]) {
      const attestationFile = req.files["attestation"][0];
      const AttestationBucket = admin.storage().bucket();
      // Define the path where you want to store the resume files
      const folderName = "attestation";
      const fileName = attestationFile.originalname;
      const fileFullPath = `${folderName}/${fileName}`;

      const AttestationFileObject = AttestationBucket.file(fileFullPath);

      await AttestationFileObject.createWriteStream().end(
        attestationFile.buffer
      );

      // Update attestation only if a new file is provided
      Attestation = `https://firebasestorage.googleapis.com/v0/b/${
        AttestationBucket.name
      }/o/${encodeURIComponent(fileFullPath)}?alt=media`;
    }

    // Assuming you have an identifier for the education, like an ID
    const educationId = req.params.educationId;

    // Find the education by ID
    const existingEducation = await Education.findById(educationId);

    if (!existingEducation) {
      return res.status(404).json({ message: "Education not found" });
    }

    // Update education fields if provided
    if (uni_name) {
      existingEducation.uni_name = uni_name;
    }
    if (diplome) {
      existingEducation.diplome = diplome;
    }
    if (startedOn) {
      existingEducation.startedOn = startedOn;
    }
    if (endAt) {
      existingEducation.endAt = endAt;
    }

    // Update attestation only if a new file is provided
    if (Attestation) {
      existingEducation.Attestation = Attestation;
    }

    // Save the updated Education
    await existingEducation.save();

    res.status(200).json({ message: "Education updated successfully" });
  } catch (error) {
    console.error("Error updating education:", error);
    res.status(500).json({ message: "An error occurred while updating the Education" });
  }
};

module.exports = updateEducation;
