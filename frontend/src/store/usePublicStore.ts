import { create } from "zustand";
import { api } from "@/lib/api";
import { ApiSuccessResponse, PublicProfileData } from "@/types";

interface PublicState {
  publicProfile: PublicProfileData | null;
  isLoading: boolean;
  error: string | null;

  setPublicProfile: (profile: PublicProfileData | null) => void;
  fetchPublicProfile: (username: string, mode?: string) => Promise<void>;
  trackEvent: (username: string, eventType: string, metadata?: Record<string, unknown>) => Promise<void>;
  getOGImageUrl: (username: string) => string;
}

export const usePublicStore = create<PublicState>((set) => ({
  publicProfile: null,
  isLoading: false,
  error: null,

  setPublicProfile: (profile) => set({ publicProfile: profile }),

  fetchPublicProfile: async (username, mode) => {
    try {
      set({ isLoading: true, error: null });
      const query = mode ? `?mode=${mode}` : "";
      const { data } = await api.get<ApiSuccessResponse<PublicProfileData>>(`/u/${username}${query}`);
      set({ publicProfile: data.data, isLoading: false });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to load public profile", isLoading: false });
    }
  },

  trackEvent: async () => {
    try {
      // Profile views are currently auto-tracked by the backend public profile endpoint.
    } catch (error) {
      console.error("Failed to track event:", error);
    }
  },

  getOGImageUrl: (username) => {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/u/${username}/og`;
  }
}));
