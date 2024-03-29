const mongoose = require('mongoose');

const { Schema } = mongoose;
const inviteSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  job: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
  },
  creationDate: {
    type: Date,
    default: Date.now,
    
  },
});

const Invite = mongoose.model('Invite', inviteSchema);

module.exports = Invite;
