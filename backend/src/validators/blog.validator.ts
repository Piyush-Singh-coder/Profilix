import { z } from "zod";

const optionalUrl = z.preprocess((val) => {
  if (typeof val !== "string") return val;
  const trimmed = val.trim();
  if (!trimmed) return "";
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}, z.string().url("Invalid image URL").optional().or(z.literal("")));

const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Slug is required")
  .max(140, "Slug must be under 140 characters")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only");

export const createBlogSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(180),
  slug: slugSchema.optional(),
  excerpt: z.string().trim().min(40, "Excerpt should be at least 40 characters").max(320),
  content: z.string().trim().min(100, "Content should be at least 100 characters").max(60000),
  coverImage: optionalUrl,
  coverImageAlt: z.string().trim().max(160).optional().or(z.literal("")),
  metaTitle: z.string().trim().max(70).optional().or(z.literal("")),
  metaDescription: z.string().trim().max(170).optional().or(z.literal("")),
  keywords: z.array(z.string().trim().min(1).max(60)).max(20).default([]),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  publishedAt: z.string().datetime().optional().nullable(),
});

export const updateBlogSchema = createBlogSchema.partial();

export const publishBlogSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type PublishBlogInput = z.infer<typeof publishBlogSchema>;
