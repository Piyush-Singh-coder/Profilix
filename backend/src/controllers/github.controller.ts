import { Request, Response, NextFunction } from "express";
import * as githubService from "../services/github.service";
import { sendSuccess } from "../utils/response";
import { BadRequestError, NotFoundError } from "../utils/errors";

/**
 * POST /github/sync
 * Body: { username: string }
 * Syncs GitHub stats for the authenticated user. Caches results.
 */
export const syncGitHubStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { username } = req.body as { username: string };

    const { stats, fromCache } = await githubService.getOrSyncGitHubStats(userId, username);

    sendSuccess(res, stats, fromCache ? "Stats loaded from cache" : "GitHub stats synced successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * GET /github/stats
 * Returns cached GitHub stats for the authenticated user.
 */
export const getMyGitHubStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const stats = await githubService.getGitHubStats(userId);

    if (!stats) {
      sendSuccess(res, null, "No GitHub stats synced yet");
      return;
    }

    sendSuccess(res, stats);
  } catch (error) {
    next(error);
  }
};
