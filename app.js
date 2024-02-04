const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const bcrypt = require("bcrypt");
const admin = require("firebase-admin");
const serviceAccount = require("./prv.json");
const User = require("./models/user");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const getListeOfRecruiter = require("./routes/recruiterapi/recruiter");
const CreateRecruiter = require("./routes/recruiterapi/createRecruiter");
const Authentificaiton = require("./routes/authentification");
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
app.post("/login", async (req, res) => {
  await Authentificaiton(req, res);
});
app.get("/recruiters", async (req, res) => {
  await getListeOfRecruiter(res);
});

app.post(
  "/inscriptionRecruiter",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "CompanyLogo", maxCount: 1 },
  ]),
  async (req, res) => {
    await CreateRecruiter(req, res, admin);
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
