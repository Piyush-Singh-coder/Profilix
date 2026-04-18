import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { clearToken } from "../utils/token";
import { sendSuccess } from "../utils/response";
import { prisma } from "../config/database";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.registerUser(req.body, res);
    sendSuccess(res, user, "Registration successful! Please check your email to verify your account.", 201);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.verifyEmail(req.body.token);
    sendSuccess(res, null, "Email verified successfully. You can now log in.");
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.loginUser(req.body, res);
    sendSuccess(res, user, "Login successful");
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.googleLogin(req.body, res);
    sendSuccess(res, user, "Google authentication successful");
  } catch (error) {
    next(error);
  }
};

export const githubLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.githubLogin(req.body, res);
    sendSuccess(res, user, "GitHub authentication successful");
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    clearToken(res);
    sendSuccess(res, null, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        username: true,
        isVerified: true,
        authProvider: true,
        avatarUrl: true,
        createdAt: true,
        profile: {
          select: {
            theme: true,
          },
        },
      },
    });

    if (!result) {
      throw new Error("User not found");
    }

    const { profile, ...user } = result;
    const finalUser = {
      ...user,
      selectedTheme: profile?.theme || "GLASS",
    };

    sendSuccess(res, finalUser);
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.deleteAccount(req.user!.id);
    clearToken(res);
    sendSuccess(res, null, "Account permanently deleted");
  } catch (error) {
    next(error);
  }
};
