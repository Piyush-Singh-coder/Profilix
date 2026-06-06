import { Router } from "express";
import * as githubController from "../controllers/github.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { apiLimiter, heavyLimiter } from "../middlewares/rateLimiter.middleware";
import { z } from "zod";

const router = Router();
router.use(protect);

const syncSchema = z.object({
  username: z.string().min(1, "GitHub username is required").max(39),
});

router.post("/sync", heavyLimiter, validate(syncSchema), githubController.syncGitHubStats);
router.get("/stats", apiLimiter, githubController.getMyGitHubStats);

export default router;
