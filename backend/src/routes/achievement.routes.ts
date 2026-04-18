import { Router } from "express";
import * as achievementController from "../controllers/achievement.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { apiLimiter } from "../middlewares/rateLimiter.middleware";
import { createAchievementSchema, updateAchievementSchema } from "../validators/achievement.validator";

const router = Router();
router.use(protect, apiLimiter);

router.get("/", achievementController.getAchievements);
router.post(
  "/",
  achievementController.multerMiddleware,
  (req, res, next) => {
    // Manually run validation if we use FormData due to file upload
    if (req.body.data) {
        try {
            req.body = JSON.parse(req.body.data);
        } catch {
            return res.status(400).json({ success: false, message: "Invalid JSON data" });
        }
    }
    next();
  },
  validate(createAchievementSchema),
  achievementController.createAchievement
);
router.put(
  "/:id",
  achievementController.multerMiddleware,
  (req, res, next) => {
    if (req.body.data) {
        try {
            req.body = JSON.parse(req.body.data);
        } catch {
            return res.status(400).json({ success: false, message: "Invalid JSON data" });
        }
    }
    next();
  },
  validate(updateAchievementSchema),
  achievementController.updateAchievement
);
router.delete("/:id", achievementController.deleteAchievement);

export default router;
