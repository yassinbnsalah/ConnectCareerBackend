const Job = require("../../models/job");

const GetJobDetails = async(req, res) =>{
    const userId = req.params.userId;

    try {
      // Find all jobs published by the specified user
      const jobs = await Job.find({ recruiter: userId });
  
      if (!jobs) {
        return res.status(404).json({ message: 'No jobs found for this user' });
      }
  
      res.json(jobs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
}
module.exports = GetJobDetails;
  