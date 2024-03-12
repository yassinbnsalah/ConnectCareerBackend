const Experience = require("../../models/experience");

const getListOfExperienceById = async (req, res) => {
  const Id = req.params.Id;
  try {
    const experience = await Experience.findById(Id);
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    res.json(experience);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = getListOfExperienceById;