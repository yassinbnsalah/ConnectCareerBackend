const express = require("express");
const router = express.Router();
const interviewService = require("../services/interview");

router.get("/getInterviewsRecruiter/:userID", async (req, res) => {
  try {
    userID = req.params.userID;
    const result = await interviewService.getInterviewByRecruiter(userID);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/createInterview", async (req, res) => {
  try {
    const result = await interviewService.createInterview(req, res);
    res.status(200).json({ message: "Interview Created Succefully !!!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
