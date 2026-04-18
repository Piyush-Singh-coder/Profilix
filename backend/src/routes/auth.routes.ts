import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { authLimiter } from "../middlewares/rateLimiter.middleware";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  oauthSchema,
} from "../validators/auth.validator";

const router = Router();

// Apply auth rate limiter to all auth routes
router.use(authLimiter);

// Email / Password
router.post("/register", validate(registerSchema), authController.register);
router.post("/verify", validate(verifyEmailSchema), authController.verifyEmail);
router.post("/login", validate(loginSchema), authController.login);

// OAuth (Google + GitHub via Firebase)
router.post("/google-login", validate(oauthSchema), authController.googleLogin);
router.post("/github-login", validate(oauthSchema), authController.githubLogin);

// Session
router.post("/logout", authController.logout);

// Protected
router.get("/profile", protect, authController.getMe);
router.delete("/account", protect, authController.deleteAccount);

export default router;
