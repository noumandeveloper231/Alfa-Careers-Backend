import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import jobsRouter from "./routes/jobsRouter.js";
import "dotenv/config";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRouter.js";
import applicationRouter from "./routes/applicationRoutes.js";
import analyticRouter from "./routes/analyticRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import blogRouter from "./routes/blogRoutes.js";
import chatRouter from "./routes/chatBotRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import companyReviewRouter from "./routes/companyReviewRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import whatsapppRouter from "./routes/whatsappRoutes.js";
import { runJobsCron } from "./cron/jobsCron.js";
import { runRecruiterCron } from "./cron/recruiterCron.js";

const allowedOrigins = [
  "http://localhost:5173",
  "https://role-meld.onrender.com",
  "https://role-meld-1.onrender.com",
  "http://localhost:5174",
  "http://localhost:4173",
  "https://afla-careers-frontend.onrender.com",
  "https://alfa-careers.vercel.app",
];

const app = express();

// CORS first so every response (including errors) can include headers
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Ensure CORS headers on all responses (e.g. when route handlers send directly)
app.use((req, res, next) => {
  const origin = req.get("origin");
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  next();
});

app.use(cookieParser());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Lightweight ping route
app.get("/ping", (req, res) => res.sendStatus(200));

app.get("/", (req, res) => {
  res.send("I am Working");
});

// --- Cron endpoints (for external cron e.g. cron-jobs.org). Secured with CRON_SECRET. ---
const cronSecret = process.env.CRON_SECRET;
const cronAuth = (req, res, next) => {
  const secret =
    req.headers["x-cron-secret"] ||
    req.headers["authorization"]?.replace(/^Bearer\s+/i, "") ||
    req.query.secret;
  if (!cronSecret || secret === cronSecret) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
};

app.get("/api/cron/jobs", cronAuth, async (req, res) => {
  try {
    await runJobsCron();
    res.json({ ok: true, message: "Expired jobs updated" });
  } catch (err) {
    console.error("Cron jobs failed:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/cron/recruiter-status", cronAuth, async (req, res) => {
  try {
    await runRecruiterCron();
    res.json({ ok: true, message: "Recruiter status updated" });
  } catch (err) {
    console.error("Cron recruiter-status failed:", err);
    res.status(500).json({ error: err.message });
  }
});

// Download helper
app.get("/download", async (req, res) => {
  const imageUrl = req.query.url;
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  res.setHeader("Content-Disposition", "attachment; filename=image.jpg");
  res.send(Buffer.from(buffer));
});

app.use("/api/jobs", jobsRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/applications", applicationRouter);
app.use("/api/analytics", analyticRouter);
app.use("/api/blog", blogRouter);
app.use("/api/chat", chatRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/admin", adminRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/company-reviews", companyReviewRouter);
app.use("/api/profile", profileRouter);
app.use("/api/whatsapp", whatsapppRouter);

// Ensure DB is connected (for Vercel serverless cold start and local dev)
connectDB();

// Global error handler so error responses still send CORS headers (fixes CORS errors on 5xx)
app.use((err, req, res, next) => {
  const origin = req.get("origin");
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: err.message || "Internal Server Error" });
});

export default app;
