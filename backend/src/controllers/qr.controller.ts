import { Request, Response, NextFunction } from "express";
import { QRVariant } from "@prisma/client";
import * as qrService from "../services/qr.service";
import { trackEvent } from "../services/analytics.service";
import { sendSuccess } from "../utils/response";
import { BadRequestError } from "../utils/errors";

/**
 * GET /api/qr
 * GET /api/qr?variant=lock_screen
 *
 * Generates (or re-generates) a QR code for the authenticated user.
 * Returns a JSON response with the hosted image URL.
 */
export const getQR = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawVariant = (req.query.variant as string | undefined)?.toUpperCase();

    let variant: QRVariant = QRVariant.STANDARD;
    if (rawVariant) {
      if (!Object.values(QRVariant).includes(rawVariant as QRVariant)) {
        throw new BadRequestError(
          `Invalid variant. Use "standard" or "lock_screen".`
        );
      }
      variant = rawVariant as QRVariant;
    }

    const result = await qrService.getOrGenerateQR(req.user!.id, variant);

    // Fire-and-forget analytics
    trackEvent(req.user!.id, "QR_SCAN", {
      metadata: { variant },
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });

    sendSuccess(res, result, "QR code generated");
  } catch (error) {
    next(error);
  }
};
