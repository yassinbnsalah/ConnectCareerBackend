const Entreprise = require("../models/entreprise");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');

async function getListeRecruiter() {
  try {
    const recruiters = await User.find({ role: "Recruiter" }).populate(
      "entreprise"
    );
    return recruiters;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
    return res;
  }
}

async function createRecruiter(req, res, admin) {
  try {
    const {
      firstname,
      lastname,
      email,
      phoneNumber,
      gender,
      password,
      jobTitle,
      jobType,
      CompanyName,
      CompanyAdress,
      CompanyCity,
      CompanyType,
      matriculeFiscale,
      description,
    } = req.body;
    const role = "Recruiter";
    let profileImage = "";
    let CompanyLogo = "";
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
    if (req.files["CompanyLogo"]) {
      const CompanyLogoFile = req.files["CompanyLogo"][0];
      const CompanyLogoBucket = admin.storage().bucket();
      const CompanyLogoFileObject = CompanyLogoBucket.file(
        CompanyLogoFile.originalname
      );
      await CompanyLogoFileObject.createWriteStream().end(
        CompanyLogoFile.buffer
      );
      CompanyLogo = `https://firebasestorage.googleapis.com/v0/b/${CompanyLogoBucket.name}/o/${CompanyLogoFileObject.name}`;
    }
    const entreprise = new Entreprise({
      CompanyName,
      CompanyAdress,
      CompanyCity,
      CompanyType,
      matriculeFiscale,
      description,
      CompanyLogo,
    });
    await entreprise.save();
    let Hpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstname,
      lastname,
      email,
      phoneNumber,
      gender,
      password,
      Hpassword,
      jobTitle,
      jobType,
      role,
      profileImage,
      entreprise,
      isVerify: false,
    });
    await newUser.save();
   // sendMailtorecruiter(email,firstname+lastname);
  } catch (error) {
    console.error(error);
  }
}

async function verifyrecruiter(email) {
  try {
    const recruiter = await User.find({ email: email });
    console.log(recruiter);
    if (recruiter.length != 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}
const secretKey = "qsdsqdqdssqds";
async function sendMailtorecruiter(email,fullname) {
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
    html: htmlTemplate.replace('{{username}}', fullname).replace('{{token}}', token),
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
async function getRecruiterDetails(recruiterId) {
  try {
    const recruiter = await User.findById(recruiterId).populate("entreprise");
    return recruiter;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
}
async function updateRecruiter(req,res,admin) {
  try {
    console.log(req.body);
    const updatedRecruiter = await User.findByIdAndUpdate(
      req.params.recruiterId,
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
      updatedRecruiter.profileImage = profileImage
      await updatedRecruiter.save()
    }
   
 
    return updatedRecruiter;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
}
module.exports = {
  getListeRecruiter,
  createRecruiter,
  verifyrecruiter,
  getRecruiterDetails,
  updateRecruiter,
};
