const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./prv.json');
const User = require('./models/user');
const Job = require('./models/job');
const app = express();
const port = 3001;

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
console.log("Connected to MongoDB");



/*
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  imageUrl: String,
});

const User = mongoose.model("User", userSchema);*/
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/',(req,res)=>{
  res.send('Helloo')
})



// Route for adding a job
app.post('/addJob', upload.single('logo'), async (req, res) => {
  try {
    const {
      jobPoster,
      jobDetails,
      companyDetails,
      termsAndConditions,
    } = req.body;

    // Validate job data
    if (!jobPoster || !jobDetails || !companyDetails || !termsAndConditions) {
      return res.status(400).json({ message: 'Invalid job data' });
    }

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
  jobPoster, 
  jobDetails,
  companyDetails,
  termsAndConditions,
  logo: logoUrl,
});

    // Save the job to the database
    await newJob.save();

    res.status(201).json({ message: 'Job added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding job' });
  }
});

// Route pour l'inscription d'un utilisateur

app.post("/inscriptionRecruiter", upload.any('image'), async (req, res) => {
  try{
    const {firstname , lastname , email , phoneNumber , gender , password , 
      jobTitle , jobType , CompanyName , CompanyAdress , CompanyCity , CompanyType ,
    matriculeFiscale  } = req.body;
    const role = "Recruiter"
    const newUser = new User({ firstname, lastname, email ,  phoneNumber ,gender ,
      password , jobTitle ,jobType , role });
    //await newUser.save();
    console.log(req.files);
    res.status(201).json({ message: "Utilisateur inscrit avec succès" });
  }
  catch(error){
    console.error(error);
  }
})

app.post("/inscription", upload.single('image'), async (req, res) => {
  try {
    const { username, password, email } = req.body;
    console.log(username, password, email);
    // Validation des données utilisateur
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ message: "Veuillez fournir tous les champs nécessaires." });
    }
    let imageUrl = '';
    if (req.file) {
      // Upload image to Firebase Storage
      const bucket = admin.storage().bucket();
      const file = bucket.file(req.file.originalname);

      await file.createWriteStream().end(req.file.buffer);

      // Get the public URL of the uploaded image
      imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${file.name}`;
    }
    // Création d'un nouvel utilisateur
    const newUser = new User({ username, password, email ,  imageUrl});

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
