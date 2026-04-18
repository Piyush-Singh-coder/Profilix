import { Router } from "express";
import authRoutes from "./auth.routes";
import profileRoutes from "./profile.routes";
import projectRoutes from "./project.routes";
import socialRoutes from "./social.routes";
import resumeRoutes from "./resume.routes";
import publicRoutes from "./public.routes";
import qrRoutes from "./qr.routes";
import analyticsRoutes from "./analytics.routes";
import githubRoutes from "./github.routes";
import experienceRoutes from "./experience.routes";
import achievementRoutes from "./achievement.routes";
import educationRoutes from "./education.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/projects", projectRoutes);
router.use("/social-links", socialRoutes);
router.use("/resume", resumeRoutes);
router.use("/qr", qrRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/github", githubRoutes);
router.use("/experience", experienceRoutes);
router.use("/achievements", achievementRoutes);
router.use("/education", educationRoutes);
router.use("/u", publicRoutes);

export default router;
