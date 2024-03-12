const Job = require('../models/job');
const User = require('../models/user');

const generateStats = async () => {
  try {
    const toprecruiters = await User.find({ role: 'Recruiter' });
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
      .limit(5);
    const jobCount = await Job.find().count();
    const TeacherCount = await User.find({ role: 'Teacher' }).count();
    const RecruiterCount = await User.find({ role: 'Recruiter' }).count();
    const StudentCount = await User.find({ role: 'Student' }).count();
    // Populating RelatedEntreprise for each job
    await Job.populate(recentOp, { path: 'Relatedentreprise' });
    return {
      recentOp, toprecruiters, jobCount, TeacherCount, RecruiterCount, StudentCount,
    };
  } catch (error) {
    console.error('Error getting stats:', error);
  }
};

module.exports = {
  generateStats,
};
