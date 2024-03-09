
const mongoose = require('mongoose');

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
    OwnedbyAdmin: {
        type: Boolean,
        default: false
    }
});

const Entreprise = mongoose.model('Entreprise', entrepriseSchema);

module.exports = Entreprise;
