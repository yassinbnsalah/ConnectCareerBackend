
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
const SkilllService = require("../services/skills")
router.post("/createSkill" , async (req,res) =>{
    try{
        const skill = await SkilllService.createSkills(req)
        res.json(skill)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
})


router.get("/allSkills" , async (req,res) =>{
    try{
       return await SkilllService.getAllSkills(req,res)
     
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
})


router.post("/affecteSkill/:userID" , async (req,res)=>{
    try{
       return await SkilllService.AffectSkillToUser(req,res)
     
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
})

router.get("/getSkills/:userID" , async (req,res) =>{
    try{
        return await SkilllService.SkilsByUserid(req,res)
  
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
})


router.put("/removemyskill/:userID", async (req,res) =>{
    try{
        return await SkilllService.RemoveSkillFromUser(req,res)
   
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
})
module.exports = router;
