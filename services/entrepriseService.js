const Entreprise = require("../models/entreprise");
const User = require("../models/user");

async function getListeEntreprise() {
  try {
    const recruiters = await User.find({ role: "Recruiter" }).populate(
      "entreprise"
    );
    return recruiters ;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
}
async function getAllEntreprise() {
  try {
    const entreprises = await Entreprise.find()
    return entreprises ;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
}
async function getEntrepriseDetails(entrepriseId) {
    try {
        // Find the entreprise by its ID
        const entreprise = await Entreprise.findById(entrepriseId);
    
        if (!entreprise) {
          return res.status(404).json({ message: 'Entreprise not found' });
        }
    
        return entreprise;
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
  }
module.exports = {
  getListeEntreprise,
  getEntrepriseDetails,
  getAllEntreprise
};
