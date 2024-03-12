const Education = require('../../models/education');

const deleteEducationById = async (req, res) => {
  const { educationId } = req.params;

  try {
    const deletedEducation = await Education.findByIdAndDelete(educationId);

    if (!deletedEducation) {
      return res.status(404).json({ error: 'Education not found' });
    }

    res.json({ message: 'Education deleted successfully', deletedEducation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = deleteEducationById;
