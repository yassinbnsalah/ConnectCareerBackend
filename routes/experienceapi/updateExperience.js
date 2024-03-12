const Experience = require("../../models/experience");
const { uploadFileToStorage } = require('../../utils/storage'); 
const updateExperience = async (req, res, admin) => {
  try {
    const updateData = extractUpdateData(req.body);
    const attestationUrl = await handleFileUpload(req.files, admin);
    if (attestationUrl) updateData.Attestation = attestationUrl;

    const updatedExperience = await Experience.findByIdAndUpdate(req.params.experienceId, updateData, { new: true });
    if (!updatedExperience) return res.status(404).json({ message: "Experience not found" });

    res.status(200).json({ message: "Experience updated successfully", experience: updatedExperience });
  } catch (error) {
    console.error("Error updating experience:", error);
    res.status(500).json({ message: "An error occurred while updating the experience" });
  }
};

function extractUpdateData({ entrepriseName, typeExperience, Lieu, jobDescription, startedOn, endAt, etat, entrepriseSecture }) {
  return { entrepriseName, typeExperience, Lieu, jobDescription, startedOn, endAt, etat, entrepriseSecture };
}

async function handleFileUpload(files, admin) {
  if (!files || !files["attestation"] || !files["attestation"][0]) return null;
  return uploadFileToStorage(files["attestation"][0], admin); // This utility function handles the file upload and returns the URL
}

module.exports = updateExperience;
