import { z } from "zod";

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).trim().optional(),
  headline: z.string().max(150).trim().optional().nullable(),
  bio: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine((val) => {
      if (!val) return true;
      const wordCount = val.trim().split(/\s+/).filter(Boolean).length;
      return wordCount <= 200;
    }, "Professional summary must not exceed 200 words"),
  location: z.string().max(100).trim().optional().nullable(),
  phoneNumber: z.string().max(30).trim().optional().nullable(),
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
      "LIGHT",
      "DARK",
    ])
    .optional(),
  cardTheme: z
    .enum([
      "GLASS",
      "BRUTAL",
      "APPLE",
    ])
    .optional(),
  resumeConfig: z.record(z.string(), z.any()).optional().nullable(),
});

export const updateTechStackSchema = z.object({
  techIds: z
    .array(z.string().uuid("Each techId must be a valid UUID"))
    .max(20, "You can select at most 20 technologies"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
