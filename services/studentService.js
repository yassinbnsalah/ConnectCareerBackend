const User = require("../models/user");

async function getListStudents() {
    try {
        const students = await User.find({ role: "Student" });
        return students;
    } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error");
    }
}

module.exports = {
    getListStudents
};