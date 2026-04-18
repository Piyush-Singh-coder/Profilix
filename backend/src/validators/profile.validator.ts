import { z } from "zod";

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).trim().optional(),
  headline: z.string().max(150).trim().optional().nullable(),
  bio: z.string().max(2000).trim().optional().nullable(),
  location: z.string().max(100).trim().optional().nullable(),
  status: z
    .enum([
      "LOOKING_FOR_ROLES",
      "OPEN_TO_HACKATHONS",
      "BUILDING_SOMETHING",
      "AVAILABLE_FOR_FREELANCE",
      "NOT_AVAILABLE",
      "CUSTOM",
    ])
    .optional(),
  statusCustomText: z.string().max(100).trim().optional().nullable(),
  isPublic: z.boolean().optional(),
  theme: z
    .enum([
      "GLASS",
      "BRUTALISM",
      "CLAY",
      "SKEUOMORPHIC",
      "MINIMAL",
      "NEON",
      "RETRO",
      "AURORA",
    ])
    .optional(),
  cardTheme: z
    .enum([
      "GLASSMORPHISM",
      "NEOBRUTALISM",
      "APPLE",
      "CLAY",
      "SKEUOMORPHIC",
    ])
    .optional(),
});

export const updateTechStackSchema = z.object({
  techIds: z
    .array(z.string().uuid("Each techId must be a valid UUID"))
    .max(20, "You can select at most 20 technologies"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
