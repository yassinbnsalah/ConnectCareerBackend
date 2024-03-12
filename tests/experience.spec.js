const assert = require('assert');
const Experience = require('../models/experience');
const { getListOfExperience } = require('../services/testedservices/services');
const { getListOfExperienceById } = require('../services/experience');
const { deleteExperienceById  } = require('../services/experience');
describe('Experience Service - getListOfExperience', function () {
  let mockData;

  beforeEach(() => {
    // Override Experience.find with a mock that returns a resolved promise
    Experience.find = async () => mockData;
  });

  it('should return a list of experience for a valid user ID', async () => {
    const userId = "65d5b8c00c02747b794efe2e";

    mockData = [{
      _id: "65db458b612bf32b4b0b7d77",
      student: userId,
      entrepriseName: "ABC FIS",
      typeExperience: "End Of Studies Internship",
      Lieu: "Ghazella",
      jobDescription: "Ghazella",
      startedOn: new Date("2024-02-01T00:00:00.000Z"),
      endAt: null,
      entrepriseSecture: "Technology and IT",
      etat: false,
      Attestation: null
    }];

    const result = await getListOfExperience(userId);


  });

  it('should handle internal server error properly', async () => {
    // Force Experience.find to throw an error
    Experience.find = async () => {
      throw new Error('Test error');
    };

    const userId = "65d5b8c00c02747b794efe2e";

    const result = await getListOfExperience(userId);

    // Assert the result is an object with an error property
    assert.deepStrictEqual(result, { error: "Internal Server Error" });
  });
});
describe('Experience Service - getListOfExperienceById', function () {
    it('should return experience data for a valid ID', async () => {
      // Mock experience data
      const mockExperience = {
        _id: "65d9f11ffb6e0b90d694f96a",
        student: "65d9af2435e02a5bb7043c66",
        entrepriseName: "ABC Corporation",
        typeExperience: "Freelance",
        Lieu: "City XYZ",
        jobDescription: "sssssssssssss",
        startedOn: new Date("2024-02-12T00:00:00.000Z"),
        endAt: null,
        entrepriseSecture: "Telecommunications",
        etat: false,
        Attestation: null
      };
  
      // Mock Experience.findById to return the mock experience
      Experience.findById = async () => mockExperience;
  
      const req = { params: { Id: "65d9f11ffb6e0b90d694f96a" } };
      let statusCode;
      const res = {
        status: function (code) {
          statusCode = code;
          return this;
        },
        json: function (data) {
          this.body = data;
        }
      };
  
      await getListOfExperienceById(req, res);
      assert.deepStrictEqual(res.body, mockExperience);
    });
  });
  describe('Experience Service - deleteExperienceById', function () {
    it('should delete an experience for a valid experience ID', async () => {
      // Mock deleted experience
      const mockDeletedExperience = {
        _id: "65d9f11ffb6e0b90d694f96a",
        student: "65d9af2435e02a5bb7043c66",
        entrepriseName: "ABC Corporation",
        typeExperience: "Freelance",
        Lieu: "City XYZ",
        jobDescription: "sssssssssssss",
        startedOn: new Date("2024-02-12T00:00:00.000Z"),
        endAt: null,
        entrepriseSecture: "Telecommunications",
        etat: false,
        Attestation: null
      };
  
      // Mock Experience.findByIdAndDelete to return the deleted experience
      Experience.findByIdAndDelete = async () => mockDeletedExperience;
  
      const req = { params: { experienceId: "65d9f11ffb6e0b90d694f96a" } };
      let statusCode;
      let responseBody;
      const res = {
        status: function (code) {
          statusCode = code;
          return this;
        },
        json: function (data) {
          responseBody = data;
        }
      };
  
      await deleteExperienceById(req, res);
  
      // Assert the response status code is 200

  
      // Assert the response body contains the deleted experience
      assert.deepStrictEqual(responseBody, { message: "Experience deleted successfully", deletedExperience: mockDeletedExperience });
    });
  
    it('should handle experience not found properly', async () => {
      // Mock Experience.findByIdAndDelete to return null
      Experience.findByIdAndDelete = async () => null;
  
      const req = { params: { experienceId: "nonexistentId" } };
      let statusCode;
      let responseBody;
      const res = {
        status: function (code) {
          statusCode = code;
          return this;
        },
        json: function (data) {
          responseBody = data;
        }
      };
  
      await deleteExperienceById(req, res);
  
      // Assert the response status code is 404
      assert.strictEqual(statusCode, 404);
  
      // Assert the response body contains the expected error message
      assert.deepStrictEqual(responseBody, { error: "Experience not found" });
    });
  
    it('should handle internal server error properly', async () => {
      // Mock Experience.findByIdAndDelete to throw an error
      Experience.findByIdAndDelete = async () => {
        throw new Error('Test error');
      };
  
      const req = { params: { experienceId: "65d9f11ffb6e0b90d694f96a" } };
      let statusCode;
      let responseBody;
      const res = {
        status: function (code) {
          statusCode = code;
          return this;
        },
        json: function (data) {
          responseBody = data;
        }
      };
  
      await deleteExperienceById(req, res);
  
      // Assert the response status code is 500
      assert.strictEqual(statusCode, 500);
  
      // Assert the response body contains the expected error message
      assert.deepStrictEqual(responseBody, { error: "Internal Server Error" });
    });
  });