import { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blogData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://profilix.site";
  const now = new Date();

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    // ── Core / Homepage ─────────────────────────────────────────
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },

    // ── Primary Product Pages (highest-value) ────────────────────
    {
      url: `${baseUrl}/ats-resume-generator`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.98,
    },
    {
      url: `${baseUrl}/github-portfolio-card`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.92,
    },
    {
      url: `${baseUrl}/qr-portfolio`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.90,
    },
    {
      url: `${baseUrl}/student-portfolio-creator`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.88,
    },

    // ── Feature Pages ────────────────────────────────────────────
    {
      url: `${baseUrl}/features`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/features/profile-cards`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.83,
    },
    {
      url: `${baseUrl}/features/qr-code`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.83,
    },
    {
      url: `${baseUrl}/features/templates`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.82,
    },
    {
      url: `${baseUrl}/features/analytics`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.78,
    },

    // ── Content ──────────────────────────────────────────────────
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.80,
    },
    ...blogEntries,

    // ── Static Pages ─────────────────────────────────────────────
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.30,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.20,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.20,
    },
  ];
}
