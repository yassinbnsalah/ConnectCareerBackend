const Experience = require("../../models/experience");

const CreateExperience = async (req, res, admin) => {
  try {
    const {
      student,
      entrepriseName,
      typeExpérience,
      Lieu,
      jobDescription,
      startedOn,
      endAt,
      entrepriseSecture,
    } = req.body; 
console.log(req.body);
    const newExperience = new Experience({
      student,
      entrepriseName,
      typeExpérience,
      Lieu,
      jobDescription,
      startedOn,
      endAt,
      entrepriseSecture,
    });

    await newExperience.save();
    
    res.status(201).json({ message: "Experience créée avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite lors de la création de l'expérience" });
  }
}

module.exports = CreateExperience;
