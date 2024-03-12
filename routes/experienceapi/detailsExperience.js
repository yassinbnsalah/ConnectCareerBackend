const Experience = require('../../models/experience');

const getListOfExperienceById = async (req, res) => {
  const { Id } = req.params;
  try {
    const experiences = await Experience.findById(Id);

    if (!experiences || experiences.length === 0) {
      return res.status(404).json({ error: 'Experiences not found' });
    }

    res.json(experiences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = getListOfExperienceById;
