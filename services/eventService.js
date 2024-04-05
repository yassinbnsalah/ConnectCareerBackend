const Event = require("../models/events");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const scheduledFunctions = require("../scheduledFunctions/crons");
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
async function sendEventMail(emails, eventTitle , ImgURL , description) {
  // create reusable transporter object using the default SMTP transport
  const htmlTemplate = fs.readFileSync(
    'services/templateemails/eventsMail.html',
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
  for (const email of emails) {
    const msg = {
      from: {
        name: 'ConnectCareer Esprit',
        address: 'contact.fithealth23@gmail.com',
      },
      to: email,
      subject: 'New Event',
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
}

module.exports = {
  CreateOrUpdateEvent,
  getAllEvents,
  getAllEventPublished,
  findEventByID
};
