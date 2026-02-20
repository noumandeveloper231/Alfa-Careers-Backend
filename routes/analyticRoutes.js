import express from "express";
import { 
    weeklyAnalytic,
    getDashboardStats,
    jobAnalytics,
    applicationAnalytics,
    userAnalytics,
    systemAnalytics
} from "../controllers/analyticsController.js";

const analyticRouter = express.Router();

// Dashboard overview
analyticRouter.get('/dashboard-stats', getDashboardStats);

// Weekly analytics
analyticRouter.get('/weekly-analytics', weeklyAnalytic);

// Specific analytics
analyticRouter.get('/job-analytics', jobAnalytics);
analyticRouter.get('/application-analytics', applicationAnalytics);
analyticRouter.get('/user-analytics', userAnalytics);
analyticRouter.get('/system-analytics', systemAnalytics);

export default analyticRouter;