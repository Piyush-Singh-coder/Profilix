import { Router } from "express";
import * as profileController from "../controllers/profile.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { apiLimiter } from "../middlewares/rateLimiter.middleware";
import { updateProfileSchema, updateTechStackSchema } from "../validators/profile.validator";

const router = Router();
router.use(protect, apiLimiter);

router.get("/", profileController.getProfile);
router.put("/", validate(updateProfileSchema), profileController.updateProfile);
router.post("/avatar", profileController.multerMiddleware, profileController.uploadAvatar);
router.put("/tech-stack", validate(updateTechStackSchema), profileController.updateTechStack);
router.get("/tech-stack/options", profileController.getTechStackOptions);
router.get("/completeness", profileController.getCompleteness);

export default router;
