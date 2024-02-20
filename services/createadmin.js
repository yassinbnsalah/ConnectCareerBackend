const bcrypt = require("bcrypt");
const User = require("../models/user");
const CreateAdmin = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    const role = "Admin";
    console.log(req.body);
    let hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      email,
      password, // Consider removing this line if you don't need to store the plain password
      Hpassword: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "ADMIN inscrit avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = CreateAdmin;
