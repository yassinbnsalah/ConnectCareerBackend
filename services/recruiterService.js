const Entreprise = require("../models/entreprise");
const User = require("../models/user");
const bcrypt = require("bcrypt");
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
    });
    await newUser.save();
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getListeRecruiter,
  createRecruiter,
};
