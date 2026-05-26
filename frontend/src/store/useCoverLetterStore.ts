import { create } from "zustand";
import { api } from "@/lib/api";
import { ApiSuccessResponse } from "@/types";

export type CoverLetterStyle = "CLASSIC" | "MODERN" | "CREATIVE" | "MINIMALIST";

interface CoverLetterState {
  coverLetterContent: string | null;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  style: CoverLetterStyle;
  isGenerating: boolean;
  isDownloadingPdf: boolean;
  isDownloadingDocx: boolean;
  error: string | null;

  setCoverLetterContent: (content: string | null) => void;
  setJobTitle: (jobTitle: string) => void;
  setCompanyName: (companyName: string) => void;
  setJobDescription: (jobDescription: string) => void;
  setStyle: (style: CoverLetterStyle) => void;
  reset: () => void;

  generateCoverLetter: (args: {
    jobTitle: string;
    companyName: string;
    jobDescription?: string;
    style: CoverLetterStyle;
  }) => Promise<string>;

  downloadCoverLetter: (args: {
    content: string;
    jobTitle: string;
    companyName: string;
    style: CoverLetterStyle;
    format: "pdf" | "docx";
  }) => Promise<void>;
}

export const useCoverLetterStore = create<CoverLetterState>((set, get) => ({
  coverLetterContent: null,
  jobTitle: "",
  companyName: "",
  jobDescription: "",
  style: "CLASSIC",
  isGenerating: false,
  isDownloadingPdf: false,
  isDownloadingDocx: false,
  error: null,

  setCoverLetterContent: (content) => set({ coverLetterContent: content }),
  setJobTitle: (jobTitle) => set({ jobTitle }),
  setCompanyName: (companyName) => set({ companyName }),
  setJobDescription: (jobDescription) => set({ jobDescription }),
  setStyle: (style) => set({ style }),
  reset: () => set({
    coverLetterContent: null,
    jobTitle: "",
    companyName: "",
    jobDescription: "",
    style: "CLASSIC",
    error: null,
  }),

  generateCoverLetter: async ({ jobTitle, companyName, jobDescription, style }) => {
    try {
      set({ isGenerating: true, error: null });
      const { data } = await api.post<ApiSuccessResponse<{ content: string }>>("/cover-letter/generate", {
        jobTitle,
        companyName,
        jobDescription: jobDescription?.trim() || undefined,
        style,
      });

      const generatedContent = data.data.content;
      set({
        coverLetterContent: generatedContent,
        jobTitle,
        companyName,
        jobDescription: jobDescription || "",
        style,
        isGenerating: false,
      });
      return generatedContent;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errMsg = err.response?.data?.message || "Failed to generate cover letter";
      set({ error: errMsg, isGenerating: false });
      throw new Error(errMsg);
    }
  },

  downloadCoverLetter: async ({ content, jobTitle, companyName, style, format }) => {
    const isPdf = format === "pdf";
    try {
      if (isPdf) {
        set({ isDownloadingPdf: true, error: null });
      } else {
        set({ isDownloadingDocx: true, error: null });
      }

      const response = await api.post("/cover-letter/download", {
        content,
        jobTitle,
        companyName,
        style,
        format,
      }, { responseType: "blob" });

      const contentType = response.headers["content-type"] || (format === "pdf" ? "application/pdf" : "application/octet-stream");
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      
      const filename = `Cover_Letter_${companyName.replace(/\s+/g, "_")}_${Date.now()}.${format}`;
      
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      if (isPdf) {
        set({ isDownloadingPdf: false });
      } else {
        set({ isDownloadingDocx: false });
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errMsg = err.response?.data?.message || "Failed to download cover letter";
      if (isPdf) {
        set({ error: errMsg, isDownloadingPdf: false });
      } else {
        set({ error: errMsg, isDownloadingDocx: false });
      }
      throw new Error(errMsg);
    }
  },
}));
