const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const admin = require("firebase-admin");
const serviceAccount = require("./prv.json");
const User = require("./models/user");
const Entreprise = require("./models/entreprise");
const cors = require("cors");

const app = express();
const port = 3001;
app.use(cors());
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "twinerz-fceb6.appspot.com",
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb+srv://yessinebensalah:14501578@connectcareerdb.3vb0ahj.mongodb.net/"
);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post(
  "/inscriptionRecruiter",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "CompanyLogo", maxCount: 1 },
  ]),
  async (req, res) => {
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
      const newUser = new User({
        firstname,
        lastname,
        email,
        phoneNumber,
        gender,
        password,
        jobTitle,
        jobType,
        role,
        profileImage,
        entreprise,
      });
      await newUser.save();
      res.status(201).json({ message: "Utilisateur inscrit avec succès" });
    } catch (error) {
      console.error(error);
    }
  }
);
//// DONT USE IT 
app.post("/inscription", upload.single("image"), async (req, res) => {
  try {
    const { username, password, email } = req.body;
    console.log(username, password, email);
    // Validation des données utilisateur
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ message: "Veuillez fournir tous les champs nécessaires." });
    }
    let imageUrl = "";
    if (req.file) {
      // Upload image to Firebase Storage
      const bucket = admin.storage().bucket();
      const file = bucket.file(req.file.originalname);

      await file.createWriteStream().end(req.file.buffer);

      // Get the public URL of the uploaded image
      imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${file.name}`;
    }
    // Création d'un nouvel utilisateur
    const newUser = new User({ username, password, email, imageUrl });

    // Sauvegarde dans la base de données
    await newUser.save();

    res.status(201).json({ message: "Utilisateur inscrit avec succès" });
  } catch (error) {
    console.error(error);

    // Gestion des erreurs liées à la base de données
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        message: "Validation des données échouée",
        errors: error.errors,
      });
    } else if (error.code === 11000) {
      res
        .status(409)
        .json({ message: "Nom dutilisateur ou adresse e-mail déjà utilisé" });
    } else {
      res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
  }
});


app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
