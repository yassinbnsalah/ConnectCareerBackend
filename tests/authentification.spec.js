const assert = require('assert');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { 
  getUserByEmail,
  Authentification,
  AuthentificationAdmin,
  ForgetPassword,
  ReceiveToken,
  UpdatePassword,
  Ajouter2FA
} = require('../services/authentification');
const User = require('../models/user');

describe('Auth Service', () => {
  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      // Mock User.findOne
      User.findOne = async () => ({ /* mock user data */ });
      
      const email = 'test@example.com';
      const user = await getUserByEmail(email);
      
      assert.ok(user); // assert that user is returned
    });
  });

  // Add tests for other functions like Authentification, AuthentificationAdmin, ForgetPassword, etc.
});
