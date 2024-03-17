const Job = require('../models/job');
const Postulation = require('../models/postulation');
const User = require('../models/user');

const generateStats = async (userId, jobId) => {
  try {
    const recentOp = await Job.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'recruiter',
          foreignField: '_id',
          as: 'recruiter',
        },
      },
      {
        $unwind: '$recruiter',
      },
      {
        $lookup: {
          from: 'entreprises',
          localField: 'recruiter.entreprise',
          foreignField: '_id',
          as: 'entreprise',
        },
      },
      {
        $unwind: '$entreprise',
      },
    ])
      .sort({ creationDate: -1 })
      .limit(4);
    const jobCount = await Job.countDocuments({ recruiter: userId });
    const postulationCount = await Postulation.countDocuments({ job: jobId });

    await Job.populate(recentOp, { path: 'Relatedentreprise' });
    return { jobCount, postulationCount, recentOp };
  } catch (error) {
    console.error('Error getting stats:', error);
  }
};

module.exports = {
  generateStats,
};
