const Job = require('../models/job');
const Postulation = require('../models/postulation');
const Stats = require('../models/stats');
const User = require('../models/user');
const fs = require('fs');
const nodemailer = require('nodemailer');
async function CreateNewCandidate(req, res, admin) {
  try {
    const { owner, job, useMyResume } = req.body;
    console.log(req.body);
    const State = 'InProgress';
    let Resume = '';
    const user = await User.findById(owner);
    if (user.nbapplies) {
      user.nbapplies += 1;
    } else {
      user.nbapplies = 1;
    }
    const jobD = await Job.findById(job);
    jobD.nbapplies += 1;
    await jobD.save();
    await user.save();
    if (useMyResume == 'false') {
      if (req.files.resume) {
        const resumeFile = req.files.resume[0];
        const ResumeBucket = admin.storage().bucket();
        // Define the path where you want to store the resume files
        const folderName = 'resumes';
        const fileName = resumeFile.originalname;
        const fileFullPath = `${folderName}/${fileName}`;

        const ResumeFileObject = ResumeBucket.file(fileFullPath);

        await ResumeFileObject.createWriteStream().end(resumeFile.buffer);

        const resume = `https://firebasestorage.googleapis.com/v0/b/${
          ResumeBucket.name
        }/o/${encodeURIComponent(fileFullPath)}?alt=media`;
        Resume = resume;
      }
    } else {
      Resume = user.resume;
    }
    let MotivationLetter;
    if (req.files.MotivationLettre) {
      const motivationFile = req.files.MotivationLettre[0];
      const motivationBucket = admin.storage().bucket();
      // Define the path where you want to store the resume files
      const folderName = 'motivations';
      const fileName = motivationFile.originalname;
      const fileFullPath = `${folderName}/${fileName}`;
      const motivationFileObject = motivationBucket.file(fileFullPath);
      await motivationFileObject.createWriteStream().end(motivationFile.buffer);

      const MotivationLettre = `https://firebasestorage.googleapis.com/v0/b/${
        motivationBucket.name
      }/o/${encodeURIComponent(fileFullPath)}?alt=media`;
      MotivationLetter = MotivationLettre;
    }
    const nPostulation = new Postulation({
      owner,
      job,
      State,
      Resume,
      MotivationLetter,
    });

    await nPostulation.save();
    return nPostulation
  } catch (error) {
    console.error(error);
  }
}

async function getApplications(owner) {
  try {
    const postulations = await Postulation.find({ owner }).populate(
      'job',
    );
      return (postulations)
  } catch (error) {
    console.error('Error fetching postulations by owner:', error);
    throw error;
  }
}

async function verifyIfApplicatedOnOpportunite(owner, job) {
  try {
    const postula = await Postulation.find({ owner, job });
    return postula;
  } catch (error) {
    console.error('Erroo');
    throw error;
  }
}

async function getApplicationbyJobID(job) {
  try {
    const applications = await Postulation.find({ job }).populate('owner');
    return applications;
  } catch (error) {
    console.error('Erroo');
    throw error;
  }
}
async function getApplicationDetails(applicationID) {
  try {
    const application = await Postulation.findById(applicationID).populate(
      'owner',
    );
      return (application)
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function UpdateApplicationState(applicationiD, state) {
  try {
    const application = await Postulation.findById(applicationiD);
    application.State = state;
    await application.save();
    if (state == "Accepted"){
      let job = await Job.findById(application.job).populate("recruiter").populate("Relatedentreprise")
      let statsID = job.Relatedentreprise.stats
      const STATA  = await Stats.findById(statsID)
      STATA.acceptedOpportunite += 1 ; 
      if(job.jobType=="fullTime"){
        STATA.acceptedFullTimeOP += 1 
      }else if (job.jobType=="Summer internship"){
        STATA.acceptedSummerOP += 1 
      }else if (job.jobType=="PFE"){
        STATA.acceptedPFE += 1 
      }
      STATA.TotalReach = STATA.totalNBOpportunite/STATA.acceptedFullTimeOP*100; 
      STATA.save()
      sendMailTRecruiter(job.recruiter?.email)
    }
    if(state =="Cancel"){
      await application.deleteOne()
      return null
    }else {
      return application;
    }
  
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function sendMailTRecruiter(email) {
  const htmlTemplate = fs.readFileSync(
    'services/templateemails/thanksMail.html',
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
    subject: `Thank you For Accepting `,
    html: htmlTemplate
    
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
  CreateNewCandidate,
  getApplications,
  verifyIfApplicatedOnOpportunite,
  getApplicationbyJobID,
  getApplicationDetails,
  UpdateApplicationState,
};
