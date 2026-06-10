import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { absoluteUrl, getPublishedBlogs, isValidImageUrl, PaginatedBlogs } from "@/lib/blogApi";
import { BlogPost } from "@/types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Developer Career & Portfolio Blog | Profilix",
  description:
    "Actionable developer portfolio, ATS resume, QR portfolio, and career guides from Profilix.",
  keywords: [
    "developer portfolio blog",
    "ATS resume tips",
    "software engineer portfolio",
    "developer career guides",
    "QR portfolio",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Developer Career & Portfolio Blog | Profilix",
    description:
      "Actionable guides to help developers build stronger portfolios, resumes, and professional profiles.",
    url: "/blog",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Profilix Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Career & Portfolio Blog | Profilix",
    description:
      "Actionable developer portfolio, ATS resume, QR portfolio, and career guides from Profilix.",
    images: ["/og-default.png"],
  },
};

function formatDate(date: string | null) {
  if (!date) return "Draft";
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function readingTime(content?: string) {
  if (!content) return "Guide";
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const currentPage = pageStr ? parseInt(pageStr, 10) : 1;
  const limit = 6;

  let paginatedResult: PaginatedBlogs;

  try {
    paginatedResult = await getPublishedBlogs(currentPage, limit);
  } catch {
    paginatedResult = {
      posts: [],
      pagination: {
        total: 0,
        page: 1,
        limit,
        totalPages: 1,
      },
    };
  }

  const { posts, pagination } = paginatedResult;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Profilix Blog",
    description:
      "Developer portfolio, ATS resume, and career guides for software engineers.",
    url: absoluteUrl("/blog"),
    publisher: {
      "@type": "Organization",
      name: "Profilix",
      url: absoluteUrl(),
      logo: {
        "@type": "ImageObject",
        url: "https://ik.imagekit.io/v6xwevpjp/Profilix/profilix.png",
      },
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.metaDescription || post.excerpt,
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: post.publishedAt || post.createdAt,
      dateModified: post.updatedAt,
    })),
  };

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <section className="border-b border-border/50 bg-surface-low py-24">
        <div className="container mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary">
            <BookOpen className="h-4 w-4 text-primary" /> Resources
          </div>
          <h1 className="mb-6 font-heading text-4xl font-bold text-text-primary md:text-5xl">
            The Profilix Blog
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            Practical guides for building sharper portfolios, stronger resumes, and recruiter-ready developer profiles.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <div className="rounded-[var(--radius-md)] border border-dashed border-border bg-surface-low p-10 text-center">
            <h2 className="font-heading text-2xl font-bold text-text-primary">No posts published yet</h2>
            <p className="mt-3 text-text-secondary">Fresh guides will appear here as soon as they are published.</p>
          </div>
        ) : (
          <div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full">
                  <article className="group glass-panel rounded-[24px] border border-border/50 bg-surface p-5 transition-all hover:border-primary/40 hover:shadow-xl flex flex-col h-full">
                    <div className="mb-4 aspect-video w-full rounded-2xl border border-border/50 flex items-center justify-center overflow-hidden relative bg-surface-low">
                      {isValidImageUrl(post.coverImage) ? (
                        <img
                          src={post.coverImage}
                          alt={post.coverImageAlt || post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-primary/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-grow">
                      <div className="mb-2 flex items-center justify-between gap-3 text-xs text-text-secondary">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span>{readingTime(post.content)}</span>
                      </div>
                      <h3 className="mb-2 line-clamp-2 font-heading text-lg font-bold text-text-primary transition-colors group-hover:text-primary">
                        {post.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 flex-grow leading-relaxed text-sm text-text-secondary">
                        {post.excerpt}
                      </p>
                      {post.tags.length > 0 ? (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="rounded-full border border-border bg-surface-low px-2 py-0.5 text-xs text-text-secondary">
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <div className="mt-auto flex items-center text-sm font-semibold text-primary">
                        Read article <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {currentPage > 1 ? (
                  <Link
                    href={`/blog?page=${currentPage - 1}`}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="inline-flex h-10 items-center justify-center rounded-xl border border-border/40 bg-surface/50 px-4 text-sm font-medium text-text-disabled cursor-not-allowed">
                    Previous
                  </span>
                )}

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pNum) => {
                    const isCurrent = pNum === currentPage;
                    return isCurrent ? (
                      <span
                        key={pNum}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-md shadow-primary/20"
                      >
                        {pNum}
                      </span>
                    ) : (
                      <Link
                        key={pNum}
                        href={`/blog?page=${pNum}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-sm font-medium text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        {pNum}
                      </Link>
                    );
                  })}
                </div>

                {currentPage < pagination.totalPages ? (
                  <Link
                    href={`/blog?page=${currentPage + 1}`}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="inline-flex h-10 items-center justify-center rounded-xl border border-border/40 bg-surface/50 px-4 text-sm font-medium text-text-disabled cursor-not-allowed">
                    Next
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
