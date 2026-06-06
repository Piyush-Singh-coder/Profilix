import { Router } from "express";
import * as customSectionController from "../controllers/customSection.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { apiLimiter } from "../middlewares/rateLimiter.middleware";
import { createCustomSectionSchema, updateCustomSectionSchema } from "../validators/customSection.validator";

const router = Router();
router.use(protect, apiLimiter);

router.get("/", customSectionController.getCustomSections);
router.post("/", validate(createCustomSectionSchema), customSectionController.createCustomSection);
router.put("/:id", validate(updateCustomSectionSchema), customSectionController.updateCustomSection);
router.delete("/:id", customSectionController.deleteCustomSection);

export default router;
