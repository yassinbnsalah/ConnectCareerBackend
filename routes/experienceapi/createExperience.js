const Experience = require("../../models/experience");

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
      
            entrepriseSecture
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
            Attestation: Attestation, // Set Attestation based on the condition
        });

        await newExperience.save();

        res.status(201).json({ message: "Experience créée avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la création de l'expérience" });
    }
}

module.exports = CreateExperience;
