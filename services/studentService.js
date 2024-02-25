const User = require("../models/user");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const CreateStudent = async (req, res, admin) => {
  try {
    const {
      firstname,
      lastname,
      email,
      phoneNumber,
      gender,
      password,
      uniqueid,
      institution,
      diploma,
 
    } = req.body;
    const role = "Student";
    let profileImage = "";

    if (req.files["profileImage"]) {
      const profileImageFile = req.files["profileImage"][0];
      const imageExtension = profileImageFile.originalname.split(".").pop();
      const imageName = `${firstname}${lastname}.${imageExtension}`;

      const profileImageBucket = admin.storage().bucket();
      const profileImageFileObject = profileImageBucket.file(imageName);
      await profileImageFileObject
        .createWriteStream()
        .end(profileImageFile.buffer);
      profileImage = `https://firebasestorage.googleapis.com/v0/b/${profileImageBucket.name}/o/${profileImageFileObject.name}`;
    }



    let Hpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstname,
      lastname,
      email,
      phoneNumber,
      gender,
      uniqueid,
      institution,
      password,
      Hpassword,
      role,
      profileImage,
      isVerify:0,
      diploma,

    });
    await newUser.save();
    sendMailtoStudent(email,firstname+lastname);
    res.status(201).json({ message: "Utilisateur inscrit avec succès" });
  } catch (error) {
    console.error(error);
  }
}
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
async function updateStudent2(req,res,admin) {
  try {
    const updatedStudent = await User.findByIdAndUpdate(
      req.params.studentId,
      { $set: req.body },
      { new: true }
    );
    let profileImage ="" ; 
    if (req.files["profileImage"]) {
      console.log("new Profile image");
      const profileImageFile = req.files["profileImage"][0];
      const imageExtension = profileImageFile.originalname.split(".").pop();
      const imageName = `${req.body.email}.${imageExtension}`;

      const profileImageBucket = admin.storage().bucket();
      const profileImageFileObject = profileImageBucket.file(imageName);
      await profileImageFileObject
        .createWriteStream()
        .end(profileImageFile.buffer);
      profileImage = `https://firebasestorage.googleapis.com/v0/b/${profileImageBucket.name}/o/${profileImageFileObject.name}`;
      updatedStudent.profileImage = profileImage
      await updatedStudent.save()
    }
    // demain 
    if (req.files["resume"]) {
  
      const resumeFile = req.files["resume"][0];
        const ResumeBucket = admin.storage().bucket();
        const folderName = "student";
        const fileName = resumeFile.originalname;
        const fileFullPath = `${folderName}/${fileName}`;

        const ResumeFileObject = ResumeBucket.file(fileFullPath);

        await ResumeFileObject.createWriteStream().end(resumeFile.buffer);

        let resume = `https://firebasestorage.googleapis.com/v0/b/${
          ResumeBucket.name
        }/o/${encodeURIComponent(fileFullPath)}?alt=media`;
      updatedStudent.resume = resume
      await updatedStudent.save()
    }
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
const secretKey = "qsdsqdqdssqds";
async function sendMailtoStudent(email, fullname) {
  const token = jwt.sign({ email }, secretKey, { expiresIn: "1d" });
  // create reusable transporter object using the default SMTP transport
  const htmlTemplate = fs.readFileSync(
    "services/templateemails/confirmeMail.html",
    "utf8"
  );
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "contact.fithealth23@gmail.com", // ethereal user
      pass: "ebrh bilu ygsn zrkw", // ethereal password
    },
  });

  const msg = {
    from: {
      name: "ConnectCareer Esprit",
      address: "contact.fithealth23@gmail.com",
    },
    to: `${email}`,
    subject: "CONNECTCAREER Account Confirmation",
    html: htmlTemplate
      .replace("{{username}}", fullname)
      .replace("{{token}}", token),
  };
  const sendMail = async (transporter, msg) => {
    try {
      await transporter.sendMail(msg);
      console.log("Email has been sent !");
    } catch (error) {
      console.error(error);
    }
  };
  sendMail(transporter, msg);
}
module.exports = {
  getListStudents,
  becomeAlumni,
  getStudentDetails,
  getRequestListe,
  sendMailtoStudent,
  updateStudent,
  updateStudent2,
  CreateStudent
};
