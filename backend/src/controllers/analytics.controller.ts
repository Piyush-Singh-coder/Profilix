import { Request, Response, NextFunction } from "express";
import * as analyticsService from "../services/analytics.service";
import { sendSuccess } from "../utils/response";

/**
 * GET /api/analytics/summary
 * Returns event counts grouped by type for the authenticated user.
 */
export const getSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const summary = await analyticsService.getAnalyticsSummary(req.user!.id);
    sendSuccess(res, summary);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/recent
 * Returns the last 50 events from the past 30 days for the authenticated user.
 */
export const getRecent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const events = await analyticsService.getRecentEvents(req.user!.id);
    sendSuccess(res, events);
  } catch (error) {
    next(error);
  }
};
