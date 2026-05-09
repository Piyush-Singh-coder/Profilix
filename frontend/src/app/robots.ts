import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://profilix.site";

  return {
    rules: [
      {
        // Standard search engines and AI crawlers: full access to public content
        userAgent: [
          "*",
          "GPTBot",          // ChatGPT / OpenAI
          "Google-Extended",  // Gemini / Google AI
          "anthropic-ai",    // Claude
          "Claude-Web",      // Claude
          "PerplexityBot",   // Perplexity AI
          "Applebot",
          "cohere-ai",
          "facebookexternalhit",
          "LinkedInBot",
        ],
        allow: [
          "/",
          "/ats-resume-generator",
          "/github-portfolio-card",
          "/qr-portfolio",
          "/student-portfolio-creator",
          "/features",
          "/features/profile-cards",
          "/features/qr-code",
          "/features/templates",
          "/blog",
          "/blog/",
          "/contact",
          "/about",
          "/llms.txt",
        ],
        disallow: [
          "/dashboard/",
          "/api/",
          "/login",
          "/register",
          "/verify",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
