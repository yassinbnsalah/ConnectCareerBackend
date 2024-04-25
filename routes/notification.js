const express = require('express');
const notificationService = require('../services/notificationService');
const router = express.Router();
router.get('/', async (req, res) => {
    try {
      const notifications = await notificationService.getListOfNotification();
      res.json(notifications);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.get('/:userID', async (req, res) => {
    const userId = req.params.userID;
    try {
      const notifications = await notificationService.getListOfNotificationsbyid(userId);
      res.json(notifications);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });  
  router.get('/allnotifications/:userID', async (req, res) => {
    const userId = req.params.userID;
    try {
      const notifications = await notificationService.getAllListOfNotificationsbyid(userId);
      res.json(notifications);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
module.exports = router;