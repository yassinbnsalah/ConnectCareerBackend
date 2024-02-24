const Interview = require("../models/interview.js");

async function getInterviewByRecruiter(userID) {
  try {
    const interviews = await Interview.find({ recruiter: userID }).populate("inviter");
    return interviews;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "ServerError" });
  }
}

async function createInterview(req, res) {
  try {
    const {
      recruiter,
      inviter,
      roomID,
      dateInterview,
      heure,
      minutes,
      description,
    } = req.body;
    console.log(req.body);
    const newInterview = new Interview({
      recruiter,
      inviter,
      roomID,
      dateInterview,
      heure,
      minutes,
      description,
    })
    await newInterview.save();
  } catch (error) {
    console.error(error);
  }
}
module.exports = {
  getInterviewByRecruiter,
  createInterview
};
