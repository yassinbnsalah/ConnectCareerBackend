const User = require("../models/user");

async function getListTeachers() {
    try {
      return  User.find({ role: "Teacher" });

    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error");
    }
  }
  module.exports = {
    getListTeachers,
  }; 