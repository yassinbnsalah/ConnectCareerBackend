const Experience = require('../../models/experience');

const deleteExperienceById = async (req, res) => {
  const { experienceId } = req.params;

  try {
    const deletedExperience = await Experience.findByIdAndDelete(experienceId);

    if (!deletedExperience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.json({ message: 'Experience deleted successfully', deletedExperience });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = deleteExperienceById;
