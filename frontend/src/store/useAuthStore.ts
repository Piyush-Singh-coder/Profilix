import { create } from "zustand";
import { api } from "@/lib/api";
import { ApiSuccessResponse, User, ProfileTheme } from "@/types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  fullName: string;
  email: string;
  username: string;
  password: string;
}

interface VerifyResponse {
  success: boolean;
  message: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<VerifyResponse>;
  verifyEmail: (token: string) => Promise<VerifyResponse>;
  googleLogin: (idToken: string) => Promise<void>;
  githubLogin: (idToken: string) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  updateSelectedTheme: (theme: ProfileTheme) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

  updateSelectedTheme: (theme) => {
    const user = get().user;
    if (user) {
      set({ user: { ...user, selectedTheme: theme } });
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.get<ApiSuccessResponse<User>>("/auth/profile");
      set({ user: data.data, isAuthenticated: true, isLoading: false });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ user: null, isAuthenticated: false, isLoading: false, error: err.response?.data?.message || null });
    }
  },

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.post<ApiSuccessResponse<User>>("/auth/login", credentials);
      set({ user: data.data, isAuthenticated: true, isLoading: false });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Login failed", isLoading: false });
      throw error;
    }
  },

  register: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.post<ApiSuccessResponse<User>>("/auth/register", credentials);
      set({ isLoading: false });
      return { success: data.success, message: data.message || "Registration successful" };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Registration failed", isLoading: false });
      throw error;
    }
  },
  
  verifyEmail: async (token: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.post<ApiSuccessResponse<null>>("/auth/verify", { token });
      set({ isLoading: false });
      return { success: data.success, message: data.message || "Email verified" };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Verification failed", isLoading: false });
      throw error;
    }
  },

  googleLogin: async (idToken: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.post<ApiSuccessResponse<User>>("/auth/google-login", { idToken });
      set({ user: data.data, isAuthenticated: true, isLoading: false });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Google login failed", isLoading: false });
      throw error;
    }
  },
  
  githubLogin: async (idToken: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.post<ApiSuccessResponse<User>>("/auth/github-login", { idToken });
      set({ user: data.data, isAuthenticated: true, isLoading: false });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "GitHub login failed", isLoading: false });
      throw error;
    }
  },

  uploadAvatar: async (file: File) => {
    try {
      set({ isLoading: true, error: null });
      const formData = new FormData();
      formData.append("avatar", file);

      const { data } = await api.post<{ success: boolean; data: { avatarUrl: string } }>(
        "/profile/avatar",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const currentUser = get().user;
      if (currentUser) {
        set({ user: { ...currentUser, avatarUrl: data.data.avatarUrl }, isLoading: false });
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to upload avatar", isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("Logout failed", error);
    }
  },
}));
