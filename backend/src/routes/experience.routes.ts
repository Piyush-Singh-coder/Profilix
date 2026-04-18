import { Router } from "express";
import * as experienceController from "../controllers/experience.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { apiLimiter } from "../middlewares/rateLimiter.middleware";
import { createExperienceSchema, updateExperienceSchema } from "../validators/experience.validator";

const router = Router();
router.use(protect, apiLimiter);

router.get("/", experienceController.getExperiences);
router.post("/", validate(createExperienceSchema), experienceController.createExperience);
router.put("/:id", validate(updateExperienceSchema), experienceController.updateExperience);
router.delete("/:id", experienceController.deleteExperience);

export default router;
