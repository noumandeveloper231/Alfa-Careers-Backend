import app from "./app.js";
import { startJobsCron } from "./cron/jobsCron.js";
import { startStatusCron } from "./cron/recruiterCron.js";
import axios from "axios";
import cron from "node-cron";

const PORT = process.env.PORT || 5000;

startJobsCron();
startStatusCron();

// Ping backend every 5 minutes to prevent cold start (local/long-running server only)
const SELF_URL =
  (process.env.SELF_URL || "http://localhost:5000") + "/ping";
cron.schedule("*/5 * * * *", async () => {
  try {
    await axios.get(SELF_URL);
    console.log("Pinged self at", new Date().toLocaleTimeString());
  } catch (err) {
    console.log("Error pinging self:", err.message);
  }
});

app.listen(PORT, () => {
  console.log(`App Listening on http://localhost:${PORT}`);
});
