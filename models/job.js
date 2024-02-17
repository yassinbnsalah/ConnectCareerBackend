const mongoose = require("mongoose");
const { Schema } = mongoose;
const jobSchema = new mongoose.Schema({
  recruiter: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  jobTitle: String,
  location:String,
  typeofworkplace: String,
  jobType: String,
  salary: String,
  description: String,



  termsAndConditions: Boolean,
  isActive: Boolean,
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
