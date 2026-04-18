import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { apiLimiter } from "../middlewares/rateLimiter.middleware";
import { validate } from "../middlewares/validate.middleware";
import * as educationController from "../controllers/education.controller";
import { createEducationSchema, updateEducationSchema } from "../validators/education.validator";

const router = Router();
router.use(protect, apiLimiter);

router.get("/", educationController.getEducations);
router.post("/", validate(createEducationSchema), educationController.createEducation);
router.put("/:id", validate(updateEducationSchema), educationController.updateEducation);
router.delete("/:id", educationController.deleteEducation);

export default router;

