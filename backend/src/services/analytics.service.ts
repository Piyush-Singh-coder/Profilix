import { prisma } from "../config/database";
import { AnalyticsEventType, Prisma } from "@prisma/client";
import crypto from "crypto";

interface TrackEventOptions {
  referrer?: string;
  userAgent?: string;
  ip?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Fire-and-forget analytics event recorder.
 * Never throws — failures are silently logged so they never break request flows.
 */
export const trackEvent = (
  userId: string,
  eventType: AnalyticsEventType,
  options: TrackEventOptions = {}
): void => {
  const ipHash = options.ip
    ? crypto.createHash("sha256").update(options.ip).digest("hex").slice(0, 64)
    : undefined;

  prisma.analyticsEvent
    .create({
      data: {
        userId,
        eventType,
        referrer: options.referrer ?? null,
        userAgent: options.userAgent ?? null,
        ipHash: ipHash ?? null,
        metadata: options.metadata
          ? (options.metadata as Prisma.InputJsonValue)
          : undefined,
      },
    })
    .catch((err: unknown) => {
      console.error("[analytics] Failed to record event:", err);
    });
};

/**
 * Get a summary of analytics events for a user, grouped by event type.
 */
export const getAnalyticsSummary = async (userId: string) => {
  const events = await prisma.analyticsEvent.groupBy({
    by: ["eventType"],
    where: { userId },
    _count: { eventType: true },
  });

  return events.map((e) => ({
    event: e.eventType,
    count: e._count.eventType,
  }));
};

/**
 * Get recent analytics events for a user (last 30 days).
 */
export const getRecentEvents = async (userId: string, limit = 50) => {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  return prisma.analyticsEvent.findMany({
    where: { userId, timestamp: { gte: since } },
    orderBy: { timestamp: "desc" },
    take: limit,
    select: {
      eventType: true,
      referrer: true,
      timestamp: true,
      metadata: true,
    },
  });
};
