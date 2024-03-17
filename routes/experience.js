const express = require('express');

const router = express.Router();
const admin = require('firebase-admin');
const multer = require('multer');

const upload = multer();
const {
  confirmedExperience,
  CreateExperience,
  deleteExperienceById,
  updateExperience,
  getListOfExperienceById,
  getListOfExperience,
} = require('../services/experience');

router.put('/confirmedExperience/:experienceId', async (req, res) => {
  try {
    await confirmedExperience(req, res, admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.post(
  '/createExperience',
  upload.fields([{ name: 'attestation', maxCount: 1 }]),
  async (req, res) => {
    try {
      await CreateExperience(req, res, admin);
      console.log('Received payload size:', req.headers['content-length']);
    } catch (error) {
      console.error(error);
      console.log('Received payload size:', req.headers['content-length']);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);

router.delete('/experiences/:experienceId', async (req, res) => {
  await deleteExperienceById(req, res);
});

router.put(
  '/experiences/:experienceId',
  upload.fields([{ name: 'attestation', maxCount: 1 }]),
  async (req, res) => {
    try {
      await updateExperience(req, res, admin);
      console.log('Received payload size:', req.headers['content-length']);
    } catch (error) {
      console.error(error);
      console.log('Received payload size:', req.headers['content-length']);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);

router.get('/experiencesDetail/:Id', async (req, res) => {
  await getListOfExperienceById(req, res);
});

router.get('/experiences/:userId', async (req, res) => {
  await getListOfExperience(req, res);
});
module.exports = router;
