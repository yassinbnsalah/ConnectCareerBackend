const Entreprise = require("../models/entreprise");
const Job = require("../models/job");
const Stats = require("../models/stats");
const User = require("../models/user");

const generateStats = async () => {
  try {
    const currentDate = new Date();
    const currentMonthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const currentMonthEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const totalJobsInCurrentMonth = await Job.aggregate([
      {
        $match: {
          creationDate: {
            $gte: currentMonthStart,
            $lte: currentMonthEnd,
          },
        },
      },
      {
        $count: "totalJobs",
      },
    ]);
    const toprecruiters = await User.find({ role: "Recruiter" });
    const recentOp = await Job.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "recruiter",
          foreignField: "_id",
          as: "recruiter",
        },
      },
      {
        $unwind: "$recruiter",
      },
      {
        $lookup: {
          from: "entreprises",
          localField: "recruiter.entreprise",
          foreignField: "_id",
          as: "entreprise",
        },
      },
      {
        $unwind: "$entreprise",
      },
    ])
      .sort({ creationDate: -1 })
      .limit(5);
    const jobCount = await Job.find().count();
    const jobPFECount = await Job.find({
      jobType: "End Of Study Internship",
    }).count();
    const jobSummerCount = await Job.find({
      jobType: "Summer internship",
    }).count();
    const totalCount = await Job.aggregate([
      {
        $match: {
          jobType: {
            $nin: ["End Of Study Internship", "Summer internship"],
          },
        },
      },
      {
        $count: "totalCount",
      },
    ]);

    const otherJobsCount = totalCount.length > 0 ? totalCount[0].totalCount : 0;

    const TeacherCount = await User.find({ role: "Teacher" }).count();
    const RecruiterCount = await User.find({ role: "Recruiter" }).count();
    const StudentCount = await User.find({ role: "Student" }).count();
    const alumniCount = await User.find({ role: "Alumni" }).count();

    // Populating RelatedEntreprise for each job
    await Job.populate(recentOp, { path: "Relatedentreprise" });
    return {
      recentOp,
      toprecruiters,
      jobCount,
      TeacherCount,
      RecruiterCount,
      StudentCount,
      alumniCount,
      jobPFECount,
      jobSummerCount,
      otherJobsCount,
      totalJobsInCurrentMonth
    };
  } catch (error) {
    console.error("Error getting stats:", error);
  }
};

const syncStatsEntreprise = async () => {
  try {
    const entreprises = await Entreprise.find();
    entreprises.forEach(async (entreprise) => {
      let stats = new Stats({
        totalNBOpportunite: entreprise?.nbOpportunitees,
        acceptedOpportunite: 0,
        nbFullTimeOP: 0,
        acceptedFullTimeOP: 0,
        nbPFEOP: 0,
        acceptedPFE: 0,
        nbSummerOP: 0,
        acceptedSummerOP: 0,
        TotalReach: 0,
      });
      await stats.save();
      entreprise.stats = stats;
      await entreprise.save();
    });
    return { message: "Sync Created Succefully" };
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
};

module.exports = {
  generateStats,
  syncStatsEntreprise,
};
