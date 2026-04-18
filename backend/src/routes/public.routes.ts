import { Router } from "express";
import { publicProfileLimiter, imageLimiter } from "../middlewares/rateLimiter.middleware";
import * as publicController from "../controllers/public.controller";
import * as ogController from "../controllers/og.controller";
import * as cardController from "../controllers/card.controller";

const router = Router();

// GET /api/u/:username and /api/u/:username?mode=hire
router.get("/:username", publicProfileLimiter, publicController.getPublicProfile);

// GET /api/u/:username/og  — OG image for social previews (public, no auth)
router.get("/:username/og", imageLimiter, ogController.serveOGImage);

// GET /api/u/:username/card-export — Profile card image for export (public, no auth)
router.get("/:username/card-export", imageLimiter, cardController.exportCard);

export default router;
