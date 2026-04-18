import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { apiLimiter } from "../middlewares/rateLimiter.middleware";
import * as analyticsController from "../controllers/analytics.controller";

const router = Router();

// All analytics endpoints are private — require auth
router.use(protect, apiLimiter);

router.get("/summary", analyticsController.getSummary);
router.get("/recent", analyticsController.getRecent);

export default router;
