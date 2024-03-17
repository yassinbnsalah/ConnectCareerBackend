const Entreprise = require('../../models/entreprise');
const Education = require('../../models/education');
const User = require('../../models/user');

// get entreprise details by id
async function getEntrepriseDetails(entrepriseId) {
  try {
    const entreprise = await Entreprise.findById(entrepriseId);

    if (!entreprise) {
      throw new Error('Entreprise not found'); // Utiliser une exception au lieu de res.status(404)
    }

    return entreprise; // Retourner l'entreprise directement
  } catch (error) {
    console.error(error);
    throw new Error('Server Error'); // Lancer une exception pour les erreurs serveur
  }
}

async function getRecruiterDetails(recruiterId) {
  try {
    const recruiter = await User.findById(recruiterId);
    return recruiter;
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
}
async function getListOfEducation(userId) {
  try {
    const educations = await Education.find({ student: userId }).sort({
      startedOn: -1,
    });
    return educations;
  } catch (error) {
    console.error('Error in getListOfEducation:', error.message);
    // Return a structured error response
    return { error: 'Internal Server Error' };
  }
}
  
  async function getListOfExperience(userId) {
    try {
      const experiences = await Experience.find({ student: userId }).sort({
        startedOn: -1,
      });
      return experiences;
    } catch (error) {
      console.error("Error in getListOfExperience:", error.message);
      // Return a structured error response
      return { error: "Internal Server Error" };
    }
  }
    module.exports = {
    getRecruiterDetails,
    getEntrepriseDetails,
    getListOfEducation,
    getListOfExperience
  };

