import { create } from "zustand";
import { api } from "@/lib/api";
import { ApiSuccessResponse, CustomSection } from "@/types";

interface CreateCustomSectionInput {
  title: string;
  bullets: string[];
  displayOrder?: number;
}

interface CustomSectionState {
  customSections: CustomSection[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  fetchCustomSections: () => Promise<void>;
  createCustomSection: (data: CreateCustomSectionInput) => Promise<void>;
  updateCustomSection: (id: string, data: Partial<CreateCustomSectionInput>) => Promise<void>;
  deleteCustomSection: (id: string) => Promise<void>;
}

export const useCustomSectionStore = create<CustomSectionState>((set, get) => ({
  customSections: [],
  isLoading: false,
  isSaving: false,
  error: null,

  fetchCustomSections: async () => {
    if (get().isLoading) return;
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.get<ApiSuccessResponse<CustomSection[]>>("/custom-sections");
      set({
        customSections: [...data.data].sort((a, b) => a.displayOrder - b.displayOrder),
        isLoading: false,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to fetch custom sections", isLoading: false });
    }
  },

  createCustomSection: async (input) => {
    try {
      set({ isSaving: true, error: null });
      const { data } = await api.post<ApiSuccessResponse<CustomSection>>("/custom-sections", input);
      set({
        customSections: [...get().customSections, data.data].sort((a, b) => a.displayOrder - b.displayOrder),
        isSaving: false,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to create custom section", isSaving: false });
      throw error;
    }
  },

  updateCustomSection: async (id, input) => {
    try {
      set({ isSaving: true, error: null });
      const { data } = await api.put<ApiSuccessResponse<CustomSection>>(`/custom-sections/${id}`, input);
      set({
        customSections: get()
          .customSections
          .map((s) => (s.id === id ? data.data : s))
          .sort((a, b) => a.displayOrder - b.displayOrder),
        isSaving: false,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to update custom section", isSaving: false });
      throw error;
    }
  },

  deleteCustomSection: async (id) => {
    try {
      set({ isSaving: true, error: null });
      await api.delete(`/custom-sections/${id}`);
      set({
        customSections: get().customSections.filter(s => s.id !== id),
        isSaving: false
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to delete custom section", isSaving: false });
      throw error;
    }
  }
}));
