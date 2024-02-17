const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const multer = require("multer");
const bcrypt = require("bcrypt");
const admin = require("firebase-admin");
const serviceAccount = require("./prv.json");
const User = require("./models/user");
const Job = require("./models/job");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const getListeOfRecruiter = require("./routes/recruiterapi/recruiter");
const CreateRecruiter = require("./routes/recruiterapi/createRecruiter");
const Authentificaiton = require("./routes/authentification");
const getListeOfStudent = require("./routes/studentapi/student");
const CreateStudent = require("./routes/studentapi/createStudent");
const CreateExperience = require("./routes/experienceapi/createExperience");
const CreateAdmin = require("./services/createadmin");
const AuthentificaitonAdmin = require("./routes/authentificationadmin");
const GetJobDetails = require("./routes/jobapi/JobDetails");
const GetJobDetailsData = require("./routes/jobapi/JobDetailsData");
const getEntrepriseDetails = require("./routes/entrepriseapi/entrepriseDetails");
const path = require("path");
const nodemailer = require('nodemailer');
const getListOfExperience = require("./routes/experienceapi/experience");
const deleteExperienceById = require("./routes/experienceapi/deleteExperience");
const updateExperience = require("./routes/experienceapi/updateExperience");
const getListOfExperienceById = require("./routes/experienceapi/detailsExperience");
const CreateEducation = require("./routes/educationapi/createEducation");
const getListOfEducation = require("./routes/educationapi/education");
const getListOfEducationById = require("./routes/educationapi/detailsEducation");
const deleteEducationById = require("./routes/educationapi/deleteEducation");
const updateEducation = require("./routes/educationapi/updateEducation");
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
app.get("/entreprise/:idEntreprise", async (req, res) => {
  await getEntrepriseDetails(req, res);
});

app.post("/login", async (req, res) => {
  await Authentificaiton(req, res);
});

app.post("/loginadmin", async (req, res) => {
  await AuthentificaitonAdmin(req, res);
});
app.get("/recruiters", async (req, res) => {
  await getListeOfRecruiter(res);
});
// Route for adding a job
app.post("/addJob", upload.single("logo"), async (req, res) => {
  try {
    const {
      recruiter,
      jobTitle,
      department,
      location,
      jobType,
      salary,
      description,

      termsAndConditions,
    } = req.body;

    console.log(recruiter);

    // Upload logo to Firebase Storage if provided
    let logoUrl = "";
    //  if (req.file) {
    //    const bucket = admin.storage().bucket();
    //    const file = bucket.file(req.file.originalname);
    //    await file.createWriteStream().end(req.file.buffer);
    //    logoUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${file.name}`;
    //  }

    // Create a new job
    const newJob = new Job({
      recruiter,
      jobTitle,
      department,
      location,
      jobType,
      salary,
      description,

      termsAndConditions,
    });

    // Save the job to the database
    await newJob.save();

    res.status(201).json({ message: "Job added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding job" });
  }
});
app.get('/jobs/:userId', async (req, res) => {
  await GetJobDetails(req,res);
});

const secretKey = 'qsdsqdqdssqds';
app.post('/activate-account', async (req, res) => {
  const {email} = req.body;
  const token = jwt.sign({ email }, secretKey, { expiresIn: '1d' });
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
      service:"gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: "contact.fithealth23@gmail.com", // ethereal user
          pass: "ebrh bilu ygsn zrkw", // ethereal password
      },
  });
  
  const msg = {
      from:{
        name:'ConnectCareer Esprit',
        address:"contact.fithealth23@gmail.com"}, // sender address
      to: `${email}`, // list of receivers
      subject: "Sup", // Subject line
      text: "text: `Click on the following link to activate your account: http://localhost:3001/activate/${token}`,",
      html:`<b><b>Hello World ? <a href="http://localhost:3001/activate/${token}">Activate Your Account</a></b>`, // plain text body

      //pdf & image
      /*attachments:[{
        filename:'serie1PL_Correction.pdf',
        path:path.join(__dirname,'serie1PL_Correction.pdf'),
        contentType:'application/pdf'
      },
      {
        filename:'Samsung.png',
        path:path.join(__dirname,'Samsung.png'),
        contentType: 'image/jpg'
      },
    ]*/
    }
  const sendMail =async(transporter,msg)=> {
    try {
      await transporter.sendMail(msg);
      console.log("Email has been sent !");
    }catch(error){
      console.error(error);
    }
  }
  sendMail(transporter,msg);
 
});

app.get('/job/:jobId', async (req, res) => {
  await GetJobDetailsData(req,res);
});
app.post("/createAdmin", async (req, res) => {
  await CreateAdmin(req, res);
});


app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

const uploadd = multer({ limits: { fileSize: 50 * 1024 * 1024 } });
app.post(
  "/createEducation",
  uploadd.fields([
    { name: "attestation", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      await CreateEducation(req, res, admin); // Pass admin object here
      console.log('Received payload size:', req.headers['content-length']);
    } catch (error) {
      console.error(error);
      console.log('Received payload size:', req.headers['content-length']);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
app.get("/educations/:userId", async (req, res) => {
  await getListOfEducation(req, res);
});
app.get('/educationsDetail/:Id', async (req, res) => {
  await getListOfEducationById(req, res);
});
app.delete('/educations/:educationId', async (req, res) => {
  await deleteEducationById(req,res);
});
app.put('/educations/:educationId', async (req, res) => {
  await updateEducation(req, res);
});

app.post("/createExperience", async (req, res) => {
  await CreateExperience(req, res);
});
app.delete('/experiences/:experienceId', async (req, res) => {
  await deleteExperienceById(req,res);
});
app.put('/experiences/:experienceId', async (req, res) => {
  await updateExperience(req, res);
});
app.get('/experiencesDetail/:Id', async (req, res) => {
  await getListOfExperienceById(req, res);
});
app.get("/experiences/:userId", async (req, res) => {
  await getListOfExperience(req, res);
});
app.get('/activate/:token', (req, res) => {
  const token = req.params.token;

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token invalide ou expiré' });
    }

    // Assuming 'decoded.email' is the email associated with the user
    const userEmail = decoded.email;

    try {
      // Update the user in the database to set 'isVerify' to true
      const updatedUser = await User.findOneAndUpdate({ email: userEmail }, { isVerify: true }, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      res.status(200).json({ message: 'Compte activé avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de l\'activation du compte' });
    }
  });
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
  upload.fields([{ name: "profileImage", maxCount: 1 }]),
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
app.post("/checkUniqueid", (req, res) => {
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
app.post("/checkEmail", (req, res) => {
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