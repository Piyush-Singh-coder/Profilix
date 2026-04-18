import { Request, Response, NextFunction } from "express";
import { generateOGImage } from "../services/og.service";
import { trackEvent } from "../services/analytics.service";
import { prisma } from "../config/database";

/**
 * GET /api/u/:username/og
 *
 * Returns a 1200×630 PNG image suitable for Open Graph meta tags.
 * Responds with raw image bytes — not JSON.
 */
export const serveOGImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const username = req.params.username as string;

    const buffer = await generateOGImage(username);

    // Fire-and-forget analytics if we can resolve the userId
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: { id: true },
    });
    if (user) {
      trackEvent(user.id, "OG_IMAGE_RENDER", {
        referrer: req.headers.referer,
        userAgent: req.headers["user-agent"],
        ip: req.ip,
      });
    }

    res.set({
      "Content-Type": "image/png",
      "Content-Length": buffer.length,
      // Cache for 10 minutes on CDN, 1 minute on browser
      "Cache-Control": "public, s-maxage=600, max-age=60",
    });
    res.end(buffer);
  } catch (error) {
    next(error);
  }
};
