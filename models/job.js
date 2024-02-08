const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({

      firstName: String,
      lastName: String,
      email:String,
      phoneNumber:String,
 
 
      jobTitle: String,
      department:String,
      location: String,
      jobType: String, 
      salary: Number ,
      description: String,
    
      companyName:String,
      companyWebsite:  String,
      industry: String,
      logo:  String ,
      companyDescription: String,
 
    termsAndConditions: Boolean,

    });
  
  const Job = mongoose.model('Job', jobSchema);
  
  module.exports = Job;
  