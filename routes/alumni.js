const express = require('express');
const alumniService = require('../services/alumniService');
const router = express.Router();
const multer = require('multer');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
const upload = multer();

router.get('/', async (req, res) => {
  try {
    const alumnis = await alumniService.getListeAlumni();
    res.json(alumnis);
  } catch (error) {
    
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:alumniId', async (req, res) => {
  try {
    const { alumniId } = req.params;
    const alumniDetails = await alumniService.getAlumniDetails(alumniId);
    res.json(alumniDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
