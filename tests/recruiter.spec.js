const assert = require("assert");
const User = require("../models/user");
const { getRecruiterDetails } = require("../services/testedservices/services");


describe("getRecruiterDetails function", () => {
  it("should return details of a recruiter", async () => {
    // Stubbing the User.findById() method to return dummy data
    const recruiterId = "65d3c920d079b0c8b5ef1a31";
    const recruiterData = { _id: recruiterId, firstname: "ramla" };
    User.findById = async (id) => {
      return recruiterData;
    }; 
 
    const recruiterDetails = await getRecruiterDetails(recruiterId);

    assert.deepStrictEqual(recruiterDetails, recruiterData);
  });

  it("should handle errors properly", async () => {
    // Stubbing the User.findById() method to throw an error
    const recruiterId = "65d3c920d079b0c8b5ef1a31";
    const error = new Error("Test error");
    User.findById = async (id) => {
      throw error;
    };

    // Checking if the function throws the appropriate error
    try {
      await getRecruiterDetails(recruiterId);
    } catch (err) {
      assert.strictEqual(err.message, "Internal Server Error");
    }
  });
});

