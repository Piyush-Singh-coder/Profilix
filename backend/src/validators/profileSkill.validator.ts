import { z } from "zod";

export const createProfileSkillSchema = z.object({
  category: z.string().min(1, "Category is required").max(100).trim(),
  skills: z.array(z.string().min(1).max(100).trim()).min(1, "At least one skill is required"),
  displayOrder: z.number().int().min(0).optional(),
});

export const updateProfileSkillSchema = createProfileSkillSchema.partial();

export type CreateProfileSkillInput = z.infer<typeof createProfileSkillSchema>;
export type UpdateProfileSkillInput = z.infer<typeof updateProfileSkillSchema>;
