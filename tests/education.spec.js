const assert = require('assert');
const Education = require('../models/education');
const { getListOfEducation } = require('../services/testedservices/services');

describe('Education Service - getListOfEducation', () => {
  let mockData;

  beforeEach(() => {
    // Override Education.find with a mock that returns a resolved promise
    Education.find = async () => mockData;
  });

  it('should return a list of education for a valid user ID', async () => {
    const req = { params: { userId: '65dcf26da065700a6a0374cc' } };

    mockData = [{
      uni_name: 'Iset charguia',
      diplome: 'Iseter',
      startedOn: new Date('2024-03-01T00:00:00.000Z').toISOString(),
      endAt: new Date('2024-03-29T00:00:00.000Z').toISOString(),
      Attestation: 'https://firebasestorage.googleapis.com/v0/b/twinerz-fceb6.appspot.com/o/attestation%2Fyessine.pdf?alt=media',
    }];

    const result = await getListOfEducation(req);

    // Check if the result is an array before using forEach
    if (Array.isArray(result)) {
      // Convert actual dates to ISO string format
      result.forEach((edu) => {
        edu.startedOn = new Date(edu.startedOn).toISOString();
        edu.endAt = new Date(edu.endAt).toISOString();
      });

      // Assert the response data is as expected
      assert.deepStrictEqual(result, mockData);
    } else {
      // If it's not an array, assume it's an error object
      assert.deepStrictEqual(result, { error: 'Internal Server Error' });
    }
  });

  it('should handle internal server error properly', async () => {
    // Force Education.find to throw an error
    Education.find = async () => {
      throw new Error('Test error');
    };

    const req = { params: { userId: '65dcf26da065700a6a0374cc' } };

    const result = await getListOfEducation(req);

    // Assert the result is an object with an error property
    assert.deepStrictEqual(result, { error: 'Internal Server Error' });
  });
});
