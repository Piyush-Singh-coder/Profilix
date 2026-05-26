import { z } from "zod";

export const generateCoverLetterSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required").max(150),
  companyName: z.string().min(1, "Company name is required").max(150),
  jobDescription: z.string().max(25000).optional(),
  style: z.enum(["CLASSIC", "MODERN", "CREATIVE", "MINIMALIST"]).default("CLASSIC"),
});

export const downloadCoverLetterSchema = z.object({
  content: z.string().min(1, "Cover letter content is required"),
  jobTitle: z.string().min(1, "Job title is required").max(150),
  companyName: z.string().min(1, "Company name is required").max(150),
  style: z.enum(["CLASSIC", "MODERN", "CREATIVE", "MINIMALIST"]).default("CLASSIC"),
  format: z.enum(["pdf", "docx"]).default("pdf"),
});

export type GenerateCoverLetterInput = z.infer<typeof generateCoverLetterSchema>;
export type DownloadCoverLetterInput = z.infer<typeof downloadCoverLetterSchema>;
