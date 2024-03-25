const { CronJob } = require("cron");
const { CloseJob } = require("../services/jobService");

exports.initScheduledJobs = () => {
  const scheduledJobFunction = new CronJob(
    "*/5 * * * * *",
    () => {
      console.log("I'm executed on a schedule!");
      // Add your custom logic here
    },
    null,
    true
  );
  scheduledJobFunction.start();
};

exports.initSendReports = (date, jobID) => {
  let dateConverted = new Date(date);
  const day = dateConverted.getDate();
  const month = dateConverted.getMonth();
  const year = dateConverted.getFullYear();
  const sendJobReport = new CronJob(
    `0 00 15 ${day} ${month} *`,
    () => {
      console.log("Sending Job Report");
      // Add your custom logic here
      CloseJob(jobID)
    },
    null,
    true
  );
  sendJobReport.start();
};
