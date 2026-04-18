import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100).trim(),
  description: z.string().max(1000).trim().optional(),
  bullets: z.array(z.string().max(300).trim()).max(10).optional(), // bullet points list
  repoUrl: z.string().url("Invalid repo URL").optional().or(z.literal("")),
  liveUrl: z.string().url("Invalid live URL").optional().or(z.literal("")),
  videoUrl: z.string().url("Invalid video URL").optional().or(z.literal("")),
  isPinned: z.boolean().default(false),
  techTags: z.array(z.string().max(50)).max(10).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const reorderProjectsSchema = z.object({
  projects: z.array(
    z.object({
      id: z.string().uuid(),
      displayOrder: z.number().int().min(0),
    })
  ),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
