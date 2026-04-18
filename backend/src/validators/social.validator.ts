import { z } from "zod";

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
  url: z.string().url("Invalid URL"),
  visibleInDefault: z.boolean().default(true),
  visibleInRecruiter: z.boolean().default(true),
});

export const updateSocialLinkSchema = createSocialLinkSchema.partial();

export type CreateSocialLinkInput = z.infer<typeof createSocialLinkSchema>;
