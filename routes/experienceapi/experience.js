const Experience = require("../../models/experience");

const getListOfExperience = async (req, res) => {
  const userId = req.params.userId;
  try {
    const experiences = await Experience.find({ student: userId }).sort({ startedOn: -1 });

    res.json(experiences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = getListOfExperience;
