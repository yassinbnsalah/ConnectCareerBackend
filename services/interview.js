const fs = require('fs');
const nodemailer = require('nodemailer');
const Interview = require('../models/interview.js');
const Job = require('../models/job.js');
const Postulation = require('../models/postulation.js');
const User = require('../models/user.js');

async function getInterviewByRecruiter(userID) {
  try {
    const interviews = await Interview.find({ recruiter: userID }).populate('inviter');
    return interviews;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'ServerError' });
  }
}

async function getInterviewsByApplicationandUser(applicationID, userID) {
  try {
    console.log('');
    const interviews = await Interview.find({ inviter: userID, applicationref: applicationID });
    return interviews;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'ServerError' });
  }
}
async function createInterview(req, res) {
  try {
    const {
      recruiter,
      inviter,
      roomID,
      dateInterview,
      heure,
      minutes,
      applicationref,
      description,
    } = req.body;
    console.log(req.body);
    const newInterview = new Interview({
      recruiter,
      inviter,
      roomID,
      dateInterview,
      heure,
      minutes,
      applicationref,
      description,
    });
    const user = await User.findById(inviter);
    const recruiterRealName = await User.findById(recruiter).populate('entreprise');
    console.log(applicationref);
    const job = await Job.findById(applicationref).populate("Relatedentreprise");
    sendMailToStudent(
      user.email,
      user.firstname + user.lastname,
      `${dateInterview.split('T')[0]} ${heure}:${minutes}`,
      roomID,
      job.Relatedentreprise.CompanyName,
      job.jobTitle,
    );
    await newInterview.save();
  } catch (error) {
    console.error(error);
  }
}
const secretKey = 'qsdsqdqdssqds';
async function sendMailToStudent(email, fullname, date, roomID, entreprisename, jobTitle) {
  const htmlTemplate = fs.readFileSync(
    'services/templateemails/notifymeet.html',
    'utf8',
  );
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
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
    subject: `${jobTitle} State Information`,
    html: htmlTemplate
      .replace('{{fullname}}', fullname)
      .replace('{{fullname2}}', fullname)
      .replace('{{entreprisename}}', entreprisename)
      .replace('{{date}}', date)
      .replace('{{roomID}}', roomID)
      .replace('{{jobtitle}}', jobTitle),
  };
  
    try {
      await transporter.sendMail(msg);
      console.log('Email has been sent !');
    } catch (error) {
      console.error(error);
    }

}
async function VerifyInterview(roomID, idUser) {
  const interview = await Interview.find({ roomID });
  console.log(interview);
  if (interview.length > 0) {
    console.log('interview Existe');
    const interviewPre = await Interview.find({
      roomID,
      $or: [{ inviter: idUser }, { recruiter: idUser }],
    });
    if (interviewPre.length > 0) {
      return true;
    }
    return false;
  }
  console.log('no interview Existe');
  return false;
}

async function deleteInterview(id) {
  const interview = await Interview.find({ _id: id });
  console.log(interview);
  if (interview.length > 0) {
    interview.delete();
  } else {
    console.log('no interview Existe');
    return false;
  }
}
module.exports = {
  getInterviewByRecruiter,
  createInterview,
  getInterviewsByApplicationandUser,
  VerifyInterview,
};
