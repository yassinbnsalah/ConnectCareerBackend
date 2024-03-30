const express = require('express');
const entrepriseService = require('../services/entrepriseService');

const router = express.Router();

const admin = require('firebase-admin');
const multer = require('multer');

const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
const upload = multer();
router.get('/', async (req, res) => {
  try {
    const entreprises = await entrepriseService.getListeEntreprise();
    res.json(entreprises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post(
  '/create',
  upload.fields([{ name: 'CompanyLogo', maxCount: 1 }]),
  async (req, res) => {
    try {
      const entreprise = await entrepriseService.CreateEntreprise(req, res, admin);
      res.json(entreprise);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);
router.put(
  '/update/:CompanyID',
  upload.fields([{ name: 'CompanyLogo', maxCount: 1 }]),
  async (req, res) => {
    try {
      console.log('updatesd');
      const entreprise = await entrepriseService.UpdateEntreprise(req, res, admin);
      res.json(entreprise);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);
router.get('/all', async (req, res) => {
  try {
    const entreprises = await entrepriseService.getAllEntreprise();
    res.json(entreprises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/esprittech', async (req, res) => {
  try {
    const entreprise = await entrepriseService.getEntrepriseTech();
    res.json(entreprise);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/:idEntreprise', async (req, res) => {
  const entrepriseId = req.params.idEntreprise;
  try {
    const data = await entrepriseService.getEntrepriseDetails(
      entrepriseId,
    );
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
