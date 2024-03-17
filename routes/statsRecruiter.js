const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const StatService = require('../services/statsRecruiter');

router.use(bodyParser.json()); // Use bodyParser.json() instead of bodyParser.urlencoded()

router.get('/:userId/:jobId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { jobId } = req.params;
    const stat = await StatService.generateStats(userId, jobId);
    res.json(stat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
