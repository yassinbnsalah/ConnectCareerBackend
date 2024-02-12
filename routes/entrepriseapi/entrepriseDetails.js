const Entreprise = require("../../models/entreprise");
const getEntrepriseDetails = async (req , res) => {
    const entrepriseId = req.params.idEntreprise;

    try {
      // Find the entreprise by its ID
      const entreprise = await Entreprise.findById(entrepriseId);
  
      if (!entreprise) {
        return res.status(404).json({ message: 'Entreprise not found' });
      }
  
      res.json(entreprise);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  } ; 
  
  module.exports = getEntrepriseDetails;
  