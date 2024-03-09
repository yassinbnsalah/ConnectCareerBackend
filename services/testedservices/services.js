const Education = require("../../models/education");
const User = require("../../models/user");



async function getRecruiterDetails(recruiterId) {
    try {
      const recruiter = await User.findById(recruiterId);
      return recruiter;
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error");
    }
  }
  async function getListOfEducation(userId) {
    try {
      const educations = await Education.find({ student: userId }).sort({
        startedOn: -1,
      });
      return educations;
    } catch (error) {
      console.error("Error in getListOfEducation:", error.message);
      // Return a structured error response
      return { error: "Internal Server Error" };
    }
  }
  
  

  module.exports = {
    getRecruiterDetails,
    getListOfEducation
  };
  