// models/User.js
const mongoose = require('mongoose');
const Entreprise = require('./entreprise');
const { Schema } = mongoose;
const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    phoneNumber : String , 
    gender : String , 
    password : String , 
    jobTitle : String, 
    jobType : String , 
    profileImage:String,
    role : String ,
    entreprise: {
        type: Schema.Types.ObjectId,
        ref: 'Entreprise'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
