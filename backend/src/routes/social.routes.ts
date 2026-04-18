import { Router } from "express";
import * as socialController from "../controllers/social.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { apiLimiter } from "../middlewares/rateLimiter.middleware";
import { createSocialLinkSchema, updateSocialLinkSchema } from "../validators/social.validator";

const router = Router();
router.use(protect, apiLimiter);

router.get("/", socialController.getSocialLinks);
router.post("/", validate(createSocialLinkSchema), socialController.createSocialLink);
router.put("/:id", validate(updateSocialLinkSchema), socialController.updateSocialLink);
router.delete("/:id", socialController.deleteSocialLink);

export default router;
