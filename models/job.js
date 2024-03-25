const mongoose = require('mongoose');

const { Schema } = mongoose;
const jobSchema = new mongoose.Schema({
  recruiter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  state: String ,
  jobTitle: String,
  location: String,
  typeofworkplace: String,
  jobType: String,
  salary: String,
  description: String,
  duration: String,
  yearOfExperience: String,
  cible: String,
  closeDate: Date,
  jobFile: String,
  
  nbapplies: { type: Number, default: 0 },

  Relatedentreprise: {
    type: Schema.Types.ObjectId,
    ref: 'Entreprise',
  },
  termsAndConditions: Boolean,
  isActive: Boolean,
  skills: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Skills',
    },
  ],
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
