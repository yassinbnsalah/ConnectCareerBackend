const { CronJob } = require("cron");
const Job = require("../models/job");
const fs = require('fs')
const nodemailer = require('nodemailer');
const Event = require("../models/events");
exports.initScheduledJobs = () => {
  const scheduledJobFunction = new CronJob(
    "*/5 * * * * *",
    () => {
      console.log("I'm executed on a schedule!");
      // Add your custom logic here
    },
    null,
    true
  );
  scheduledJobFunction.start();
};

exports.initSendReports = (date, job) => {
  let dateConverted = new Date(date);
  const day = dateConverted.getDate();
  const month = dateConverted.getMonth();
  const year = dateConverted.getFullYear();

  const sendJobReport = new CronJob(
    `0 25 0 ${day} ${month+1} *`,
    () => {
      console.log("Sending Job Report");
      // Add your custom logic here
      CloseJob(job._id)
    },
    null,
    true
  );
  sendJobReport.start();
};



async function CloseJob(jobID) {
  try {
    const job = await Job.findById(jobID);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    job.state = "Close";
    sendMailTRecruiter(job);
    await job.save();
    return { job };
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}
async function sendMailTRecruiter(job) {
  const htmlTemplate = fs.readFileSync(
    'services/templateemails/EndedJobMail.html',
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
    to: "yacinbnsalh@gmail.com",
    subject: `Scheduled Job Close `,
    html: htmlTemplate 
    .replace('{{jobTitle}}', job.jobTitle),
    
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


exports.initPublishEvent = (date, event) => {
  let dateConverted = new Date(date);
  const day = dateConverted.getDate();
  const month = dateConverted.getMonth();
  const year = dateConverted.getFullYear();

  const publishEvent = new CronJob(
    `0 20 4 ${day} ${month+1} *`,
    () => {
      console.log("publishEvent");
      // Add your custom logic here
      updateEventState(event._id)
    },
    null,
    true
  );
  publishEvent.start();
};

async function updateEventState(eventID){
  try {
    const event = await Event.findById(eventID);
    if (!event) {
      return res.status(404).json({ message: "event not found" });
    }
    event.state = "Publish";
   
    await event.save();
    return { event };
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
  
}