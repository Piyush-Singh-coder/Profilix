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
    // Avoid double-fetching if already loaded
    if (get().techStackOptions.length > 0) return;
    try {
      set({ isLoadingOptions: true });
      const { data } = await api.get<ApiSuccessResponse<TechStack[]>>("/profile/tech-stack/options");
      set({ techStackOptions: data.data, isLoadingOptions: false });
    } catch {
      set({ isLoadingOptions: false });
    }
  },

  fetchProfile: async () => {
    // Avoid re-fetching if already in flight
    if (get().isLoading) return;
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.get<ApiSuccessResponse<Profile>>("/profile");
      set({ profile: data.data, isLoading: false });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to fetch profile", isLoading: false });
    }
  },

  updateProfile: async (updates) => {
    const originalProfile = get().profile;
    // Optimistic update - immediate UI response
    if (originalProfile) {
      set({ profile: { ...originalProfile, ...updates } });
    }
    
    try {
      set({ isSaving: true, error: null });
      const { data } = await api.put<ApiSuccessResponse<Profile>>("/profile", updates);
      set({ profile: data.data, isSaving: false });
      // Fire completeness check in background, don't await
      get().fetchProfileCompleteness();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      // Roll back optimistic update on failure
      if (originalProfile) set({ profile: originalProfile });
      set({ error: err.response?.data?.message || "Failed to update profile", isSaving: false });
      throw error;
    }
  },

  updateTheme: async (theme) => {
    const originalProfile = get().profile;
    // Optimistic update - instant visual feedback
    if (originalProfile) {
      set({ profile: { ...originalProfile, theme } });
    }
    
    try {
      set({ isSaving: true, error: null });
      const { data } = await api.put<ApiSuccessResponse<Profile>>("/profile", { theme });
      set({ profile: data.data, isSaving: false });
      // Theme change doesn't affect completeness - skip the check
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
    // Guard: don't fire if already loading
    if (get().isLoadingCompleteness) return;
    try {
      set({ isLoadingCompleteness: true });
      const { data } = await api.get("/profile/completeness");
      set({ completeness: data.data, isLoadingCompleteness: false });
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      // Silently ignore 401 - user may not be authenticated yet
      if (err.response?.status !== 401) {
        console.error("[ProfileStore] fetchProfileCompleteness failed:", error);
      }
      set({ isLoadingCompleteness: false });
    }
  }
}));
