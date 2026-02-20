import cron from "node-cron";
import jobsModel from "../models/jobsModel.js";

/** Run the jobs cron logic (used by serverless cron endpoint and by in-process scheduler) */
export const runJobsCron = async () => {
  await jobsModel.updateMany(
    { applicationDeadline: { $lt: new Date() }, isActive: true },
    { $set: { isActive: false } }
  );
};

export const startJobsCron = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      await runJobsCron();
      console.log("Expired jobs updated ✅");
    } catch (err) {
      console.error("Cron job failed ❌", err);
    }
  });
};