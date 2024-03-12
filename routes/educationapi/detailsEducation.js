const Education = require('../../models/education');

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

module.exports = getListOfEducationById;
