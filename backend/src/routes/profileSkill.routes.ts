import { Router } from "express";
import * as profileSkillController from "../controllers/profileSkill.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { apiLimiter } from "../middlewares/rateLimiter.middleware";
import { createProfileSkillSchema, updateProfileSkillSchema } from "../validators/profileSkill.validator";

const router = Router();
router.use(protect, apiLimiter);

router.get("/", profileSkillController.getProfileSkills);
router.post("/", validate(createProfileSkillSchema), profileSkillController.createProfileSkill);
router.put("/:id", validate(updateProfileSkillSchema), profileSkillController.updateProfileSkill);
router.delete("/:id", profileSkillController.deleteProfileSkill);

export default router;
