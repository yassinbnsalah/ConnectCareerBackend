const Experience = require("../../models/experience");

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
    res.status(500).json({ message: "An error occurred while updating the experience" });
  }
};

module.exports = confirmedExperience;
