const express = require('express');
const inviteService = require('../services/inviteService');

const router = express.Router();
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const multer = require('multer');
const { default: axios } = require('axios');



router.post('/sendInvitation', async (req, res) => {
    
    try {
      const invitation = await inviteService.SendInvitaion(req, res);
      return(invitation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.get('/invitations/:id', async (req, res) => {
    
    try {
      const invitations = await inviteService.GetInvitation(req, res);
      return(invitations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


  module.exports = router;
