const mongoose = require("mongoose");
const { Schema } = mongoose;
const educationSchema = new mongoose.Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  uni_name: String,
  diplome : String,
  startedOn: Date,
  endAt: Date,
  Attestation: String,
});

const Education = mongoose.model("Education", educationSchema);

module.exports = Education;
