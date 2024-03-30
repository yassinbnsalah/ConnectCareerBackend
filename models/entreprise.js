const mongoose = require('mongoose');

const { Schema } = mongoose;
const entrepriseSchema = new mongoose.Schema({
  CompanyName: String,
  CompanyAdress: String,
  CompanyCity: String, 
  matriculeFiscale: String,
  CompanyLogo: String,
  description: String,
  CompanyType: String,
  CompanyEmail: String,
  CompanyWebsite: String,
  nbOpportunitees   :{
    type: Number,
    default: 0,
  },
  Rate : {
    type: Number,
    default: 0,
  },
  OwnedbyAdmin: {
    type: Boolean,
    default: false,
  },
  stats: {
    type: Schema.Types.ObjectId,
    ref: 'Stats',
  }
});

const Entreprise = mongoose.model('Entreprise', entrepriseSchema);

module.exports = Entreprise;
