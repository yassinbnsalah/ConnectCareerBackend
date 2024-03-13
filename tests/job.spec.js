const assert = require('assert');
const Job = require('../models/job');
const { getJobByRecruiter } = require('../services/jobService');

describe('getJobByRecruiter', () => {
  it('should return jobs for a given recruiter', async () => {
    const userId = '65d3c920d079b0c8b5ef1a31';
    const expectedJobs = [{ jobTitle: 'Software Engineer I' }, { jobTitle: 'jaw b dhaw' }];
    const findStub = {
      async populate() {
        return expectedJobs;
      }
    };
    const findFn = async () => findStub;

    // Mock Job.find
    Job.find = findFn;

 
  });

  it('should handle errors gracefully', async () => {
    const userId = '65d3c920d079b0c8b5ef1a31';
    const errorMessage = 'Error fetching jobs';
    const error = new Error(errorMessage);
    const findFn = async () => {
      throw error;
    };

    // Mock Job.find
    Job.find = findFn;

    const res = {
      status: (statusCode) => {
        assert.strictEqual(statusCode, 500);
        return {
          json: (data) => {
            assert.deepStrictEqual(data, { message: 'Server Error' });
          }
        };
      }
    };

    await getJobByRecruiter(userId, res);
  });
});
