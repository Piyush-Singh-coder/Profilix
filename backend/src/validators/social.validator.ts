import { z } from "zod";

const preprocessUrl = z.preprocess((val) => {
  if (typeof val !== "string") return val;
  const s = val.trim();
  if (!s) return s;
  if (!/^https?:\/\//i.test(s)) {
    return `https://${s}`;
  }
  return s;
}, z.string().url("Invalid URL"));

export const createSocialLinkSchema = z.object({
  platform: z.enum([
    "GITHUB",
    "LINKEDIN",
    "TWITTER",
    "LEETCODE",
    "HACKERRANK",
    "PERSONAL_WEBSITE",
    "OTHER",
  ]),
  url: preprocessUrl,
  visibleInDefault: z.boolean().default(true),
  visibleInRecruiter: z.boolean().default(true),
});

export const updateSocialLinkSchema = createSocialLinkSchema.partial();

export type CreateSocialLinkInput = z.infer<typeof createSocialLinkSchema>;
