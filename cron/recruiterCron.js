import cron from "node-cron";
import recruiterProfileModel from "../models/recruiterProfileModel.js";

/** Run the recruiter status cron logic (used by serverless cron endpoint and by in-process scheduler) */
export const runRecruiterCron = async () => {
  await recruiterProfileModel.updateMany(
    { profileScore: 100, reviewStatus: "pending" },
    { reviewStatus: "underReview" }
  );
};

export const startStatusCron = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      await runRecruiterCron();
      console.log("Checked 100 score ones ✅");
    } catch (err) {
      console.error("Cron job failed for ProfileScore one ❌", err);
    }
  });
};