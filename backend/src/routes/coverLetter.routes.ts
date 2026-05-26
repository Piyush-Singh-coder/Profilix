import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { apiLimiter } from "../middlewares/rateLimiter.middleware";
import * as coverLetterController from "../controllers/coverLetter.controller";
import { validate } from "../middlewares/validate.middleware";
import { generateCoverLetterSchema, downloadCoverLetterSchema } from "../validators/coverLetter.validator";

const router = Router();
router.use(protect, apiLimiter);

router.post("/generate", validate(generateCoverLetterSchema), coverLetterController.generateCoverLetter);
router.post("/download", validate(downloadCoverLetterSchema), coverLetterController.downloadCoverLetter);

export default router;
