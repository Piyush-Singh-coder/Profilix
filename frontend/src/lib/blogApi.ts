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

export const getPublishedBlogs = () => fetchJson<BlogPost[]>("/blogs");

export const getPublishedBlogBySlug = (slug: string) =>
  fetchJson<BlogPost>(`/blogs/${encodeURIComponent(slug)}`);

export const absoluteUrl = (path = "") => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://profilix.site";
  return `${baseUrl}${path}`;
};
