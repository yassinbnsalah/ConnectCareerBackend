const express = require('express');

const router = express.Router();
const admin = require('firebase-admin');
const multer = require('multer');

const {
  getListOfEducation,
  CreateEducation,
  getListOfEducationById,
  updateEducation,
  deleteEducationById,
} = require('../services/education');

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
router.post(
  '/createEducation',
  upload.fields([{ name: 'attestation', maxCount: 1 }]),
  async (req, res) => {
    await CreateEducation(req, res, admin);
  },
);

router.get('/educations/:userId', async (req, res) => {
  await getListOfEducation(req, res);
});

router.get('/educationsDetail/:Id', async (req, res) => {
  await getListOfEducationById(req, res);
});

router.delete('/educations/:educationId', async (req, res) => {
  await deleteEducationById(req, res);
});
router.put(
  '/educations/:educationId',
  upload.fields([{ name: 'attestation', maxCount: 1 }]),
  async (req, res) => {
    try {
      await updateEducation(req, res, admin); // Pass admin object here
      console.log('Received payload size:', req.headers['content-length']);
    } catch (error) {
      console.error(error);
      console.log('Received payload size:', req.headers['content-length']);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);
module.exports = router;
