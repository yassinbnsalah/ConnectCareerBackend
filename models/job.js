const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
    jobPoster: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
    jobDetails: {
      jobTitle: { type: String, required: true },
      department: { type: String, required: true },
      location: { type: String, enum: ['Onsite', 'Remote', 'Onsite or Remote'], required: true },
      jobType: { type: String, required: true },
      salary: { type: Number },
      description: { type: String, required: true },
    },
    companyDetails: {
      companyName: { type: String, required: true },
      companyWebsite: { type: String, required: true },
      industry: { type: String, required: true },
      logo: { type: String }, // Consider using Buffer if storing binary data
      description: { type: String },
    },
    termsAndConditions: { type: Boolean, required: true },
  }, { timestamps: true });
  
  const Job = mongoose.model('Job', jobSchema);
  
  module.exports = Job;
  