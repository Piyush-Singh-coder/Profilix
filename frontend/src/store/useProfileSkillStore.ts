import { create } from "zustand";
import { api } from "@/lib/api";
import { ApiSuccessResponse, ProfileSkill } from "@/types";

interface CreateProfileSkillInput {
  category: string;
  skills: string[];
  displayOrder?: number;
}

interface ProfileSkillState {
  profileSkills: ProfileSkill[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  fetchProfileSkills: () => Promise<void>;
  createProfileSkill: (data: CreateProfileSkillInput) => Promise<void>;
  updateProfileSkill: (id: string, data: Partial<CreateProfileSkillInput>) => Promise<void>;
  deleteProfileSkill: (id: string) => Promise<void>;
}

export const useProfileSkillStore = create<ProfileSkillState>((set, get) => ({
  profileSkills: [],
  isLoading: false,
  isSaving: false,
  error: null,

  fetchProfileSkills: async () => {
    if (get().isLoading) return;
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.get<ApiSuccessResponse<ProfileSkill[]>>("/profile-skills");
      set({
        profileSkills: [...data.data].sort((a, b) => a.displayOrder - b.displayOrder),
        isLoading: false,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to fetch profile skills", isLoading: false });
    }
  },

  createProfileSkill: async (input) => {
    try {
      set({ isSaving: true, error: null });
      const { data } = await api.post<ApiSuccessResponse<ProfileSkill>>("/profile-skills", input);
      set({
        profileSkills: [...get().profileSkills, data.data].sort((a, b) => a.displayOrder - b.displayOrder),
        isSaving: false,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to create skill category", isSaving: false });
      throw error;
    }
  },

  updateProfileSkill: async (id, input) => {
    try {
      set({ isSaving: true, error: null });
      const { data } = await api.put<ApiSuccessResponse<ProfileSkill>>(`/profile-skills/${id}`, input);
      set({
        profileSkills: get()
          .profileSkills
          .map((s) => (s.id === id ? data.data : s))
          .sort((a, b) => a.displayOrder - b.displayOrder),
        isSaving: false,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to update skill category", isSaving: false });
      throw error;
    }
  },

  deleteProfileSkill: async (id) => {
    try {
      set({ isSaving: true, error: null });
      await api.delete(`/profile-skills/${id}`);
      set({
        profileSkills: get().profileSkills.filter(s => s.id !== id),
        isSaving: false
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to delete skill category", isSaving: false });
      throw error;
    }
  }
}));
