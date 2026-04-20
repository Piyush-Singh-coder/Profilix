import { Request, Response, NextFunction } from "express";
import * as profileService from "../services/profile.service";
import { sendSuccess } from "../utils/response";
import multer from "multer";
import { BadRequestError } from "../utils/errors";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new BadRequestError("Only image files are allowed") as any, false);
    }
  },
});

export const multerMiddleware = upload.single("avatar");

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await profileService.getProfile(req.user!.id);
    sendSuccess(res, profile);
  } catch (error) { next(error); }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await profileService.updateProfile(req.user!.id, req.body);
    sendSuccess(res, profile, "Profile updated");
  } catch (error) { next(error); }
};

export const uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) throw new BadRequestError("No file uploaded");
    const user = await profileService.uploadAvatar(req.user!.id, req.file.buffer);
    sendSuccess(res, { avatarUrl: user.avatarUrl }, "Avatar updated");
  } catch (error) { next(error); }
};

export const updateTechStack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await profileService.updateTechStack(req.user!.id, req.body.techIds);
    sendSuccess(res, profile, "Tech stack updated");
  } catch (error) { next(error); }
};

export const getTechStackOptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options = await profileService.getTechStackOptions();
    sendSuccess(res, options);
  } catch (error) { next(error); }
};

export const getCompleteness = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const completeness = await profileService.getProfileCompleteness(req.user!.id);
    sendSuccess(res, completeness);
  } catch (error) { next(error); }
};
