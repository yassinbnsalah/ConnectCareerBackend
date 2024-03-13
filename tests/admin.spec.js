const assert = require('assert');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const CreateAdmin = require('../services/createadmin');

describe('CreateAdmin', () => {
  // Test cas nominal
  it('should create admin successfully', async () => {
    // Préparation des données de test
    const req = {
      body: {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      },
    };

    const res = {
      status: (statusCode) => {
        assert.strictEqual(statusCode, 201); // Vérifie que le statut de réponse est correct
        return {
          json: ({ message }) => {
            assert.strictEqual(message, 'ADMIN inscrit avec succès'); // Vérifie que le message de réponse est correct
          },
        };
      },
    };

    // Stub de la méthode bcrypt.hash
    const bcryptHashStub = async (password, salt) => 'hashedPassword';
    const bcryptHashStubOriginal = bcrypt.hash;
    bcrypt.hash = bcryptHashStub;

    // Mock de la méthode save de User
    const saveMock = async () => {};
    const userSaveOriginal = User.prototype.save;
    User.prototype.save = saveMock;

    // Appel de la fonction à tester
    await CreateAdmin(req, res);

    // Restauration des méthodes originales
    bcrypt.hash = bcryptHashStubOriginal;
    User.prototype.save = userSaveOriginal;
  });

  // Test en cas d'erreur interne
  it('should return internal server error', async () => {
    // Préparation des données de test
    const req = {
      body: {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      },
    };

    const res = {
      status: (statusCode) => {
        assert.strictEqual(statusCode, 500); // Vérifie que le statut de réponse est correct
        return {
          json: ({ message }) => {
            assert.strictEqual(message, 'Internal server error'); // Vérifie que le message de réponse est correct
          },
        };
      },
    };

    // Stub de la méthode bcrypt.hash pour simuler une erreur
    const bcryptHashStub = async () => {
      throw new Error('bcrypt error');
    };
    const bcryptHashStubOriginal = bcrypt.hash;
    bcrypt.hash = bcryptHashStub;

    // Appel de la fonction à tester
    await CreateAdmin(req, res);

    // Restauration de la méthode originale
    bcrypt.hash = bcryptHashStubOriginal;
  });
});
