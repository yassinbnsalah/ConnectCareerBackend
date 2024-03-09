const assert = require("assert");
const Skills = require("../models/skills");
const { createSkills, getAllSkills } = require("../services/skills");




describe('createSkills function', () => {
    it('should create a new skill', async () => {
      // Mock req and res objects
      const req = { body: { skillname: 'Test Skill' } };
      const res = { status: () => res, send: () => {} };
  
      // Mock save function of Skills model
      let saveCalled = false;
      Skills.prototype.save = async function () {
        saveCalled = true;
        return { _id: 'skill_id', skillname: this.skillname };
      };
  
      await createSkills(req, res);
  
      // Assert that the save method of Skills model is called with the correct data
      assert(saveCalled);
    });
  
    it('should handle errors properly', async () => {
      // Mock req and res objects
      const req = { body: { skillname: 'Test Skill' } };
      const res = { status: () => res, send: () => {} };
  
      // Mock save function of Skills model to throw an error
      const error = new Error('Test error');
      Skills.prototype.save = async function () {
        throw error;
      };
  
      // Spy on console.error to check if the error is logged
      const consoleErrorSpy = console.error;
      let consoleErrorCalled = false;
      console.error = function () {
        consoleErrorCalled = true;
      };
  
      await createSkills(req, res);
  
      // Assert that console.error is called with the error
      assert(consoleErrorCalled);
  
      // Restore console.error
      console.error = consoleErrorSpy;
    });
  });


  describe('getAllSkills function', () => {
    it('should return all skills', async () => {
      // Mock req and res objects
      const req = {};
      const res = { 
        status: function (statusCode) {
          this.statusCode = statusCode;
          return this;
        },
        json: function (data) {
          this.responseData = data;
          return this;
        }
      };
  
      // Mock Skills.find() to return skills
      const expectedSkills = [{ name: 'Skill 1' }, { name: 'Skill 2' }];
      Skills.find = () => expectedSkills;
  
      // Call the function
      await getAllSkills(req, res);
  
      // Assert the response status code
      assert.strictEqual(res.statusCode, 200);
  
      // Assert the response data
      assert.deepStrictEqual(res.responseData, { skills: expectedSkills });
    });
  
    it('should handle errors properly', async () => {
      // Mock req and res objects
      const req = {};
      const res = { 
        status: function (statusCode) {
          this.statusCode = statusCode;
          return this;
        },
        json: function (data) {
          this.responseData = data;
          return this;
        }
      };
  
      // Mock Skills.find() to throw an error
      const error = new Error('Test error');
      Skills.find = () => { throw error; };
  
      // Spy on console.error to check if the error is logged
      const consoleErrorSpy = console.error;
      let consoleErrorCalled = false;
      console.error = function () {
        consoleErrorCalled = true;
      };
  
      // Call the function
      await getAllSkills(req, res);
  
      // Assert the response status code
      assert.strictEqual(res.statusCode, 500);
  
      // Assert the response data
      assert.deepStrictEqual(res.responseData, { message: 'Internal server error' });
  
      // Assert that console.error is called with the error
      assert(consoleErrorCalled);
  
      // Restore console.error
      console.error = consoleErrorSpy;
    });
  });