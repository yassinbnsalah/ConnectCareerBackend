const Education = require("../../models/education");

const getListOfEducationById = async (req, res) => {
  const Id = req.params.Id;
  try {
    const education = await Education.findById(Id);
    if (!education) {
      return res.status(404).json({ error: 'Education not found' });
    }
    res.json(education);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = getListOfEducationById;