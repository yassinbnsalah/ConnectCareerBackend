const Event = require("../models/events");

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
      // Create new event
      const newEvent = new Event({
        title,
        description,
        state,
        category,
        image: imageEvents,
        publish_date,
        eventDate
      });
      await newEvent.save();
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

const findEventByID = async (req ,res , eventID) => {
  try {
    const event = await Event.findById(eventID);

    res.status(200).json({ event });
  } catch (error) {
    console.error('Error fetching all events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  CreateOrUpdateEvent,
  getAllEvents,
  findEventByID
};
