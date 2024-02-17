const Education = require("../../models/education");

const getListOfEducation = async (req, res) => {
  const userId = req.params.userId;
  try {
    const educations = await Education.find({ student: userId });


    res.json(educations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = getListOfEducation;