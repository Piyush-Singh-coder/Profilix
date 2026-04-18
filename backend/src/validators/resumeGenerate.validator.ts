import { z } from "zod";

export const resumeGenerateSchema = z.object({
  format: z.enum(["pdf", "docx"]).default("pdf"),
  templateType: z.enum(["ATS", "DESIGN"]).default("ATS"),
  activeTheme: z.string().optional(),
  jobDescription: z.string().max(20_000).optional(),
  useAI: z.boolean().default(false),
});

export type ResumeGenerateInput = z.infer<typeof resumeGenerateSchema>;

