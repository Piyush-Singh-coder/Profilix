import { create } from "zustand";
import { api } from "@/lib/api";
import { ApiSuccessResponse } from "@/types";

type QRVariant = "STANDARD" | "LOCK_SCREEN";

interface QRPayload {
  imageUrl: string;
  cloudinaryId?: string;
}

interface QRState {
  standardQR: string | null;
  lockScreenQR: string | null;
  isLoading: boolean;
  error: string | null;

  fetchQR: (variant?: QRVariant) => Promise<void>;
}

export const useQRStore = create<QRState>((set) => ({
  standardQR: null,
  lockScreenQR: null,
  isLoading: false,
  error: null,

  fetchQR: async (variant = "STANDARD") => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.get<ApiSuccessResponse<QRPayload>>(`/qr?variant=${variant}`);
      if (variant === "STANDARD") {
        set({ standardQR: data.data.imageUrl, isLoading: false });
      } else {
        set({ lockScreenQR: data.data.imageUrl, isLoading: false });
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to fetch QR code", isLoading: false });
    }
  }
}));
