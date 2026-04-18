import { NextFunction, Request, Response } from "express";
import * as educationService from "../services/education.service";
import { sendSuccess } from "../utils/response";

export const getEducations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const educations = await educationService.getEducations(req.user!.id);
    sendSuccess(res, educations);
  } catch (error) {
    next(error);
  }
};

export const createEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const education = await educationService.createEducation(req.user!.id, req.body);
    sendSuccess(res, education, "Education created", 201);
  } catch (error) {
    next(error);
  }
};

export const updateEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const education = await educationService.updateEducation(req.user!.id, req.params.id as string, req.body);
    sendSuccess(res, education, "Education updated");
  } catch (error) {
    next(error);
  }
};

export const deleteEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await educationService.deleteEducation(req.user!.id, req.params.id as string);
    sendSuccess(res, null, "Education deleted");
  } catch (error) {
    next(error);
  }
};

