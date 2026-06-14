import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as publicService from "../services/public.service";
import { sendSuccess } from "../utils/response";
import { env } from "../config/env";

export const getPublicProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.params.username as string;
    const mode = req.query.mode as string | undefined;

    // Optional: extract viewerId from cookie for liked state
    let viewerId: string | undefined;
    const token = req.cookies?.jwt as string | undefined;
    if (token) {
      try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
        viewerId = decoded.userId;
      } catch {
        // Ignore decoding errors for public routes
      }
    }

    const profile = await publicService.getPublicProfile(username, mode, viewerId);
    sendSuccess(res, profile);
  } catch (error) {
    next(error);
  }
};

export const getCommunityProfiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;
    const tech = req.query.tech as string | undefined;

    let viewerId: string | undefined;
    const token = req.cookies?.jwt as string | undefined;
    if (token) {
      try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
        viewerId = decoded.userId;
      } catch {
        // Ignore
      }
    }

    const result = await publicService.getCommunityProfiles({
      page,
      limit,
      search,
      status,
      tech,
      viewerId,
    });
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getTechStacks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const techStacks = await publicService.getTechStacks();
    sendSuccess(res, techStacks);
  } catch (error) {
    next(error);
  }
};

