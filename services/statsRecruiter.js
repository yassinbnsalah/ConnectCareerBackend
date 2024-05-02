const Job = require('../models/job');
const Postulation = require('../models/postulation');
const User = require('../models/user');
const moment = require('moment');
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

    // Calculate the start and end dates of the current month
    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().endOf('month');
    const jobCountThisMonth = await Job.countDocuments({
      recruiter: userId,
      creationDate: {
          $gte: startOfMonth.toDate(),
          $lte: endOfMonth.toDate()
      }
  });
  
    const postulationCount = await Postulation.countDocuments({ job: jobId });

    const postulationCountWithDateFilter = await Postulation.countDocuments({
      job: jobId,
      createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth
      }
  });
    await Job.populate(recentOp, { path: 'Relatedentreprise' });
    return { jobCount, postulationCount, recentOp , jobCountThisMonth , postulationCountWithDateFilter };
  } catch (error) {
    console.error('Error getting stats:', error);
  }
};

module.exports = {
  generateStats,
};
