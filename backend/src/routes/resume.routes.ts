import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { apiLimiter } from "../middlewares/rateLimiter.middleware";
import * as resumeController from "../controllers/resume.controller";
import { validate } from "../middlewares/validate.middleware";
import { resumeGenerateSchema } from "../validators/resumeGenerate.validator";

const router = Router();
router.use(protect, apiLimiter);

router.post("/", resumeController.multerMiddleware, resumeController.uploadResume);
router.get("/", resumeController.getResume);
router.delete("/", resumeController.deleteResume);
router.post("/generate", validate(resumeGenerateSchema), resumeController.generateResume);

export default router;
