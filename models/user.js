// models/User.js
const mongoose = require("mongoose");
const Entreprise = require("./entreprise");
const { Schema } = mongoose;
const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  phoneNumber: String,
  gender: String,
  uniqueid: String,
  institution: String,
  password: String,
  Hpassword: String,
  jobTitle: String,
  jobType: String,
  isVerify: Boolean,
  profileImage: String,
  role: String,
  diploma: String,
  state: String,
  resume: String,
  request: Boolean,
  carteEtudiant: String,
  aboutme: String,
  lookingfor: String,
  lastlogin: String,
  nbapplies: { type: Number, default: 0 },  
  nbopportunite: { type: Number, default: 0 },  
  entreprise: {
    type: Schema.Types.ObjectId,
    ref: "Entreprise",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
