const mongoose = require('mongoose');

const eventsSchema = new mongoose.Schema({
  title: String,
  description: String,
  state: String,
  category: String,
  image : String,
  creationDate: {
    type: Date,
    default: Date.now,
  },
  publish_date : Date,
  eventDate : Date,
 
});

const Event = mongoose.model('Event', eventsSchema);

module.exports = Event;
