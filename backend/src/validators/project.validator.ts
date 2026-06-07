import { z } from "zod";

const preprocessUrlOptional = (errMsg: string) => z.preprocess((val) => {
  if (typeof val !== "string") return val;
  const s = val.trim();
  if (!s) return s;
  if (!/^https?:\/\//i.test(s)) {
    return `https://${s}`;
  }
  return s;
}, z.string().url(errMsg).nullable().optional().or(z.literal("")));

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100).trim(),
  description: z.string().max(1000).trim().nullable().optional(),
  bullets: z.array(z.string().max(300).trim()).max(10).nullable().optional(), // bullet points list
  repoUrl: preprocessUrlOptional("Invalid repo URL"),
  liveUrl: preprocessUrlOptional("Invalid live URL"),
  videoUrl: preprocessUrlOptional("Invalid video URL"),
  isPinned: z.boolean().default(false),
  techTags: z.array(z.string().max(50)).max(10).nullable().optional(),
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
