const User = require("../../models/user");


const getListeOfStudent = async (res) => {
    try {
  
      const students = await User.find({ role: 'Student' });
  

      res.json(students);
    } catch (error) {

      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  module.exports = getListeOfStudent;
  