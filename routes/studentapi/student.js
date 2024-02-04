const User = require("../../models/user");


const getListeOfStudent = async (res) => {
    try {
      // Query the database to find users with the role "Recruiter"
      const students = await User.find({ role: 'Student' });
  
      // Send the list of recruiters as a JSON response
      res.json(students);
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  module.exports = getListeOfStudent;
  