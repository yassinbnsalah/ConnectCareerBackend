const Experience = require("../../models/experience");

const updateExperience = async (req, res, admin) => {
  try {
    const {
      // You can include the fields you want to update here
      entrepriseName,
      typeExpérience,
      Lieu,
      jobDescription,
      startedOn,
      endAt,
      entrepriseSecture,
    } = req.body;

    // Assuming you have an identifier for the experience, like an ID
    const experienceId = req.params.experienceId;

    // Find the experience by ID
    const existingExperience = await Experience.findById(experienceId);

    if (!existingExperience) {
      return res.status(404).json({ message: "Experience not found" });
    }
    if (entrepriseName) {
      existingExperience.entrepriseName = entrepriseName;
    }
    if (typeExpérience) {
      existingExperience.typeExpérience = typeExpérience;
    }
    if (Lieu) {
      existingExperience.Lieu = Lieu;
    }
    if (jobDescription) {
      existingExperience.jobDescription = jobDescription;
    }
    if (startedOn) {
      existingExperience.startedOn = startedOn;
    }
    if (endAt) {
      existingExperience.endAt = endAt;
    }
    if (entrepriseSecture) {
      existingExperience.entrepriseSecture = entrepriseSecture;
    }

    // Save the updated experience
    await existingExperience.save();

    res.status(200).json({ message: "Experience updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating the experience" });
  }
};

module.exports = updateExperience;
