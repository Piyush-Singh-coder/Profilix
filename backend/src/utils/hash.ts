import crypto from "crypto";

/**
 * Hash an IP address for privacy-compliant analytics storage.
 * We never store the raw IP — only a one-way SHA-256 hash.
 */
export const hashIp = (ip: string): string => {
  return crypto.createHash("sha256").update(ip).digest("hex");
};
