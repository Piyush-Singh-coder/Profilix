import { Request, Response, NextFunction } from "express";
import * as socialService from "../services/social.service";
import { sendSuccess } from "../utils/response";

export const getSocialLinks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const links = await socialService.getSocialLinks(req.user!.id);
    sendSuccess(res, links);
  } catch (error) { next(error); }
};

export const createSocialLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const link = await socialService.createSocialLink(req.user!.id, req.body);
    sendSuccess(res, link, "Social link added", 201);
  } catch (error) { next(error); }
};

export const updateSocialLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const link = await socialService.updateSocialLink(req.user!.id, req.params.id as string, req.body);
    sendSuccess(res, link, "Social link updated");
  } catch (error) { next(error); }
};

export const deleteSocialLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await socialService.deleteSocialLink(req.user!.id, req.params.id as string);
    sendSuccess(res, null, "Social link removed");
  } catch (error) { next(error); }
};
