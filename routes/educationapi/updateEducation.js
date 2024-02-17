const Education = require("../../models/education");

const updateEducation = async (req, res, admin) => {
  try {
    const {
      uni_name,
      diplome,
      startedOn,
      endAt,
      Attestation,
    } = req.body;

    // Assuming you have an identifier for the education, like an ID
    const educationId = req.params.educationId;

    // Find the education by ID
    const existingEducation = await Education.findById(educationId);

    if (!existingEducation) {
      return res.status(404).json({ message: "Experience not found" });
    }
    if (uni_name) {
        existingEducation.uni_name = uni_name;
    }
    if (diplome) {
        existingEducation.diplome = diplome;
    }
    if (startedOn) {
        existingEducation.startedOn = startedOn;
    }
    if (endAt) {
        existingEducation.endAt = endAt;
    }
    if (Attestation) {
        existingEducation.Attestation = Attestation;
    }

    // Save the updated Education
    await existingEducation.save();

    res.status(200).json({ message: "Education updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating the Education" });
  }
};

module.exports = updateEducation;
