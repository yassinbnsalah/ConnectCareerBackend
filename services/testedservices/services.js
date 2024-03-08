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


  module.exports = {
    getRecruiterDetails
  };
  