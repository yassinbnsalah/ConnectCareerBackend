const User = require('../models/user');
const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const {
  Authentification,
  AuthentificationAdmin,
  ForgetPassword,
  ReceiveToken,
  getUserByEmail,
  UpdatePassword,
  Ajouter2FA,
} = require('../services/authentification');

router.post('/login', async (req, res) => {
  await Authentification(req, res);
});
router.get('/getUserByEmail/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await getUserByEmail(email);
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/loginadmin', async (req, res) => {
  await AuthentificationAdmin(req, res);
});

router.post('/UpdatePassword/:email', async (req, res) => {
  await UpdatePassword(req, res);
});
router.post('/Ajouter2FA/:email', async (req, res) => {
  await Ajouter2FA(req, res);
});

router.post('/forgetpassword', async (req, res) => {
  await ForgetPassword(req, res);
});

router.post('/resetpassword/:token', async (req, res) => {
  await ReceiveToken(req, res);
});
module.exports = router;
