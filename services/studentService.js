const jwt = require('jsonwebtoken');
const fs = require('fs');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('../models/user');
const Entreprise = require('../models/entreprise');
const Stats = require('../models/stats');

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
      diploma,
      TwoFactorAuthentication,
      role,
    } = req.body;
    
    let profileImage = '';

    if (req.files.profileImage) {
      const profileImageFile = req.files.profileImage[0];
      const imageExtension = profileImageFile.originalname.split('.').pop();
      const imageName = `${firstname}${lastname}.${imageExtension}`;

      const profileImageBucket = admin.storage().bucket();
      const profileImageFileObject = profileImageBucket.file(imageName);
      await profileImageFileObject
        .createWriteStream()
        .end(profileImageFile.buffer);
      profileImage = `https://firebasestorage.googleapis.com/v0/b/${profileImageBucket.name}/o/${profileImageFileObject.name}`;
    }

    const Hpassword = await bcrypt.hash(password, 10);
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
      TwoFactorAuthentication,
      profileImage,
      isVerify: 0,
      diploma,
    });

    if (TwoFactorAuthentication === 'true') {
      const secret = speakeasy.generateSecret({ length: 20 });
      newUser.secret = secret.base32;

      let qrCodeUrl;

      try {
        qrCodeUrl = await new Promise((resolve, reject) => {
          QRCode.toDataURL(secret.otpauth_url, (err, image_data) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              resolve(image_data);
            }
          });
        });
        console.log('qrcode', qrCodeUrl);
        newUser.qrCode = qrCodeUrl;
      } catch (error) {
        console.error('Error generating QR code:', error);
        return res.status(500).send('Internal Server Error');
      }
    }

    try {
      // Save the user and obtain the saved user object
      const savedUser = await newUser.save();

      // Additional logic, if needed, after saving the user
      sendMailtoStudent(email, firstname + lastname);

      // Send the success response with the created user data to the client
      res.status(201).json({
        message: 'Utilisateur inscrit avec succès',
        user: savedUser, // Include the user data in the response
      });
    } catch (error) {
      console.error('Error saving user:', error);
      return res.status(500).send('Internal Server Error');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

async function getStudentDetails(studentId) {
  try {
    const student = await User.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }
    return student;
  } catch (error) {
    console.error(`Error fetching student details for ID ${studentId}:`, error);
    throw new Error(`Failed to fetch student details for ID ${studentId}`);
  }
}

async function getListStudents() {
  try {
    const students = await User.find({ role: 'Student' });
    return students;
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
}

async function getRequestListe() {
  try {
    const students = await User.find({ role: 'Student', request: true });
    console.log(students);
    return students;
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
}

async function updateStudent2(req, res, admin) {
  try {
    console.log('*******');
    console.log(req.body);
    const updatedStudent = await User.findByIdAndUpdate(
      req.params.studentId,
      { $set: req.body },
      { new: true },
    );
    let profileImage = '';
    if (req.files.profileImage) {
      console.log('new Profile image');
      const profileImageFile = req.files.profileImage[0];
      const imageExtension = profileImageFile.originalname.split('.').pop();
      const imageName = `${req.body.email}.${imageExtension}`;

      const profileImageBucket = admin.storage().bucket();
      const profileImageFileObject = profileImageBucket.file(imageName);
      await profileImageFileObject
        .createWriteStream()
        .end(profileImageFile.buffer);
      profileImage = `https://firebasestorage.googleapis.com/v0/b/${profileImageBucket.name}/o/${profileImageFileObject.name}`;
      updatedStudent.profileImage = profileImage;
      await updatedStudent.save();
    }

    if (req.files.resume) {
      const resumeFile = req.files.resume[0];
      const ResumeBucket = admin.storage().bucket();
      const folderName = 'student';
      const fileName = resumeFile.originalname;
      const fileFullPath = `${folderName}/${fileName}`;

      const ResumeFileObject = ResumeBucket.file(fileFullPath);

      await ResumeFileObject.createWriteStream().end(resumeFile.buffer);

      const resume = `https://firebasestorage.googleapis.com/v0/b/${
        ResumeBucket.name
      }/o/${encodeURIComponent(fileFullPath)}?alt=media`;
      updatedStudent.resume = resume;
      await updatedStudent.save();
    }

    if (req.files.carteEtudiant) {
      const carteEtudiantFile = req.files.carteEtudiant[0];
      const CarteEtudiantBucket = admin.storage().bucket();
      const folderName = 'student';
      const fileName = carteEtudiantFile.originalname;
      const fileFullPath = `${folderName}/${fileName}`;

      const CarteEtudiantFileObject = CarteEtudiantBucket.file(fileFullPath);

      await CarteEtudiantFileObject.createWriteStream().end(
        carteEtudiantFile.buffer,
      );

      const carteEtudiant = `https://firebasestorage.googleapis.com/v0/b/${
        CarteEtudiantBucket.name
      }/o/${encodeURIComponent(fileFullPath)}?alt=media`;
      updatedStudent.carteEtudiant = carteEtudiant;
      await updatedStudent.save();
    }
    return updatedStudent;
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
}
// async function becomeAlumni(studentId, req, res, admin) {
//   try {
//     const state = 'En cours de traitement';
//     let diploma = '';

//     if (req.files && req.files.diploma) {
//       const DiplomaFile = req.files.diploma[0];
//       const DiplomaBucket = admin.storage().bucket();
//       // Set the path where you want to store the diploma files
//       const folderName = 'diplomas';
//       const fileName = DiplomaFile.originalname;
//       const fileFullPath = `${folderName}/${fileName}`;

//       const DiplomaFileObject = DiplomaBucket.file(fileFullPath);

//       await DiplomaFileObject.createWriteStream().end(DiplomaFile.buffer);

//       diploma = `https://firebasestorage.googleapis.com/v0/b/${
//         DiplomaBucket.name
//       }/o/${encodeURIComponent(fileFullPath)}?alt=media`;
//     }

//     const updatedStudent = await User.findByIdAndUpdate(
//       studentId,
//       { $set: { diploma, state, request: true } },
//       { new: true },
//     );

//     return updatedStudent;
//   } catch (error) {
//     console.error(error);
//     throw new Error('Internal Server Error');
//   }
// }
async function becomeAlumni(studentId, req, admin) {
  try {
    const {
      CompanyName,
      CompanyAdress,
      CompanyCity,
      CompanyType,
      matriculeFiscale,
      description,
    } = req.body;
    let CompanyLogo = '';
    if (req.files && req.files.CompanyLogo) {
      const CompanyLogoFile = req.files.CompanyLogo[0];
      const CompanyLogoBucket = admin.storage().bucket();
      const CompanyLogoFileObject = CompanyLogoBucket.file(
        CompanyLogoFile.originalname,
      );
      await CompanyLogoFileObject.createWriteStream().end(
        CompanyLogoFile.buffer,
      );
      CompanyLogo = `https://firebasestorage.googleapis.com/v0/b/${CompanyLogoBucket.name}/o/${CompanyLogoFileObject.name}`;
    }
    /////
    const stats = new Stats({
      totalNBOpportunite : 0 , 
      acceptedOpportunite : 0 , 
      nbSummerOP : 0 , 
      acceptedSummerOP : 0 , 
      nbPFEOP : 0 , 
      acceptedPFE : 0 ,
      nbFullTimeOP : 0 , 
      acceptedFullTimeOP : 0 ,
      TotalReach : 0 ,
    })
    await stats.save();
    const entreprise = new Entreprise({
      CompanyName,
      CompanyAdress,
      CompanyCity,
      CompanyType,
      matriculeFiscale,
      description,
      CompanyLogo,
      stats
    });
    await entreprise.save();

    // Update the user document with the enterprise's ID
    const updatedUser = await User.findByIdAndUpdate(
      studentId,
      { $set: { entreprise: entreprise._id, role: 'Alumni' } },
      { new: true }
    );

    return updatedUser; // Return the updated user
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
}
 

const secretKey = 'qsdsqdqdssqds';
async function sendMailtoStudent(email, fullname) {
  const token = jwt.sign({ email }, secretKey, { expiresIn: '1d' });
  // create reusable transporter object using the default SMTP transport
  const htmlTemplate = fs.readFileSync(
    'services/templateemails/confirmeMail.html',
    'utf8',
  );
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'contact.fithealth23@gmail.com', // ethereal user
      pass: 'ebrh bilu ygsn zrkw', // ethereal password
    },
  });

  const msg = {
    from: {
      name: 'ConnectCareer Esprit',
      address: 'contact.fithealth23@gmail.com',
    },
    to: `${email}`,
    subject: 'CONNECTCAREER Account Confirmation',
    html: htmlTemplate
      .replace('{{username}}', fullname)
      .replace('{{token}}', token),
  };
  const sendMail = async (transporter, msg) => {
    try {
      await transporter.sendMail(msg);
      console.log('Email has been sent !');
    } catch (error) {
      console.error(error);
    }
  };
  sendMail(transporter, msg);
}
module.exports = {
  getListStudents,
  becomeAlumni,
  getStudentDetails,
  getRequestListe,
  sendMailtoStudent,
  updateStudent2,
  CreateStudent,
};
