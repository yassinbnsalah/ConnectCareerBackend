const express = require("express");
const entrepriseService = require("../services/entrepriseService");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const entreprises = await entrepriseService.getListeEntreprise();
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
