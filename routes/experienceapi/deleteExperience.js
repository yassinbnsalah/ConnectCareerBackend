const Experience = require("../../models/experience");

const deleteExperienceById = async (req, res) => {
  const experienceId = req.params.experienceId;
  try {
    const deletedExperience = await Experience.findByIdAndDelete(experienceId);
    if (!deletedExperience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.json({ message: 'Experience deleted successfully', experience: deletedExperience });
  } catch (error) {
    console.error("Error deleting experience:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


module.exports = deleteExperienceById;
