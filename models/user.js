// models/book.js
const mongoose = require('mongoose');

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
    role : String 
});

const User = mongoose.model('User', userSchema);

module.exports = User;
