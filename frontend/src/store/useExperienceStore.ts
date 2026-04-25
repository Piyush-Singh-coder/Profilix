import { create } from "zustand";
import { api } from "@/lib/api";
import { ApiSuccessResponse, Experience } from "@/types";

interface CreateExperienceInput {
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
  bullets?: string[];
  displayOrder?: number;
}

interface ExperienceState {
  experiences: Experience[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  fetchExperiences: () => Promise<void>;
  createExperience: (data: CreateExperienceInput) => Promise<void>;
  updateExperience: (id: string, data: Partial<CreateExperienceInput>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
}

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  experiences: [],
  isLoading: false,
  isSaving: false,
  error: null,

  fetchExperiences: async () => {
    // Guard: skip if already fetching
    if (get().isLoading) return;
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.get<ApiSuccessResponse<Experience[]>>("/experience");
      set({
        experiences: [...data.data].sort((a, b) => a.displayOrder - b.displayOrder),
        isLoading: false,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to fetch experiences", isLoading: false });
    }
  },

  createExperience: async (input) => {
    try {
      set({ isSaving: true, error: null });
      const { data } = await api.post<ApiSuccessResponse<Experience>>("/experience", input);
      set({
        experiences: [...get().experiences, data.data].sort((a, b) => a.displayOrder - b.displayOrder),
        isSaving: false,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to create experience", isSaving: false });
      throw error;
    }
  },

  updateExperience: async (id, input) => {
    try {
      set({ isSaving: true, error: null });
      const { data } = await api.put<ApiSuccessResponse<Experience>>(`/experience/${id}`, input);
      set({
        experiences: get()
          .experiences
          .map((e) => (e.id === id ? data.data : e))
          .sort((a, b) => a.displayOrder - b.displayOrder),
        isSaving: false,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to update experience", isSaving: false });
      throw error;
    }
  },

  deleteExperience: async (id) => {
    try {
      set({ isSaving: true, error: null });
      await api.delete(`/experience/${id}`);
      set({
        experiences: get().experiences.filter(e => e.id !== id),
        isSaving: false
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to delete experience", isSaving: false });
      throw error;
    }
  }
}));
