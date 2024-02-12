const express = require("express");
const jobService = require("../services/jobService");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
const multer = require("multer");

// Set up multer to handle multipart/form-data
const upload = multer();
router.post("/add",upload.none(), async (req, res) => {
  try {

    const jobs = await jobService.AddJob(req, res);
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/all", async (req, res) => {
  try {
    const result = await jobService.getAllJob();
    if (result.status === 404) {
      return res.status(404).json({ message: result.message });
    } else if (result.status === 500) {
      return res.status(500).json({ error: result.message });
    }
    res.status(200).json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const jobs = await jobService.getJobByRecruiter(userId);
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/details/:jobID", async (req, res) => {
  const jobID = req.params.jobID;
  try {
    const jobs = await jobService.getJobDetails(jobID);
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = router;
