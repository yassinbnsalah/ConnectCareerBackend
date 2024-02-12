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
      const postulation = await postulationService.CreateNewCandidate(req, res,admin);
      res.json({ postulation: postulation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
