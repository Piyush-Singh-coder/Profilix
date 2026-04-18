import { z } from "zod";

export const createEducationSchema = z.object({
  school: z.string().min(1, "School is required").max(200).trim(),
  degree: z.string().max(150).trim().optional(),
  fieldOfStudy: z.string().max(150).trim().optional(),
  startDate: z
    .string()
    .min(1, "Start date is required")
    .refine((d) => !isNaN(Date.parse(d)), "Invalid start date format"),
  endDate: z
    .string()
    .refine((d) => !d || !isNaN(Date.parse(d)), "Invalid end date format")
    .optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().max(1000).trim().optional(),
  bullets: z.array(z.string().max(300).trim()).max(10).optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const updateEducationSchema = createEducationSchema.partial();

export type CreateEducationInput = z.infer<typeof createEducationSchema>;
export type UpdateEducationInput = z.infer<typeof updateEducationSchema>;

