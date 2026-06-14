import { Request, Response, NextFunction } from "express";
import * as likeService from "../services/like.service";
import { sendSuccess } from "../utils/response";

export const likeProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const likerId = req.user!.id;
    const profileId = req.params.profileId as string;
    const like = await likeService.likeProfile(likerId, profileId);
    sendSuccess(res, like, "Profile upvoted successfully");
  } catch (error) {
    next(error);
  }
};

export const unlikeProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const likerId = req.user!.id;
    const profileId = req.params.profileId as string;
    const result = await likeService.unlikeProfile(likerId, profileId);
    sendSuccess(res, result, "Upvote removed successfully");
  } catch (error) {
    next(error);
  }
};
