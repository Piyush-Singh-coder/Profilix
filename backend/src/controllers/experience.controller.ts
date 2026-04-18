import { Request, Response, NextFunction } from "express";
import * as experienceService from "../services/experience.service";
import { sendSuccess } from "../utils/response";

export const getExperiences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const experiences = await experienceService.getExperiences(req.user!.id);
    sendSuccess(res, experiences);
  } catch (error) { next(error); }
};

export const createExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const experience = await experienceService.createExperience(req.user!.id, req.body);
    sendSuccess(res, experience, "Experience created", 201);
  } catch (error) { next(error); }
};

export const updateExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const experience = await experienceService.updateExperience(
      req.user!.id,
      req.params.id as string,
      req.body
    );
    sendSuccess(res, experience, "Experience updated");
  } catch (error) { next(error); }
};

export const deleteExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await experienceService.deleteExperience(req.user!.id, req.params.id as string);
    sendSuccess(res, null, "Experience deleted");
  } catch (error) { next(error); }
};
