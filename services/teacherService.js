const User = require("../models/user");

async function getListTeachers() {
    try {
      const teachers = await User.find({ role: "Teacher" });
      return teachers;
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error");
    }
  }
  module.exports = {
    getListTeachers,
  }; 