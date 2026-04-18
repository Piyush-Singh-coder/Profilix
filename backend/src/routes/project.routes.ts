import { Router } from "express";
import * as projectController from "../controllers/project.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { apiLimiter } from "../middlewares/rateLimiter.middleware";
import {
  createProjectSchema,
  updateProjectSchema,
  reorderProjectsSchema,
} from "../validators/project.validator";

const router = Router();
router.use(protect, apiLimiter);

router.get("/", projectController.getProjects);
router.post("/", validate(createProjectSchema), projectController.createProject);
router.put("/reorder", validate(reorderProjectsSchema), projectController.reorderProjects);
router.put("/:id", validate(updateProjectSchema), projectController.updateProject);
router.delete("/:id", projectController.deleteProject);
router.patch("/:id/pin", projectController.togglePin);

export default router;
