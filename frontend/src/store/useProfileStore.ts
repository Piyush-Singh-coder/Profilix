import { create } from "zustand";
import { api } from "@/lib/api";
import { ApiSuccessResponse, Profile, ProfileTheme, TechStack } from "@/types";

interface ProfileState {
  profile: Profile | null;
  techStackOptions: TechStack[];
  isLoadingOptions: boolean;
  isLoading: boolean;
  isSaving: boolean;
  completeness: Record<string, boolean> | null;
  isLoadingCompleteness: boolean;
  error: string | null;

  fetchTechStackOptions: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  updateTheme: (theme: ProfileTheme) => Promise<void>;
  updateTechStack: (techIds: string[]) => Promise<void>;
  fetchProfileCompleteness: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  techStackOptions: [],
  isLoadingOptions: false,
  isLoading: false,
  isSaving: false,
  completeness: null,
  isLoadingCompleteness: false,
  error: null,

  fetchTechStackOptions: async () => {
    try {
      set({ isLoadingOptions: true });
      const { data } = await api.get<ApiSuccessResponse<TechStack[]>>("/profile/tech-stack/options");
      set({ techStackOptions: data.data, isLoadingOptions: false });
    } catch {
      set({ isLoadingOptions: false });
    }
  },

  fetchProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.get<ApiSuccessResponse<Profile>>("/profile");
      set({ profile: data.data, isLoading: false });
      // Refresh completeness whenever profile is fetched/updated
      get().fetchProfileCompleteness();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to fetch profile", isLoading: false });
    }
  },

  updateProfile: async (updates) => {
    const originalProfile = get().profile;
    if (originalProfile) {
      set({ profile: { ...originalProfile, ...updates } });
    }
    
    try {
      set({ isSaving: true, error: null });
      const { data } = await api.put<ApiSuccessResponse<Profile>>("/profile", updates);
      set({ profile: data.data, isSaving: false });
      get().fetchProfileCompleteness();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      if (originalProfile) set({ profile: originalProfile });
      set({ error: err.response?.data?.message || "Failed to update profile", isSaving: false });
      throw error;
    }
  },

  updateTheme: async (theme) => {
    const originalProfile = get().profile;
    if (originalProfile) {
      set({ profile: { ...originalProfile, theme } });
    }
    
    try {
      set({ isSaving: true, error: null });
      const { data } = await api.put<ApiSuccessResponse<Profile>>("/profile", { theme });
      set({ profile: data.data, isSaving: false });
      get().fetchProfileCompleteness();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      if (originalProfile) set({ profile: originalProfile });
      set({ error: err.response?.data?.message || "Failed to update theme", isSaving: false });
      throw error;
    }
  },

  updateTechStack: async (techIds) => {
    try {
      set({ isSaving: true, error: null });
      const { data } = await api.put<ApiSuccessResponse<Profile>>("/profile/tech-stack", { techIds });
      set({ profile: data.data, isSaving: false });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to update tech stack", isSaving: false });
      throw error;
    }
  },
  
  fetchProfileCompleteness: async () => {
    try {
      set({ isLoadingCompleteness: true });
      const { data } = await api.get("/profile/completeness");
      set({ completeness: data.data, isLoadingCompleteness: false });
    } catch (error) {
      console.error("[ProfileStore] fetchProfileCompleteness failed:", error);
      set({ isLoadingCompleteness: false });
    }
  }
}));
