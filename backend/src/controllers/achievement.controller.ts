import { Request, Response, NextFunction } from "express";
import * as achievementService from "../services/achievement.service";
import { sendSuccess } from "../utils/response";
import { BadRequestError } from "../utils/errors";
import multer from "multer";

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

export const multerMiddleware = upload.single("image");


export const getAchievements = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const achievements = await achievementService.getAchievements(req.user!.id);
    sendSuccess(res, achievements);
  } catch (error) { next(error); }
};

export const createAchievement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let imageUrl = req.body.imageUrl;
    let cloudinaryId = req.body.cloudinaryId;

    if (req.file) {
      const uploadResult = await achievementService.uploadCertificateImage(
        req.file.buffer,
        req.file.originalname
      );
      imageUrl = uploadResult.imageUrl;
      cloudinaryId = uploadResult.cloudinaryId;
    }

    const data = {
      ...req.body,
      imageUrl,
      cloudinaryId,
    };

    const achievement = await achievementService.createAchievement(req.user!.id, data);
    sendSuccess(res, achievement, "Achievement created", 201);
  } catch (error) { next(error); }
};

export const updateAchievement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let imageUrl = req.body.imageUrl;
    let cloudinaryId = req.body.cloudinaryId;

    if (req.file) {
      const uploadResult = await achievementService.uploadCertificateImage(
        req.file.buffer,
        req.file.originalname
      );
      imageUrl = uploadResult.imageUrl;
      cloudinaryId = uploadResult.cloudinaryId;
    }

    const data = {
      ...req.body,
      imageUrl: imageUrl !== undefined ? imageUrl : req.body.imageUrl,
      cloudinaryId: cloudinaryId !== undefined ? cloudinaryId : req.body.cloudinaryId,
    };

    const achievement = await achievementService.updateAchievement(
      req.user!.id,
      req.params.id as string,
      data
    );
    sendSuccess(res, achievement, "Achievement updated");
  } catch (error) { next(error); }
};

export const deleteAchievement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await achievementService.deleteAchievement(req.user!.id, req.params.id as string);
    sendSuccess(res, null, "Achievement deleted");
  } catch (error) { next(error); }
};
