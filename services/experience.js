const Experience = require("../models/experience");

const confirmedExperience = async (req, res, admin) => {
  try {
    const { etat } = req.body;

    // Assuming you have an identifier for the experience, like an ID
    const experienceId = req.params.experienceId;

    // Find the experience by ID
    const existingExperience = await Experience.findById(experienceId);

    if (!existingExperience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    // Update only the 'etat' property if it is provided in the request body
    if (etat !== undefined) {
      existingExperience.etat = etat;
    }

    // Save the updated experience
    await existingExperience.save();

    res.status(200).json({ message: "Experience updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the experience" });
  }
};

const CreateExperience = async (req, res, admin) => {
  try {
    const {
      student,
      entrepriseName,
      typeExperience,
      Lieu,
      jobDescription,
      startedOn,
      endAt,

      entrepriseSecture,
    } = req.body;

    console.log(req.body);

    let Attestation = null; // Initialize Attestation to null

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

      let attestation = `https://firebasestorage.googleapis.com/v0/b/${
        AttestationBucket.name
      }/o/${encodeURIComponent(fileFullPath)}?alt=media`;
      Attestation = attestation;
    }

    const newExperience = new Experience({
      student,
      entrepriseName,
      typeExperience,
      Lieu,
      jobDescription,
      startedOn,
      endAt: endAt || null,
      etat: false,
      entrepriseSecture,
      Attestation: Attestation, 
    });

    await newExperience.save();

    res.status(201).json({ message: "Experience créée avec succès" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message:
          "Une erreur s'est produite lors de la création de l'expérience",
      });
  }
};

const deleteExperienceById = async (req, res) => {
  const experienceId = req.params.experienceId;

  try {
    const deletedExperience = await Experience.findByIdAndDelete(experienceId);

    if (!deletedExperience) {
      return res.status(404).json({ error: "Experience not found" });
    }

    res.json({ message: "Experience deleted successfully", deletedExperience });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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
    const isAttestationProvided =
      req.files && req.files["attestation"] && req.files["attestation"][0];

    let Attestation = "";
    if (isAttestationProvided) {
      const attestationFile = req.files["attestation"][0];
      const AttestationBucket = admin.storage().bucket();
      const folderName = "attestation";
      const fileName = attestationFile.originalname;
      const fileFullPath = `${folderName}/${fileName}`;
      const AttestationFileObject = AttestationBucket.file(fileFullPath);

      await AttestationFileObject.createWriteStream().end(
        attestationFile.buffer
      );

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
    res
      .status(500)
      .json({ message: "An error occurred while updating the experience" });
  }
};
const getListOfExperience = async (req, res) => {
  const userId = req.params.userId;
  try {
    const experiences = await Experience.find({ student: userId }).sort({ startedOn: -1 });

    res.json(experiences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getListOfExperienceById = async (req, res) => {
  const Id = req.params.Id;
try {
  const experiences = await Experience.findById( Id );

  if (!experiences || experiences.length === 0) {
    return res.status(404).json({ error: 'Experiences not found' });
  }

  res.json(experiences);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
}
}
module.exports = {
  confirmedExperience,
  CreateExperience,
  deleteExperienceById,
  updateExperience,
  getListOfExperience,
  getListOfExperienceById
};
