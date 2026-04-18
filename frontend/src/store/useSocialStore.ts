import { create } from "zustand";
import { api } from "@/lib/api";
import { ApiSuccessResponse, SocialLink, SocialPlatform } from "@/types";

interface SocialState {
  links: SocialLink[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  fetchLinks: () => Promise<void>;
  saveLink: (payload: {
    platform: SocialPlatform;
    url: string;
    visibleInDefault?: boolean;
    visibleInRecruiter?: boolean;
  }) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
}

export const useSocialStore = create<SocialState>((set, get) => ({
  links: [],
  isLoading: false,
  isSaving: false,
  error: null,

  fetchLinks: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.get<ApiSuccessResponse<SocialLink[]>>("/social-links");
      set({ links: data.data, isLoading: false });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to fetch social links", isLoading: false });
    }
  },

  saveLink: async (payload) => {
    try {
      set({ isSaving: true, error: null });
      const existing = get().links.find((l) => l.platform === payload.platform);

      const requestData = {
        platform: payload.platform,
        url: payload.url,
        visibleInDefault: payload.visibleInDefault ?? true,
        visibleInRecruiter: payload.visibleInRecruiter ?? true,
      };

      const { data } = existing
        ? await api.put<ApiSuccessResponse<SocialLink>>(`/social-links/${existing.id}`, requestData)
        : await api.post<ApiSuccessResponse<SocialLink>>("/social-links", requestData);

      const newLinks = [...get().links];
      const existingIdx = newLinks.findIndex((l) => l.platform === data.data.platform);
      
      if (existingIdx >= 0) {
        newLinks[existingIdx] = data.data;
      } else {
        newLinks.push(data.data);
      }
      
      set({ links: newLinks, isSaving: false });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to save social link", isSaving: false });
      throw error;
    }
  },

  deleteLink: async (id) => {
    try {
      set({ isSaving: true, error: null });
      await api.delete(`/social-links/${id}`);
      set({ 
        links: get().links.filter(l => l.id !== id), 
        isSaving: false 
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to delete social link", isSaving: false });
      throw error;
    }
  }
}));
