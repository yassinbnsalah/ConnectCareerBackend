const Education = require('../models/education');
const User = require('../models/user');

const CreateEducation = async (req, res, admin) => {
  try {
    const {
      student, uni_name, diplome, startedOn, endAt,
    } = req.body;
    let Attestation = '';
    console.log(req.files.attestation[0]);
    if (req.files && req.files.attestation && req.files.attestation[0]) {
      const attestationFile = req.files.attestation[0];
      const AttestationBucket = admin.storage().bucket();
      const folderName = 'attestation';
      const fileName = attestationFile.originalname;
      const fileFullPath = `${folderName}/${fileName}`;
      const AttestationFileObject = AttestationBucket.file(fileFullPath);
      await AttestationFileObject.createWriteStream().end(
        attestationFile.buffer,
      );
      const attestation = `https://firebasestorage.googleapis.com/v0/b/${
        AttestationBucket.name
      }/o/${encodeURIComponent(fileFullPath)}?alt=media`;
      Attestation = attestation;
    }
    const user = await User.findOne({ _id: student });
    user.hasEducation = true;
    await user.save();
    const newEducation = new Education({
      student,
      uni_name,
      diplome,
      startedOn,
      endAt,
      Attestation,
    });
    await newEducation.save();
    res.status(201).json({ message: 'Education créée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la création de l'education",
    });
  }
};

const getListOfEducation = async (req, res) => {
  const { userId } = req.params;
  try {
    const educations = await Education.find({ student: userId }).sort({
      startedOn: -1,
    });
    res.json(educations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getListOfEducationById = async (req, res) => {
  const { Id } = req.params;
  try {
    const educations = await Education.findById(Id);

    if (!educations || educations.length === 0) {
      return res.status(404).json({ error: 'Education not found' });
    }

    res.json(educations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteEducationById = async (req, res) => {
  const { educationId } = req.params;

  try {
    const deletedEducation = await Education.findByIdAndDelete(educationId);

    if (!deletedEducation) {
      return res.status(404).json({ error: 'Education not found' });
    }

    res.json({ message: 'Education deleted successfully', deletedEducation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateEducation = async (req, res, admin) => {
  try {
    const { uni_name, diplome, startedOn, endAt } = req.body;

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

      // Await the 'finish' event of the upload stream to ensure the file is uploaded
      await new Promise((resolve, reject) => {
        uploadStream.on('finish', resolve);
        uploadStream.on('error', reject);
      });

      // Construct the URL for the uploaded attestation
      attestationURL = `https://firebasestorage.googleapis.com/v0/b/${AttestationBucket.name}/o/${encodeURIComponent(fileFullPath)}?alt=media`;
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
    res
      .status(500)
      .json({ message: "An error occurred while updating the Education" });
  }
};

module.exports = {
  CreateEducation,
  getListOfEducation,
  getListOfEducationById,
  deleteEducationById,
  updateEducation,
};
