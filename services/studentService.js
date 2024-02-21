const User = require("../models/user");
async function getStudentDetails(studentId) {
  try {
    const student = await User.findById(studentId);
    return student;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
}
async function getListStudents() {
  try {
    const students = await User.find({ role: "Student" });
    return students;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
}

async function getRequestListe() {
    try {
        const students = await User.find({ role: "Student", request: true });
        console.log(students);
        return students;
    } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error");
    }
}
async function updateStudent(studentId, updates) {
  try {
    const updatedStudent = await User.findByIdAndUpdate(
      studentId,
      { $set: updates },
      { new: true }
    );
    return updatedStudent;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
}
async function becomeAlumni(studentId, req, res, admin) {
  try {
    const state = "En cours de traitement";
    let diploma = "";

    if (req.files && req.files["diploma"]) {
      const DiplomaFile = req.files["diploma"][0];
      const DiplomaBucket = admin.storage().bucket();
      // Set the path where you want to store the diploma files
      const folderName = "diplomas";
      const fileName = DiplomaFile.originalname;
      const fileFullPath = `${folderName}/${fileName}`;

      const DiplomaFileObject = DiplomaBucket.file(fileFullPath);

      await DiplomaFileObject.createWriteStream().end(DiplomaFile.buffer);

      diploma = `https://firebasestorage.googleapis.com/v0/b/${
        DiplomaBucket.name
      }/o/${encodeURIComponent(fileFullPath)}?alt=media`;
    }

    const updatedStudent = await User.findByIdAndUpdate(
      studentId,
      { $set: { diploma, state, request: true } },
      { new: true }
    );

    return updatedStudent;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
}
module.exports = {
  getListStudents,
  becomeAlumni,
  getStudentDetails,
  getRequestListe,
  updateStudent
};
