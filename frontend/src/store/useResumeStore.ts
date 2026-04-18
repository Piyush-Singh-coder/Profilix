import { create } from "zustand";
import { api } from "@/lib/api";
import { ApiSuccessResponse, Resume } from "@/types";
import { AxiosProgressEvent } from "axios";

interface ResumeState {
  resume: Resume | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  uploadProgress: number;

  fetchResume: () => Promise<void>;
  uploadResume: (file: File, onProgress?: (progress: number) => void) => Promise<void>;
  deleteResume: () => Promise<void>;
  generateResume: (args: { 
    format: "pdf" | "docx"; 
    templateType: "ATS" | "DESIGN";
    activeTheme?: string;
    jobDescription?: string; 
    useAI?: boolean 
  }) => Promise<void>;
}

export const useResumeStore = create<ResumeState>((set) => ({
  resume: null,
  isLoading: false,
  isSaving: false,
  error: null,
  uploadProgress: 0,

  fetchResume: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.get<ApiSuccessResponse<Resume>>("/resume");
      set({ resume: data.data, isLoading: false });
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      if (err.response?.status !== 404) {
        set({ error: err.response?.data?.message || "Failed to fetch resume", isLoading: false });
      } else {
        set({ resume: null, isLoading: false });
      }
    }
  },

  uploadResume: async (file: File, onProgress) => {
    try {
      set({ isSaving: true, error: null, uploadProgress: 0 });
      const formData = new FormData();
      formData.append("resume", file);
      
      const { data } = await api.post<ApiSuccessResponse<Resume>>("/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (!progressEvent.total) return;
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          set({ uploadProgress: progress });
          onProgress?.(progress);
        },
      });
      
      set({ resume: data.data, isSaving: false, uploadProgress: 100 });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to upload resume", isSaving: false, uploadProgress: 0 });
      throw error;
    }
  },

  deleteResume: async () => {
    try {
      set({ isSaving: true, error: null });
      await api.delete("/resume");
      set({ resume: null, isSaving: false, uploadProgress: 0 });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to delete resume", isSaving: false });
      throw error;
    }
  },

  generateResume: async ({ format, templateType, activeTheme, jobDescription, useAI }) => {
    try {
      set({ isSaving: true, error: null });

      const response = await api.post("/resume/generate", { 
        format, 
        templateType, 
        activeTheme, 
        jobDescription, 
        useAI 
      }, { responseType: "blob" });
      const contentDisposition = response.headers["content-disposition"] as string | undefined;
      const ts = Date.now();
      let filename = format === "pdf" ? `resume-${ts}.pdf` : `resume-${ts}.docx`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) {
          // Inject timestamp before extension to guarantee uniqueness
          filename = match[1].replace(/(\.pdf|\.docx)$/i, `-${ts}$1`);
        }
      }

      console.log(`[ResumeStore] Received ${response.data.size ?? response.data.byteLength ?? "?"} bytes, saving as: ${filename}`);

      const contentType = response.headers["content-type"] || (format === "pdf" ? "application/pdf" : "application/octet-stream");
      const blob = new Blob([response.data], { type: contentType });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      set({ isSaving: false });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to generate resume", isSaving: false });
      throw error;
    }
  },
}));
