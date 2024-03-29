const Invite = require("../models/invitation");
const Job = require("../models/job");
const Postulation = require("../models/postulation");
const Stats = require("../models/stats");
const User = require("../models/user");
const fs = require("fs");
const nodemailer = require("nodemailer");
async function SendInvitaion(req, res) {
    try {
      const { studentid, jobid } = req.body;
      const user = await User.findById(studentid);
      const job = await Job.findById(jobid);
  
      const existingInvite = await Invite.findOne({ user: studentid, job: jobid });
      if (existingInvite) {
        return res.status(200).json({ message: 'Invitation already exists' });
      }
      let invite = new Invite({ user, job });
      await invite.save();
      job.recommendationCondidateurs.forEach((element, index) => {
        if (element.equals(studentid)) {
          job.recommendationCondidateurs[index].invited = true;
        }
      });
      await job.save();
      return res.status(200).json(invite);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  async function GetInvitation(req, res) {
    try {
      const { id: studentid } = req.params; 
      const Invitations = await Invite.find({ user: studentid }).populate("job");
      return res.status(200).json(Invitations);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
module.exports = {
  SendInvitaion,
  GetInvitation
};
