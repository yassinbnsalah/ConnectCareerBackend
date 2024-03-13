const assert = require('assert');
const {
  getInterviewByRecruiter,
  createInterview,
  getInterviewsByApplicationandUser,
  VerifyInterview
} = require('../services/interview');
const Interview = require('../models/interview');
const User = require('../models/user');
const Job = require('../models/job'); // Import Job model

describe('Interview Functions', () => {
  describe('getInterviewByRecruiter', () => {
    it('should return interviews for a given recruiter', async () => {
      const userId = '65d5b48b0c02747b794efd91';
      // Mock Interview.find
      Interview.find = async () => [{ /* mock interview data */ }];
    
    });
  });

  describe('createInterview', () => {
    it('should create a new interview and send an email', async () => {
      const req = {
        body: {
          // mock request body
        }
      };
      // Mock Interview.save
      Interview.prototype.save = async () => {};
      // Mock User.findById
      User.findById = async () => ({
        email: 'contact.brogrammerz2324@gmail.com',
        firstname: 'Mouhamed',
        lastname: 'Recruiter'
      });
      // Mock Job.findById
      Job.findById = async () => ({
        jobTitle: 'Stage PFE Front Angular & Azure Stage'
      });
      // Mock sendMailToStudent function
      let isMailSent = false;
      sendMailToStudent = async () => { isMailSent = true; };
   
    });
  });

  // Add tests for other functions like getInterviewsByApplicationandUser and VerifyInterview

});
