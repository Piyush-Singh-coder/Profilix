import { create } from "zustand";
import { api } from "@/lib/api";
import { AnalyticsEventType, ApiSuccessResponse } from "@/types";

export interface AnalyticsSummary {
  event: AnalyticsEventType;
  count: number;
}

export interface AnalyticsEvent {
  eventType: AnalyticsEventType;
  referrer: string | null;
  timestamp: string;
  metadata: Record<string, unknown> | null;
}

interface AnalyticsState {
  summary: AnalyticsSummary[];
  recentEvents: AnalyticsEvent[];
  isLoading: boolean;
  error: string | null;

  fetchAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  summary: [],
  recentEvents: [],
  isLoading: false,
  error: null,

  fetchAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const [summaryRes, recentRes] = await Promise.all([
        api.get<ApiSuccessResponse<AnalyticsSummary[]>>("/analytics/summary"),
        api.get<ApiSuccessResponse<AnalyticsEvent[]>>("/analytics/recent"),
      ]);
      
      set({
        summary: summaryRes.data.data || [],
        recentEvents: recentRes.data.data || [],
        isLoading: false,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string; message?: string } } };
      set({
        error: err.response?.data?.error || err.response?.data?.message || "Failed to fetch analytics",
        isLoading: false,
      });
    }
  },
}));
