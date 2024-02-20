const express = require("express");
const recruiterService = require("../services/recruiterService");
const router = express.Router();

const admin = require("firebase-admin");
const multer = require("multer");
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
const upload = multer();
router.get("/", async (req, res) => {
  try {
    const recruiters = await recruiterService.getListeRecruiter();
    res.json({ recruiters: recruiters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/verify/:email" ,   async (req, res) => {
  try {
    const email = req.params.email
    const emailExiste = await recruiterService.verifyrecruiter(email);
    return res.status(200).json({ emailExiste: emailExiste});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})
router.post(
    "/add",
    upload.fields([
      { name: "profileImage", maxCount: 1 },
      { name: "CompanyLogo", maxCount: 1 },
    ]),
    async (req, res) => {
      try {
        const recruiters = await recruiterService.createRecruiter(req, res, admin);
        return res.status(200).json({ message: "Utilisateur inscrit avec succès" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );
  

module.exports = router;
