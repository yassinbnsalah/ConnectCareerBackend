const Entreprise = require("../../models/entreprise");
const User = require("../../models/user");


//get entreprise details by id
async function getEntrepriseDetails(entrepriseId) {
  try {
    const entreprise = await Entreprise.findById(entrepriseId);

    if (!entreprise) {
      throw new Error("Entreprise not found"); // Utiliser une exception au lieu de res.status(404)
    }

    return entreprise; // Retourner l'entreprise directement
  } catch (error) {
    console.error(error);
    throw new Error("Server Error"); // Lancer une exception pour les erreurs serveur
  }
}


async function getRecruiterDetails(recruiterId) {
    try {
      const recruiter = await User.findById(recruiterId);
      return recruiter;
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error");
    }
  }


  module.exports = {
    getRecruiterDetails,
    getEntrepriseDetails
  };
  