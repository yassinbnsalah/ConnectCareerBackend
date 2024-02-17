const express = require("express");
const postulationService = require("../services/postulationService");
const router = express.Router();
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const multer = require("multer");
router.use(bodyParser.urlencoded({ extended: true }));

const upload = multer();
router.post(
  "/add",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "MotivationLettre", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const postulation = await postulationService.CreateNewCandidate(
        req,
        res,
        admin
      );
      res.json({ postulation: postulation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/getapplication/:userID", async (req, res) => {
  const userId = req.params.userID;
  try {
    const postulation = await postulationService.getApplications(userId);
    res.json(postulation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/verifyapplication/:userID/:jobID", async (req, res) => {
  const userId = req.params.userID;
  const jobId = req.params.jobID;
  try {
    const postulation =
      await postulationService.verifyIfApplicatedOnOpportunite(userId, jobId);
    res.json(postulation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/applicationlistebyJob/:jobID", async (req, res) => {
  const jobID = req.params.jobID;
  try {
    const applications = await postulationService.getApplicationbyJobID(jobID);
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
