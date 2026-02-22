import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

import jobsRouter from "./routes/jobsRouter.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRouter.js";
import applicationRouter from "./routes/applicationRoutes.js";
import analyticRouter from "./routes/analyticRoutes.js";
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

const app = express();

/* =============================
   CONFIG
============================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:5174",
  "https://alfa-careers.vercel.app",
];

const PORT = process.env.PORT || 5000;

/* =============================
   DATABASE (Serverless Safe)
============================= */

let isConnected = false;

const ensureDB = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
    console.log("✅ Database connected");
  }
};

// Ensure DB connection per request (safe for serverless)
app.use(async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (err) {
    next(err);
  }
});

/* =============================
   MIDDLEWARE
============================= */

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

/* =============================
   STATIC FILES
============================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =============================
   HEALTH CHECK
============================= */

app.get("/ping", (req, res) => res.sendStatus(200));
app.get("/", (req, res) => res.send("API Running 🚀"));

/* =============================
   CRON ENDPOINTS (Secure)
============================= */

const cronSecret = process.env.CRON_SECRET;

const cronAuth = (req, res, next) => {
  const secret =
    req.headers["x-cron-secret"] ||
    req.headers.authorization?.replace(/^Bearer\s+/i, "") ||
    req.query.secret;

  if (!cronSecret || secret === cronSecret) {
    return next();
  }

  res.status(401).json({ error: "Unauthorized" });
};

app.get("/api/cron/jobs", cronAuth, async (req, res, next) => {
  try {
    await runJobsCron();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

app.get("/api/cron/recruiter-status", cronAuth, async (req, res, next) => {
  try {
    await runRecruiterCron();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/* =============================
   ROUTES
============================= */

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

/* =============================
   GLOBAL ERROR HANDLER
============================= */

app.use((err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;

  res.status(status).json({
    error: process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message,
  });
});

/* =============================
   LOCAL SERVER ONLY
============================= */

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Local server running on port ${PORT}`);
  });
}

/* =============================
   EXPORT FOR VERCEL
============================= */

export default app;