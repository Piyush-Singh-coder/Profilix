import { z } from "zod";

export const createExperienceSchema = z.object({
  company: z.string().min(1, "Company is required").max(150).trim(),
  role: z.string().min(1, "Role is required").max(150).trim(),
  location: z.string().max(100).trim().optional(),
  startDate: z.string().min(1, "Start date is required").refine(
    (d) => !isNaN(Date.parse(d)),
    "Invalid start date format"
  ),
  endDate: z.string().refine(
    (d) => !d || !isNaN(Date.parse(d)),
    "Invalid end date format"
  ).optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().max(500).trim().optional(),
  bullets: z.array(z.string().max(300).trim()).max(10).optional(),
  logoUrl: z.string().url("Invalid logo URL").optional().or(z.literal("")),
  displayOrder: z.number().int().min(0).optional(),
});

export const updateExperienceSchema = createExperienceSchema.partial();

export type CreateExperienceInput = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>;
