import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { apiLimiter, heavyLimiter } from "../middlewares/rateLimiter.middleware";
import * as resumeController from "../controllers/resume.controller";
import { validate } from "../middlewares/validate.middleware";
import { resumeGenerateSchema } from "../validators/resumeGenerate.validator";

const router = Router();
router.use(protect);

router.post("/", heavyLimiter, resumeController.multerMiddleware, resumeController.uploadResume);
router.post("/parse", heavyLimiter, resumeController.multerMiddleware, resumeController.parseResume);
router.get("/", apiLimiter, resumeController.getResume);
router.delete("/", apiLimiter, resumeController.deleteResume);
router.post("/generate", heavyLimiter, validate(resumeGenerateSchema), resumeController.generateResume);

export default router;
