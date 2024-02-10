const User = require("../../models/user");
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

    });
    await newUser.save();
    res.status(201).json({ message: "Utilisateur inscrit avec succès" });
  } catch (error) {
    console.error(error);
  }
}

module.exports = CreateStudent;
