const mongoose = require('mongoose');

const { Schema } = mongoose;
const PostulationSchema = new mongoose.Schema({
  CreatedAt: {
    type: Date,
    default: Date.now, // Set default value to current date/time when a new document is created
  },
  State: String,
  Resume: String,
  MotivationLetter: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  job: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
  },
});

const Postulation = mongoose.model('Postulation', PostulationSchema);

module.exports = Postulation;
