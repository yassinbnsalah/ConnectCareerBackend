const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
const SkilllService = require('../services/skills');

router.post('/createSkill', async (req, res) => {
  try {
    const skill = await SkilllService.createSkills(req);
    res.json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/allSkills', async (req, res) => {
  try {
    const skills = await SkilllService.getAllSkills(req, res);
    return skills;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/affecteSkill/:userID', async (req, res) => {
  try {
    const response = await SkilllService.AffectSkillToUser(req, res);
    return response;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/getSkills/:userID', async (req, res) => {
  try {
    const response = await SkilllService.SkilsByUserid(req, res);
    return response;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/removemyskill/:userID', async (req, res) => {
  try {
    const response = await SkilllService.RemoveSkillFromUser(req, res);
    return response;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;
