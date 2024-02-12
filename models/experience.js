const mongoose = require("mongoose");
const { Schema } = mongoose;
const experienceSchema = new mongoose.Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  entrepriseName: String,
  typeExpérience: String,
  Lieu:String,
  jobDescription: String,
  startedOn: Date,
  endAt: Date,
  entrepriseSecture: String,


});

const Experience = mongoose.model("Experience", experienceSchema);

module.exports = Experience;
