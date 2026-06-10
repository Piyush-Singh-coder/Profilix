"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  BookOpen,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { ApiSuccessResponse, BlogPost, BlogStatus, User } from "@/types";

interface BlogForm {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverImageAlt: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  tags: string;
  status: BlogStatus;
}

const emptyForm: BlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  coverImageAlt: "",
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  tags: "",
  status: "DRAFT",
};

const isAdminUser = (user: User | null) =>
  user?.username === "pmiaynushi" || user?.email === "pmiaynushi@gmail.com";

const getErrorMessage = (error: unknown, fallback: string) => {
  const maybeError = error as {
    response?: { data?: { error?: string; message?: string } };
  };
  return maybeError.response?.data?.error || maybeError.response?.data?.message || fallback;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const listToCsv = (items: string[]) => items.join(", ");

const csvToList = (value: string) =>
  Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );

const formFromPost = (post: BlogPost): BlogForm => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  content: post.content || "",
  coverImage: post.coverImage || "",
  coverImageAlt: post.coverImageAlt || "",
  metaTitle: post.metaTitle || "",
  metaDescription: post.metaDescription || "",
  keywords: listToCsv(post.keywords),
  tags: listToCsv(post.tags),
  status: post.status,
});

export default function BlogAdminPage() {
  const { user } = useAuthStore();
  const canManageBlogs = isAdminUser(user);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [query, setQuery] = useState("");

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === form.id),
    [form.id, posts]
  );

  const filteredPosts = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return posts;
    return posts.filter((post) =>
      [post.title, post.slug, post.excerpt, ...post.tags].some((value) =>
        value.toLowerCase().includes(search)
      )
    );
  }, [posts, query]);

  const seoScore = useMemo(() => {
    let score = 0;
    if (form.slug.length >= 8 && form.slug.length <= 80) score += 20;
    if (form.metaTitle.length >= 35 && form.metaTitle.length <= 65) score += 20;
    if (form.metaDescription.length >= 120 && form.metaDescription.length <= 160) score += 20;
    if (csvToList(form.keywords).length >= 3) score += 15;
    if (form.excerpt.length >= 80 && form.excerpt.length <= 220) score += 15;
    if (!form.coverImage || form.coverImageAlt.length >= 20) score += 10;
    return score;
  }, [form]);

  const fetchPosts = useCallback(async () => {
    if (!canManageBlogs) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await api.get<ApiSuccessResponse<BlogPost[]>>("/blogs/admin/all");
      setPosts(data.data);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to load blog posts"));
    } finally {
      setIsLoading(false);
    }
  }, [canManageBlogs]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const updateForm = (patch: Partial<BlogForm>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const handleTitleChange = (title: string) => {
    setForm((current) => ({
      ...current,
      title,
      slug: current.id ? current.slug : slugify(title),
      metaTitle: current.metaTitle || title.slice(0, 70),
    }));
  };

  const startNewPost = () => {
    setForm(emptyForm);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      title: form.title,
      slug: slugify(form.slug || form.title),
      excerpt: form.excerpt,
      content: form.content,
      coverImage: form.coverImage,
      coverImageAlt: form.coverImageAlt,
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
      keywords: csvToList(form.keywords),
      tags: csvToList(form.tags),
      status: form.status,
    };

    try {
      setIsSaving(true);
      const request = form.id
        ? api.put<ApiSuccessResponse<BlogPost>>(`/blogs/${form.id}`, payload)
        : api.post<ApiSuccessResponse<BlogPost>>("/blogs", payload);
      const { data } = await request;
      toast.success(form.id ? "Blog post updated" : "Blog post created");
      setForm(formFromPost(data.data));
      await fetchPosts();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to save blog post"));
    } finally {
      setIsSaving(false);
    }
  };

  const setStatus = async (post: BlogPost, status: BlogStatus) => {
    try {
      const { data } = await api.patch<ApiSuccessResponse<BlogPost>>(`/blogs/${post.id}/status`, {
        status,
      });
      toast.success(status === "PUBLISHED" ? "Blog post published" : "Blog post moved to draft");
      setPosts((current) => current.map((item) => (item.id === post.id ? data.data : item)));
      if (form.id === post.id) setForm(formFromPost(data.data));
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to update status"));
    }
  };

  const deletePost = async (post: BlogPost) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;

    try {
      await api.delete(`/blogs/${post.id}`);
      toast.success("Blog post deleted");
      setPosts((current) => current.filter((item) => item.id !== post.id));
      if (form.id === post.id) startNewPost();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to delete blog post"));
    }
  };

  if (!canManageBlogs) {
    return (
      <div className="animate-in space-y-6 pb-24">
        <DashboardHeader
          title="Blog Admin"
          subtitle="This workspace is restricted to the Profilix blog admin account."
          badge="Restricted"
          icon={BookOpen}
        />
        <div className="rounded-[var(--radius-md)] border border-danger/30 bg-danger/10 p-6 text-sm text-danger">
          You are signed in, but this account cannot manage blog posts.
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in space-y-8 pb-24">
      <DashboardHeader
        title="Blog Admin"
        subtitle="Write, optimize, publish, and maintain SEO-ready Profilix blog posts from one focused editor."
        badge="Content Studio"
        icon={BookOpen}
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search posts"
                className="h-11 w-full rounded-[var(--radius-md)] border border-border bg-surface-low pl-9 pr-3 text-sm text-text-primary outline-none transition-colors focus:border-primary/60"
              />
            </div>
            <Button type="button" size="icon" variant="secondary" onClick={startNewPost} title="New post">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <div className="flex h-32 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface-low">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="rounded-[var(--radius-md)] border border-dashed border-border bg-surface-low p-5 text-sm text-text-secondary">
                No posts found.
              </div>
            ) : (
              filteredPosts.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => setForm(formFromPost(post))}
                  className={cn(
                    "w-full rounded-[var(--radius-md)] border p-4 text-left transition-colors",
                    form.id === post.id
                      ? "border-primary/50 bg-primary/10"
                      : "border-border bg-surface-low hover:border-primary/30"
                  )}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Badge
                      className={cn(
                        post.status === "PUBLISHED"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                      )}
                    >
                      {post.status.toLowerCase()}
                    </Badge>
                    <span className="text-xs text-text-secondary">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="line-clamp-2 text-sm font-semibold text-text-primary">{post.title}</h2>
                  <p className="mt-1 line-clamp-1 text-xs text-text-secondary">/{post.slug}</p>
                </button>
              ))
            )}
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="min-w-0 space-y-6">
          <section className="rounded-[var(--radius-md)] border border-border bg-surface p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-xl font-bold text-text-primary">
                  {form.id ? "Edit Post" : "New Post"}
                </h2>
                <p className="text-sm text-text-secondary">Core article content and publishing state.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {selectedPost?.status === "PUBLISHED" ? (
                  <Link
                    href={`/blog/${selectedPost.slug}`}
                    target="_blank"
                    className="inline-flex h-9 items-center gap-2 rounded-[var(--radius-sm)] border border-border px-3 text-sm text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <ExternalLink className="h-4 w-4" /> View
                  </Link>
                ) : null}
                {selectedPost ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setStatus(selectedPost, selectedPost.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED")
                    }
                  >
                    {selectedPost.status === "PUBLISHED" ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                    {selectedPost.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                  </Button>
                ) : null}
                <Button type="submit" size="sm" isLoading={isSaving}>
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Title"
                value={form.title}
                onChange={(event) => handleTitleChange(event.target.value)}
                maxLength={180}
                required
              />
              <Input
                label="Slug"
                value={form.slug}
                onChange={(event) => updateForm({ slug: slugify(event.target.value) })}
                helperText="Lowercase URL path for the article."
                required
              />
            </div>

            <div className="mt-4">
              <Textarea
                label="Excerpt"
                value={form.excerpt}
                onChange={(event) => updateForm({ excerpt: event.target.value })}
                rows={3}
                maxLength={320}
                required
                helperText={`${form.excerpt.length}/320 characters`}
              />
            </div>

            <div className="mt-4">
              <Textarea
                label="Markdown content"
                value={form.content}
                onChange={(event) => updateForm({ content: event.target.value })}
                rows={18}
                required
                className="font-mono text-sm leading-6"
                helperText="Use H2/H3 sections, internal links, concise paragraphs, and descriptive anchor text."
              />
            </div>
          </section>

          <section className="rounded-[var(--radius-md)] border border-border bg-surface p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-xl font-bold text-text-primary">SEO</h2>
                <p className="text-sm text-text-secondary">Metadata used for Google, social previews, sitemap, and structured data.</p>
              </div>
              <Badge className={cn(
                seoScore >= 80
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-400"
              )}>
                SEO {seoScore}/100
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Meta title"
                value={form.metaTitle}
                onChange={(event) => updateForm({ metaTitle: event.target.value })}
                maxLength={70}
                helperText={`${form.metaTitle.length}/70 characters`}
              />
              <Input
                label="Cover image URL"
                value={form.coverImage}
                onChange={(event) => updateForm({ coverImage: event.target.value })}
                placeholder="https://..."
              />
              <Textarea
                label="Meta description"
                value={form.metaDescription}
                onChange={(event) => updateForm({ metaDescription: event.target.value })}
                rows={3}
                maxLength={170}
                helperText={`${form.metaDescription.length}/170 characters`}
              />
              <Textarea
                label="Cover image alt text"
                value={form.coverImageAlt}
                onChange={(event) => updateForm({ coverImageAlt: event.target.value })}
                rows={3}
                maxLength={160}
                helperText={`${form.coverImageAlt.length}/160 characters`}
              />
              <Input
                label="Keywords"
                value={form.keywords}
                onChange={(event) => updateForm({ keywords: event.target.value })}
                helperText="Comma-separated search phrases."
              />
              <Input
                label="Tags"
                value={form.tags}
                onChange={(event) => updateForm({ tags: event.target.value })}
                helperText="Comma-separated visible article tags."
              />
            </div>
          </section>

          {selectedPost ? (
            <div className="flex justify-end">
              <Button type="button" variant="danger" size="sm" onClick={() => deletePost(selectedPost)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Post
              </Button>
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}
