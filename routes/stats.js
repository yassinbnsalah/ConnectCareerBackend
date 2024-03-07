
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const StatService = require("../services/stats")
router.use(bodyParser.urlencoded({ extended: true }));
router.get("/" , async (req,res) =>{
    try{
        const stat = await StatService.generateStats()
        res.json(stat)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
})

module.exports = router;
