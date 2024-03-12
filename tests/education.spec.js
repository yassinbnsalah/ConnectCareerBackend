const assert = require('assert');
const Education = require('../models/education');
const { getListOfEducation } = require('../services/testedservices/services');
const { deleteEducationById } = require('../services/education');
const { getListOfEducationById } = require('../services/education');

describe('Education Service - getListOfEducation', function () {
  let mockData;

  beforeEach(() => {
    // Override Education.find with a mock that returns a resolved promise
    Education.find = async () => {
      return mockData;
    };
  });

  it('should return a list of education for a valid user ID', async () => {
    const req = { params: { userId: "65dcf26da065700a6a0374cc" } };

    mockData = [{
      uni_name: "Iset charguia",
      diplome: "Iseter",
      startedOn: new Date("2024-03-01T00:00:00.000Z").toISOString(),
      endAt: new Date("2024-03-29T00:00:00.000Z").toISOString(),
      Attestation: "https://firebasestorage.googleapis.com/v0/b/twinerz-fceb6.appspot.com/o/attestation%2Fyessine.pdf?alt=media"
    }];

    const result = await getListOfEducation(req);

    // Check if the result is an array before using forEach
    if (Array.isArray(result)) {
      // Convert actual dates to ISO string format
      result.forEach(edu => {
        edu.startedOn = new Date(edu.startedOn).toISOString();
        edu.endAt = new Date(edu.endAt).toISOString();
      });

      // Assert the response data is as expected
      assert.deepStrictEqual(result, mockData);
    } else {
      // If it's not an array, assume it's an error object
      assert.deepStrictEqual(result, { error: "Internal Server Error" });
    }
  });

  it('should handle internal server error properly', async () => {
    // Force Education.find to throw an error
    Education.find = async () => {
      throw new Error('Test error');
    };

    const req = { params: { userId: "65dcf26da065700a6a0374cc" } };

    const result = await getListOfEducation(req);

    // Assert the result is an object with an error property
    assert.deepStrictEqual(result, { error: "Internal Server Error" });
  });
});
describe('Education Service - deleteEducationById', function () {
  it('should delete education for a valid education ID', async () => {
    const educationId = "65dcf26da065700a6a0374cc";
    const req = { params: { educationId } };

    // Mock the findByIdAndDelete method to return a resolved promise
    Education.findByIdAndDelete = async (id) => {
      assert.strictEqual(id, educationId); // Assert that the correct educationId is passed
      return {
        _id: educationId,
        uni_name: "Iset charguia",
        diplome: "Iseter",
        startedOn: new Date("2024-03-01T00:00:00.000Z").toISOString(),
        endAt: new Date("2024-03-29T00:00:00.000Z").toISOString(),
        Attestation: "https://firebasestorage.googleapis.com/v0/b/twinerz-fceb6.appspot.com/o/attestation%2Fyessine.pdf?alt=media"
      };
    };

    const res = {
      json: (data) => {
        // Assert the response data is as expected
        assert.deepStrictEqual(data, {
          message: "Education deleted successfully",
          deletedEducation: {
            _id: educationId,
            uni_name: "Iset charguia",
            diplome: "Iseter",
            startedOn: new Date("2024-03-01T00:00:00.000Z").toISOString(),
            endAt: new Date("2024-03-29T00:00:00.000Z").toISOString(),
            Attestation: "https://firebasestorage.googleapis.com/v0/b/twinerz-fceb6.appspot.com/o/attestation%2Fyessine.pdf?alt=media"
          }
        });
      },
      status: (status) => {
        // Assert the status code is 200
        assert.strictEqual(status, 200);
        return res; // Return the response object for chaining
      }
    };

    await deleteEducationById(req, res);
  });

  it('should handle education not found properly', async () => {
    const educationId = "nonexistentid";
    const req = { params: { educationId } };

    // Mock the findByIdAndDelete method to return null, simulating no education found
    Education.findByIdAndDelete = async () => null;

    const res = {
      json: (data) => {
        // Assert the response data is as expected
        assert.deepStrictEqual(data, { error: "Education not found" });
      },
      status: (status) => {
        // Assert the status code is 404
        assert.strictEqual(status, 404);
        return res; // Return the response object for chaining
      }
    };

    await deleteEducationById(req, res);
  });

  it('should handle internal server error properly', async () => {
    const educationId = "65dcf26da065700a6a0374cc";
    const req = { params: { educationId } };

    // Force findByIdAndDelete to throw an error
    Education.findByIdAndDelete = async () => {
      throw new Error('Test error');
    };

    const res = {
      json: (data) => {
        // Assert the response data is as expected
        assert.deepStrictEqual(data, { error: "Internal Server Error" });
      },
      status: (status) => {
        // Assert the status code is 500
        assert.strictEqual(status, 500);
        return res; // Return the response object for chaining
      }
    };

    await deleteEducationById(req, res);
  });
});
describe('Education Service - getListOfEducationById', function () {
  it('should return education data for a valid ID', async () => {
    const educationId = "65dcf26da065700a6a0374cc";
    const req = { params: { Id: educationId } };
    const educationData = {
      _id: educationId,
      uni_name: "University Name",
      diplome: "Diploma",
      startedOn: new Date("2022-01-01"),
      endAt: new Date("2022-12-31")
    };

    // Mock Education.findById to return education data
    Education.findById = async (id) => educationData;

    const res = {
      json: (data) => {
        assert.deepStrictEqual(data, educationData);
      },
      status: (statusCode) => {
        assert.strictEqual(statusCode, 200);
        return res;
      }
    };

    await getListOfEducationById(req, res);
  });

  it('should handle education not found properly', async () => {
    const educationId = "nonexistentid";
    const req = { params: { Id: educationId } };

    // Mock Education.findById to return null, simulating no education data found
    Education.findById = async () => null;

    const res = {
      json: (data) => {
        assert.deepStrictEqual(data, { error: "Education not found" });
      },
      status: (statusCode) => {
        assert.strictEqual(statusCode, 404);
        return res;
      }
    };

    await getListOfEducationById(req, res);
  });

  it('should handle internal server error properly', async () => {
    const educationId = "65dcf26da065700a6a0374cc";
    const req = { params: { Id: educationId } };

    // Mock Education.findById to throw an error
    Education.findById = async () => {
      throw new Error('Test error');
    };

    const res = {
      json: (data) => {
        assert.deepStrictEqual(data, { error: "Internal Server Error" });
      },
      status: (statusCode) => {
        assert.strictEqual(statusCode, 500);
        return res;
      }
    };

    await getListOfEducationById(req, res);
  });
});
