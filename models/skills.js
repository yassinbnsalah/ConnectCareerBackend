const mongoose = require('mongoose');

const { Schema } = mongoose;
const skillshcema = new mongoose.Schema({
  skillname: String,
});

const Skills = mongoose.model('Skills', skillshcema);

module.exports = Skills;
