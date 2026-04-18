import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { imageLimiter } from "../middlewares/rateLimiter.middleware";
import * as qrController from "../controllers/qr.controller";

const router = Router();

// All QR endpoints require auth + image rate limiter
router.use(protect, imageLimiter);

/**
 * GET /api/qr               → standard QR code
 * GET /api/qr?variant=lock_screen  → vertical lock-screen card
 */
router.get("/", qrController.getQR);

export default router;
