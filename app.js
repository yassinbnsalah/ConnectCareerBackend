const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const bcrypt = require("bcrypt");
const admin = require("firebase-admin");
const serviceAccount = require("./prv.json");
const User = require("./models/user");
const Job = require('./models/job');
const cors = require("cors");
const jwt = require("jsonwebtoken");
const getListeOfRecruiter = require("./routes/recruiterapi/recruiter");
const CreateRecruiter = require("./routes/recruiterapi/createRecruiter");
const Authentificaiton = require("./routes/authentification");
const getListeOfStudent = require("./routes/studentapi/student");
const CreateStudent = require("./routes/studentapi/createStudent");
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
// Route for adding a job
app.post('/addJob', upload.single('logo'), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      jobTitle,
      department,
      location,
      jobType,
      salary,
      description,
      companyName,
      companyWebsite,
      industry,
     
      companyDescription,
      termsAndConditions,
    } = req.body;

   

     // Upload logo to Firebase Storage if provided
     let logoUrl = '';
     if (req.file) {
       const bucket = admin.storage().bucket();
       const file = bucket.file(req.file.originalname);
       await file.createWriteStream().end(req.file.buffer);
       logoUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${file.name}`;
     }

    // Create a new job
    const newJob = new Job({
      firstName,
      lastName,
      email,
      phoneNumber,
      jobTitle,
      department,
      location,
      jobType,
      salary,
      description,
      companyName,
      companyWebsite,
      industry,
      logo: logoUrl,
      companyDescription,
      termsAndConditions,
    });

    // Save the job to the database
    await newJob.save();

    res.status(201).json({ message: 'Job added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding job' });
  }
});


   

   

app.get("/students", async (req, res) => {
  await getListeOfStudent(res);
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
app.post(
  "/signupStudent",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
  ]),
  async (req, res) => {
    await CreateStudent(req, res, admin);
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
// In-memory data store to simulate database
const existingUniqueIds = new Set();

// Endpoint to check the uniqueness of uniqueid
app.post('/checkUniqueid', (req, res) => {
  const { uniqueid } = req.body;

  // Check if uniqueid is already in use
  if (existingUniqueIds.has(uniqueid)) {
    return res.status(200).json({ isUnique: false });
  }

  // If uniqueid is unique, add it to the in-memory store (simulating database)
  existingUniqueIds.add(uniqueid);

  return res.status(200).json({ isUnique: true });
});

const existingEmails = new Set();

// Endpoint to check the uniqueness of email
app.post('/checkEmail', (req, res) => {
  const { email } = req.body;

  // Check if email is already in use
  if (existingEmails.has(email)) {
    return res.status(200).json({ isUnique: false });
  }

  // If email is unique, add it to the in-memory store (simulating database)
  existingEmails.add(email);

  return res.status(200).json({ isUnique: true });
});
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
