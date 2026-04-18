import { z } from "zod";

export const achievementTypeEnum = z.enum([
  "HACKATHON",
  "COMPETITION",
  "CERTIFICATE",
  "AWARD",
  "OTHER",
]);

export const createAchievementSchema = z.object({
  title: z.string().min(1, "Title is required").max(200).trim(),
  provider: z.string().max(150).trim().optional(),
  type: achievementTypeEnum.default("OTHER"),
  date: z.string().refine(
    (d) => !d || !isNaN(Date.parse(d)),
    "Invalid date format"
  ).optional(),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  cloudinaryId: z.string().optional(),
  description: z.string().max(500).trim().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const updateAchievementSchema = createAchievementSchema.partial();

export type CreateAchievementInput = z.infer<typeof createAchievementSchema>;
export type UpdateAchievementInput = z.infer<typeof updateAchievementSchema>;
