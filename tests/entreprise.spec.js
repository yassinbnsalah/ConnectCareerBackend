// fichier de tests : getListeEntreprise.test.js
const assert = require('assert');
const { getEntrepriseDetails } = require("../services/testedservices/services");
const { getListeEntreprise } = require('../services/entrepriseService.js');
const User = require('../models/user');

const Entreprise = require('../models/entreprise');
// Mocking User.find manuellement (hypothétique)
const originalUserFind = User.find;
function mockUserFind() {
  return {
    populate: function() {
      return Promise.resolve([
        { nom: 'Recruiter1', entreprise: 'Entreprise1' },
        { nom: 'Recruiter2', entreprise: 'Entreprise2' }
      ]);
    }
  };
}

describe('getListeEntreprise', function() {
  before(() => {
    // Remplacer User.find par une version mockée avant les tests
    User.find = mockUserFind;
  });

  after(() => {
    // Restaurer User.find à son implémentation originale après les tests
    User.find = originalUserFind;
  });

  it('devrait retourner une liste des recruteurs avec leurs entreprises', async function() {
    const expected = [
      { nom: 'Recruiter1', entreprise: 'Entreprise1' },
      { nom: 'Recruiter2', entreprise: 'Entreprise2' }
    ];
    const result = await getListeEntreprise();
    assert.deepStrictEqual(result, expected, 'Les résultats obtenus ne correspondent pas aux valeurs attendues');
  });
});
// Sauvegarde de la référence originale de la méthode pour restauration après les tests
const originalFindById = Entreprise.findById;

describe('getEntrepriseDetails', function() {
  // Remplacement de la méthode avant chaque test
  beforeEach(() => {
    Entreprise.findById = async (id) => {
      if (id === '65d4d54b03cabd32b68d0e29') {
        // Simuler une entreprise existante
        return { _id: '65d4d54b03cabd32b68d0e29', nom: 'Entreprise Test', description: 'Description Test' };
      } else {
        // Simuler l'absence d'entreprise
        return null;
      }
    };
  });

  // Restauration de la méthode originale après chaque test
  afterEach(() => {
    Entreprise.findById = originalFindById;
  });

  it('devrait retourner les détails d\'une entreprise existante', async function() {
    const expected = { _id: '65d4d54b03cabd32b68d0e29', nom: 'Entreprise Test', description: 'Description Test' };
    const result = await getEntrepriseDetails('65d4d54b03cabd32b68d0e29');
    assert.deepStrictEqual(result, expected, 'Les détails de l\'entreprise retournés ne correspondent pas aux valeurs attendues');
  });

  it('devrait retourner une erreur si l\'entreprise n\'existe pas', async function() {
    try {
      await getEntrepriseDetails('entrepriseInexistanteId');
      assert.fail('Une erreur était attendue');
    } catch (error) {
      assert.strictEqual(error.message, 'Server Error', 'Le message d\'erreur attendu n\'est pas retourné');
    }
  });
  
});