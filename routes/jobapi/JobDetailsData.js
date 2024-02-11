const Job = require("../../models/job");

const GetJobDetailsData = async(req, res) =>{
    const jobId = req.params.jobId;

    try {
        const job = await Job.findById(jobId)
        .populate('recruiter');
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
  
      res.json(job);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
}
module.exports = GetJobDetailsData;
  