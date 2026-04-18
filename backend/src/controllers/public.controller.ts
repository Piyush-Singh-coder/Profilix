import { Request, Response, NextFunction } from "express";
import * as publicService from "../services/public.service";
import { sendSuccess } from "../utils/response";

export const getPublicProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.params.username as string;
    const mode = req.query.mode as string | undefined;
    const profile = await publicService.getPublicProfile(username, mode);
    sendSuccess(res, profile);
  } catch (error) {
    next(error);
  }
};
