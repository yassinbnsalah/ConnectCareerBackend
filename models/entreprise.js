
const mongoose = require('mongoose');

const entrepriseSchema = new mongoose.Schema({
    CompanyName: String,
    CompanyAdress: String,
    CompanyCity: String,
    matriculeFiscale : String , 
    CompanyLogo : String , 
    description : String , 
    CompanyType : String ,
    CompanyWebsite: String ,
});

const Entreprise = mongoose.model('Entreprise', entrepriseSchema);

module.exports = Entreprise;
