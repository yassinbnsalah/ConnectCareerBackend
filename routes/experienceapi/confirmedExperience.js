const Experience = require("../../models/experience");

const confirmedExperience = async (req, res) => {
  try {
    const { etat } = req.body;
    const experienceId = req.params.experienceId;

    // Directly update the document in the database
    const updatedExperience = await Experience.findByIdAndUpdate(experienceId, { $set: { etat: etat } }, { new: true, runValidators: true });

    if (!updatedExperience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.status(200).json({ message: "Experience updated successfully", experience: updatedExperience });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating the experience" });
  }
};

module.exports = confirmedExperience;
