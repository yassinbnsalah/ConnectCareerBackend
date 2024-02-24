const User = require("../models/user");

const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Authentification = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("entreprise");
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const passwordMatch = await bcrypt.compare(password, user.Hpassword);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "1h",
    });
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error logging in" });
  }
};
const AuthentificationAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const role = "Admin";
    // Find the user by username
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if the provided password matches the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.Hpassword);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "1h",
    });

    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error logging in" });
  }
};
const secretKey = 'qsdsqdqdssqds';
const ForgetPassword = async (req, res) => {
  console.log("Received request to reset password:", req.body.email);
  const { email } = req.body;
  const token = jwt.sign({ email }, secretKey, { expiresIn: "1d" });
  // create reusable transporter object using the default SMTP transport
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
    subject: "ResetPassword",
    text: "text: `Click on the following link to reset your password: http://localhost:3000/resetpassword/${token}`,",
    html: `<b><b>Hello World ? <a href="http://localhost:3000/resetpassword/${token}">reset Your password</a></b>`,
  };
  const sendMail = async (transporter, msg) => {
    try {
      await transporter.sendMail(msg);
      res.send("Email has been sent ! ");
      console.log("Email has been sent !");
    } catch (error) {
      console.error(error);
    }
  };
  sendMail(transporter, msg);
};
const ReceiveToken = async(req, res) =>{
    const token = req.params.token;

    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        console.error(err);
        return res.status(401).json({ message: 'Token invalide ou expiré' });
      }
      const userEmail = decoded.email;
      try {
        const newPassword = req.body.newPassword;
        let Hpassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await User.findOneAndUpdate({ email: userEmail }, 
          { password: newPassword  ,Hpassword : Hpassword}, 
          { new: true });
        if (!updatedUser) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
  
        console.log('Password reset successful for user:', userEmail);
        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
      }
    });
}
module.exports = {
  Authentification,
  AuthentificationAdmin,
  ForgetPassword,
  ReceiveToken
};
