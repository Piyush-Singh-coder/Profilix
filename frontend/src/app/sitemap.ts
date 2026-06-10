import { MetadataRoute } from "next";
import { getPublishedBlogs } from "@/lib/blogApi";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://profilix.site";
  const now = new Date();

  let blogEntries: MetadataRoute.Sitemap = [];

  try {
    const posts = await getPublishedBlogs();
    blogEntries = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt || post.createdAt),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {
    blogEntries = [];
  }

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
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
      priority: 0.9,
    },
    {
      url: `${baseUrl}/student-portfolio-creator`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.88,
    },
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
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogEntries,
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
