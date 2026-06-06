import { z } from "zod";

export const createCustomSectionSchema = z.object({
  title: z.string().min(1, "Title is required").max(100).trim(),
  bullets: z.array(z.string().min(1).max(300).trim()).min(1, "At least one bullet is required"),
  displayOrder: z.number().int().min(0).optional(),
});

export const updateCustomSectionSchema = createCustomSectionSchema.partial();

export type CreateCustomSectionInput = z.infer<typeof createCustomSectionSchema>;
export type UpdateCustomSectionInput = z.infer<typeof updateCustomSectionSchema>;
