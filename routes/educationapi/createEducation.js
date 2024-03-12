const Education = require('../../models/education');

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
      // Define the path where you want to store the resume files
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
    res
      .status(500)
      .json({
        message: "Une erreur s'est produite lors de la création de l'education",
      });
  }
};

module.exports = CreateEducation;
