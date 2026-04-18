import { create } from "zustand";
import { api } from "@/lib/api";
import { ApiSuccessResponse, Education } from "@/types";

interface CreateEducationInput {
  school: string;
  degree?: string | null;
  fieldOfStudy?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
  description?: string | null;
  bullets?: string[] | null;
  displayOrder?: number;
}

interface EducationState {
  educations: Education[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  fetchEducations: () => Promise<void>;
  createEducation: (data: CreateEducationInput) => Promise<void>;
  updateEducation: (id: string, data: Partial<CreateEducationInput>) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;
}

export const useEducationStore = create<EducationState>((set, get) => ({
  educations: [],
  isLoading: false,
  isSaving: false,
  error: null,

  fetchEducations: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.get<ApiSuccessResponse<Education[]>>("/education");
      set({
        educations: [...data.data].sort((a, b) => a.displayOrder - b.displayOrder),
        isLoading: false,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to fetch education info", isLoading: false });
    }
  },

  createEducation: async (input) => {
    try {
      set({ isSaving: true, error: null });
      const { data } = await api.post<ApiSuccessResponse<Education>>("/education", input);
      set({
        educations: [...get().educations, data.data].sort((a, b) => a.displayOrder - b.displayOrder),
        isSaving: false,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to create education entry", isSaving: false });
      throw error;
    }
  },

  updateEducation: async (id, input) => {
    try {
      set({ isSaving: true, error: null });
      const { data } = await api.put<ApiSuccessResponse<Education>>(`/education/${id}`, input);
      set({
        educations: get()
          .educations
          .map((e) => (e.id === id ? data.data : e))
          .sort((a, b) => a.displayOrder - b.displayOrder),
        isSaving: false,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to update education entry", isSaving: false });
      throw error;
    }
  },

  deleteEducation: async (id) => {
    try {
      set({ isSaving: true, error: null });
      await api.delete(`/education/${id}`);
      set({
        educations: get().educations.filter(e => e.id !== id),
        isSaving: false
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to delete education entry", isSaving: false });
      throw error;
    }
  }
}));
