const Event = require("../models/events");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const scheduledFunctions = require("../scheduledFunctions/crons");
const User = require("../models/user");
const Notification = require("../models/notification");
const sendEmail = async(req , res , eventId) => {
  try {
    const { targetliste , subject} = req.body;
    console.log(req.body);
    Emails  = new Set(); 
    ITOPTION = ['TWIN' , 'ARTIC' , 'SIM' ,'SLEAM' , 'NIDS', 'ERP-BI', 'SAE', 'SE', 'infini']
    const isAllITStudentsSelected = targetliste.includes("All IT Students");
    if(isAllITStudentsSelected){
      console.log("All IT Selected");
      const Students = await User.find({section:"IT"})
    
      Students.forEach(element => {
        Emails.add(element.email)
      });
    }else{
      for (const element of targetliste) {
        if (ITOPTION.includes(element)) {
          
          const Students2 = await User.find({ option: element });
          console.log(Students2);
          Students2.forEach(element2 => {
            Emails.add(element2.email);
          });
        }
      }
    }
    // All Bussiness Student
    const isAllBussinessStudentsSelected = targetliste.includes("All Bussiness Student");
    if(isAllBussinessStudentsSelected){
      const Students = await User.find({section:"Bussiness"})
     
      Students.forEach(element => {
        Emails.add(element.email)
      });
    }

    EMOPTION = ['EM' , 'MECA']
    for (const element of targetliste) {
      if (EMOPTION.includes(element)) {
     
        const Students3 = await User.find({ option: element });
        console.log(Students3);
        Students3.forEach(element3 => {
          Emails.add(element3.email);
        });
      }
    }
    // All IT Teachers
    const isAllITTeachersSelected = targetliste.includes("All IT Teachers");
    if(isAllITTeachersSelected){
      const Teachers = await User.find({role:"Teacher" , groupeRecherche: "Informatique"})
    
      Teachers.forEach(element => {
        Emails.add(element.email)
      });
    }else{
      ITOPTION = ['UP WEB' , 'UP JAVA' , 'UP GLBD' ,'UP ASI']
      for (const element of targetliste) {
        if (ITOPTION.includes(element)) {
         
          const Teachers = await User.find({role:"Teacher" , unites: element})
          
          Teachers.forEach(element3 => {
            Emails.add(element3.email);
          });
        }
      }
    }

    // ALL RECRUITERS
    const isAllRecruitersSelected = targetliste.includes("ALL RECRUITERS");
    if(isAllRecruitersSelected){
      const recruiters = await User.find({role:"Recruiter" })
     
      recruiters.forEach(element => {
        Emails.add(element.email)
      });
    }
    console.log(Emails);
    const FinalEmails = [...Emails];
    console.log(FinalEmails);
    console.log(subject);
    let eventID = req.params.id
    const event =  await Event.findById(eventID); 
    sendEventMail(FinalEmails, event.title, event.image, event.description,subject)
  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while creating or updating the event",
    });
  }
}
const CreateOrUpdateEvent = async (req, res, admin, eventId = null) => {
  try {
    const { title, description, state, category, publish_date ,eventDate} = req.body;

   
    let imageEvents = null;
    if (req.files && req.files.image && req.files.image[0]) {
      
      const imageFile = req.files.image[0];
      const imageBucket = admin.storage().bucket();

      const folderName = "eventImages";
      const fileName = imageFile.originalname;
      const fileFullPath = `${folderName}/${fileName}`;

      const imageFileObject = imageBucket.file(fileFullPath);

      await imageFileObject.createWriteStream().end(imageFile.buffer);

      imageEvents = `https://firebasestorage.googleapis.com/v0/b/${
        imageBucket.name
      }/o/${encodeURIComponent(fileFullPath)}?alt=media`;
    }

    if (eventId) {
      // Update existing event
      if (imageEvents == null ){
        await Event.findByIdAndUpdate(eventId, {
          title,
          description,
          state,
          category,
          eventDate,
          publish_date
        });
      }else{
        await Event.findByIdAndUpdate(eventId, {
          title,
          description,
          state,
          category,
          image: imageEvents,
          publish_date,
          eventDate
        });
       
      }
    
      res.status(200).json({ message: "Event updated successfully" });
    } else {
      console.log(state);
      // Create new event
      const newEvent = new Event({
        title,
        description,
        state:state,
        category,
        image: imageEvents,
        publish_date,
        eventDate
      });
   //   sendEventMail(["wiembenaraar2@gmail.com","benamorr.fedi@gmail.com"] , title , imageEvents ,description )
      await newEvent.save();
       // Send notification to the student
    const students = await User.find({ role: "Student" }); 

    const admina = await User.findOne({role:"Admin"});
    console.log(+admina)
    students.forEach(async student => {

    const notification = new Notification({
      recipient: student._id,
      sender:admina._id,
      message: `A new Event has published:"${title}"`,
      path : '/events',
    });
    await notification.save();

    });
      if(publish_date){
        scheduledFunctions.initPublishEvent(publish_date,newEvent);
      }
     
      res.status(201).json({ message: "New event created successfully" });
    }
   
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while creating or updating the event",
    });
  }
};



const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();

    res.status(200).json({ events });
  } catch (error) {
    console.error('Error fetching all events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllEventPublished = async (req, res) => {
  try {
    const events = await Event.find({state : "Publish"});

    res.status(200).json({ events });
  } catch (error) {
    console.error('Error fetching all events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const findEventByID = async (req ,res , eventID) => {
  try {
    const event = await Event.findById(eventID);

    res.status(200).json({ event });
  } catch (error) {
    console.error('Error fetching all events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const secretKey = 'qsdsqdqdssqds';
async function sendEventMail(emails, eventTitle, ImgURL, description,subject) {
  // create reusable transporter object using the default SMTP transport
  const htmlTemplate = fs.readFileSync(
    'services/templateemails/eventsMail.html',
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
   
    cc: emails,
    subject: subject,
    html: htmlTemplate
      .replace('{{eventTitle}}', eventTitle)
      .replace('{{ImgURL}}', ImgURL)
      .replace('{{description}}', description),
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
  sendEmail,
  CreateOrUpdateEvent,
  getAllEvents,
  getAllEventPublished,
  findEventByID
};
