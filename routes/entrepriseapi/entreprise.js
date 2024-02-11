const User = require("../../models/user");


const getListeOfEntreprise = async (res) => {
    try {
      // Query the database to find users with the role "Recruiter"
      const recruiters = await User.find({ role: 'Recruiter' }).populate('entreprise');
  
      // Send the list of recruiters as a JSON response
      res.json({"entreprises":recruiters});
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  module.exports = getListeOfRecruiter;
  