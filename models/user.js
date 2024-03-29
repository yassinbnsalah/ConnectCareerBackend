// models/User.js
const mongoose = require('mongoose');
const Entreprise = require('./entreprise');

const { Schema } = mongoose;
const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  phoneNumber: String,
  gender: String,
  uniqueid: String,
  institution: String,
  adress: String,
  password: String,
  Hpassword: String,
  jobTitle: String,
  jobType: String,
  isVerify: Boolean,
  section : String, 
  profileImage: String,
  role: String,
  diploma: String,
  state: String,
  resume: String,
  request: Boolean,
  carteEtudiant: String,
  aboutme: String,
  lookingfor: String,
  secret: String,
  TwoFactorAuthentication: Boolean,
  qrCode: String,
  groupeRecherche: String,
  unites: String,
  lastlogin: { type: String, default: null },
  skills: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Skills',
    },
  ],
  nbapplies: { type: Number, default: 0 },
  nbopportunite: { type: Number, default: 0 },
  entreprise: {
    type: Schema.Types.ObjectId,
    ref: 'Entreprise',
  },
  hasEducation: { type: Boolean, default: false },
  hasExperience: { type: Boolean, default: false },
  profileProgress: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
