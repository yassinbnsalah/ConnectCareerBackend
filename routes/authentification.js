const User = require("../models/user");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  Authentification,
  AuthentificationAdmin,
  ForgetPassword,
  ReceiveToken,
} = require("../services/authentification");
router.post("/login", async (req, res) => {
  await Authentification(req, res);
});

router.post("/loginadmin", async (req, res) => {
  await AuthentificationAdmin(req, res);
});

router.post("/forgetpassword", async (req, res) => {
  await ForgetPassword(req, res);
});

router.post("/resetpassword/:token", async (req, res) => {
  await ReceiveToken(req, res);
});
module.exports = router;
