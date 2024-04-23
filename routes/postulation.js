const express = require('express');
const postulationService = require('../services/postulationService');

const router = express.Router();
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const multer = require('multer');
const { default: axios } = require('axios');

router.use(bodyParser.urlencoded({ extended: true }));

const upload = multer();
router.post(
  '/add',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'MotivationLettre', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const postulation = await postulationService.CreateNewCandidate(
        req,
        res,
        admin,
      );
      try {
        console.log(postulation);
        const response = await axios.get('http://127.0.0.1:8000/getapplication/' + postulation._id);
        const data = response.data;
        console.log("Matching Calculated Automatic");
        console.log(data);
      } catch (error) {
        console.log("Matching Can't be Calculated");
      }
      res.json({ postulation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);

router.get('/getapplication/:userID', async (req, res) => {
  const userId = req.params.userID;
  try {
    const postulation = await postulationService.getApplications(userId);
    res.json(postulation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/verifyapplication/:userID/:jobID', async (req, res) => {
  const userId = req.params.userID;
  const jobId = req.params.jobID;
  try {
    const postulation = await postulationService.verifyIfApplicatedOnOpportunite(userId, jobId);
    res.json(postulation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/applicationlistebyJob/:jobID', async (req, res) => {
  const { jobID } = req.params;
  try {
    const applications = await postulationService.getApplicationbyJobID(jobID);
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/application/:applicationID', async (req, res) => {
  const { applicationID } = req.params;
  try {
    const application = await postulationService.getApplicationDetails(applicationID);
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.put('/application/updatestate/:applicationID', async (req, res) => {
  const { applicationID } = req.params;
  const { state } = req.body;
  console.log(state);
  try {
    const application = await postulationService.UpdateApplicationState(applicationID, state);
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
