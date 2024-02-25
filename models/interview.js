const mongoose = require("mongoose");
const { Schema } = mongoose;
const interviewSchema = new mongoose.Schema({
  recruiter: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  applicationref :  {
    type: Schema.Types.ObjectId,
    ref: "Postulation",
  },
  inviter: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  dateInterview :{
    type: Date,
    default: Date.now, 
  }, 
  roomID : String, 
  heure : Number , 
  minutes : Number ,
  description : String,

});

const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;
