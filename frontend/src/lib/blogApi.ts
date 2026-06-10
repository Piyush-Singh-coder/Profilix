import { API_BASE_URL } from "@/lib/api";
import { ApiSuccessResponse, BlogPost } from "@/types";

const fetchJson = async <T>(path: string): Promise<T> => {
  const isDev = process.env.NODE_ENV === "development";
  const response = await fetch(`${API_BASE_URL}${path}`, {
    next: isDev ? { revalidate: 0 } : { revalidate: 300 },
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Blog request failed: ${response.status}`);
  }

  const payload = (await response.json()) as ApiSuccessResponse<T>;
  return payload.data;
};

export interface PaginatedBlogs {
  posts: BlogPost[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function getPublishedBlogs(): Promise<BlogPost[]>;
export function getPublishedBlogs(page: number, limit: number): Promise<PaginatedBlogs>;
export function getPublishedBlogs(page?: number, limit?: number): Promise<BlogPost[] | PaginatedBlogs> {
  if (page !== undefined && limit !== undefined) {
    return fetchJson<PaginatedBlogs>(`/blogs?page=${page}&limit=${limit}`);
  }
  return fetchJson<BlogPost[]>("/blogs");
}

export const getPublishedBlogBySlug = (slug: string) =>
  fetchJson<BlogPost>(`/blogs/${encodeURIComponent(slug)}`);

export const absoluteUrl = (path = "") => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://profilix.site";
  return `${baseUrl}${path}`;
};

export const isValidImageUrl = (url: string | null | undefined): url is string => {
  if (!url) return false;
  const u = url.trim().toLowerCase();
  if (u === "" || u === "null" || u === "undefined") return false;
  return u.startsWith("http://") || u.startsWith("https://") || u.startsWith("/");
};
