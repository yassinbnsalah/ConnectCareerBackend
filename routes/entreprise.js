const express = require("express");
const entrepriseService = require("../services/entrepriseService");
const router = express.Router();

const admin = require("firebase-admin");
const multer = require("multer");
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
const upload = multer();
router.get("/", async (req, res) => {
  try {
    const entreprises = await entrepriseService.getListeEntreprise();
    res.json(entreprises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/create",
upload.fields([{ name: "CompanyLogo", maxCount: 1 }]), async (req, res) => {
  try {
    const entreprise = await entrepriseService.CreateEntreprise();
    res.json(entreprise);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/all", async (req, res) => {
  try {
    const entreprises = await entrepriseService.getAllEntreprise();
    res.json(entreprises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/:idEntreprise", async (req, res) => {
    const entrepriseId = req.params.idEntreprise;
    try {
      const entreprises = await entrepriseService.getEntrepriseDetails(entrepriseId);
      res.json(entreprises);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;
