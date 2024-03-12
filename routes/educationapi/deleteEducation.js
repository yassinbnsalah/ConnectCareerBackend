const Education = require("../../models/education");

const deleteEducationById = async (req, res) => {
  const educationId = req.params.educationId;
  try {
    const deletedEducation = await Education.findByIdAndDelete(educationId);
    if (!deletedEducation) {
      return res.status(404).json({ error: 'Education not found' });
    }
    res.json({ message: 'Education deleted successfully', education: deletedEducation });
  } catch (error) {
    console.error("Error deleting education:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = deleteEducationById;
