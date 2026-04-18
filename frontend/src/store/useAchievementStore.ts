import { create } from "zustand";
import { api } from "@/lib/api";
import { ApiSuccessResponse, Achievement, AchievementType } from "@/types";

interface CreateAchievementInput {
  title: string;
  provider?: string;
  type?: AchievementType;
  date?: string;
  url?: string;
  description?: string;
  displayOrder?: number;
}

interface AchievementState {
  achievements: Achievement[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  fetchAchievements: () => Promise<void>;
  createAchievement: (data: CreateAchievementInput, image?: File | null) => Promise<void>;
  updateAchievement: (id: string, data: Partial<CreateAchievementInput>, image?: File | null) => Promise<void>;
  deleteAchievement: (id: string) => Promise<void>;
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  achievements: [],
  isLoading: false,
  isSaving: false,
  error: null,

  fetchAchievements: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.get<ApiSuccessResponse<Achievement[]>>("/achievements");
      set({
        achievements: [...data.data].sort((a, b) => a.displayOrder - b.displayOrder),
        isLoading: false,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to fetch achievements", isLoading: false });
    }
  },

  createAchievement: async (input, image) => {
    try {
      set({ isSaving: true, error: null });
      
      const formData = new FormData();
      formData.append("title", input.title);
      if (input.provider) formData.append("provider", input.provider);
      if (input.type) formData.append("type", input.type);
      if (input.date) formData.append("date", input.date);
      if (input.url) formData.append("url", input.url);
      if (input.description) formData.append("description", input.description);
      if (input.displayOrder !== undefined) formData.append("displayOrder", String(input.displayOrder));
      if (image) formData.append("image", image);

      const { data } = await api.post<ApiSuccessResponse<Achievement>>("/achievements", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      set({
        achievements: [...get().achievements, data.data].sort((a, b) => a.displayOrder - b.displayOrder),
        isSaving: false,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to create achievement", isSaving: false });
      throw error;
    }
  },

  updateAchievement: async (id, input, image) => {
    try {
      set({ isSaving: true, error: null });
      
      const formData = new FormData();
      if (input.title) formData.append("title", input.title);
      if (input.provider !== undefined) formData.append("provider", input.provider);
      if (input.type) formData.append("type", input.type);
      if (input.date !== undefined) formData.append("date", input.date);
      if (input.url !== undefined) formData.append("url", input.url);
      if (input.description !== undefined) formData.append("description", input.description);
      if (input.displayOrder !== undefined) formData.append("displayOrder", String(input.displayOrder));
      if (image) formData.append("image", image);

      const { data } = await api.put<ApiSuccessResponse<Achievement>>(`/achievements/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      set({
        achievements: get()
          .achievements
          .map((a) => (a.id === id ? data.data : a))
          .sort((a, b) => a.displayOrder - b.displayOrder),
        isSaving: false,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to update achievement", isSaving: false });
      throw error;
    }
  },

  deleteAchievement: async (id) => {
    try {
      set({ isSaving: true, error: null });
      await api.delete(`/achievements/${id}`);
      set({
        achievements: get().achievements.filter(a => a.id !== id),
        isSaving: false
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to delete achievement", isSaving: false });
      throw error;
    }
  }
}));
