import { create } from "zustand";
import { api } from "@/lib/api";
import { ApiSuccessResponse, Project } from "@/types";

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  fetchProjects: () => Promise<void>;
  createProject: (project: Partial<Project>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  reorderProjects: (orderedIds: string[]) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  isLoading: false,
  isSaving: false,
  error: null,

  fetchProjects: async () => {
    // Guard: skip if already fetching
    if (get().isLoading) return;
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.get<ApiSuccessResponse<Project[]>>("/projects");
      set({ projects: data.data, isLoading: false });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to fetch projects", isLoading: false });
    }
  },

  createProject: async (project) => {
    try {
      set({ isSaving: true, error: null });
      const { data } = await api.post<ApiSuccessResponse<Project>>("/projects", project);
      set({ projects: [...get().projects, data.data], isSaving: false });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to create project", isSaving: false });
      throw error;
    }
  },

  updateProject: async (id, updates) => {
    try {
      set({ isSaving: true, error: null });
      const { data } = await api.put<ApiSuccessResponse<Project>>(`/projects/${id}`, updates);
      set({ 
        projects: get().projects.map(p => p.id === id ? data.data : p), 
        isSaving: false 
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to update project", isSaving: false });
      throw error;
    }
  },

  togglePin: async (id) => {
    try {
      set({ isSaving: true, error: null });
      const { data } = await api.patch<ApiSuccessResponse<Project>>(`/projects/${id}/pin`);
      set({
        projects: get()
          .projects
          .map((p) => (p.id === id ? data.data : p))
          .sort((a, b) => (Number(b.isPinned) - Number(a.isPinned)) || a.displayOrder - b.displayOrder),
        isSaving: false,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to toggle pin", isSaving: false });
      throw error;
    }
  },

  deleteProject: async (id) => {
    try {
      set({ isSaving: true, error: null });
      await api.delete(`/projects/${id}`);
      set({ 
        projects: get().projects.filter(p => p.id !== id), 
        isSaving: false 
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ error: err.response?.data?.message || "Failed to delete project", isSaving: false });
      throw error;
    }
  },

  reorderProjects: async (orderedIds) => {
    const originalOrder = [...get().projects];
    
    const newOrder = [...originalOrder].sort((a, b) => {
      return orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id);
    });
    
    set({
      projects: newOrder.map((project, index) => ({
        ...project,
        displayOrder: index,
      })),
    });

    try {
      set({ isSaving: true, error: null });
      await api.put("/projects/reorder", {
        projects: orderedIds.map((id, index) => ({ id, displayOrder: index })),
      });
      set({ isSaving: false });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({ projects: originalOrder, error: err.response?.data?.message || "Failed to reorder projects", isSaving: false });
      throw error;
    }
  }
}));
