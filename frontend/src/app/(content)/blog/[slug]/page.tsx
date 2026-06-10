import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTABanner } from "@/components/landing/CTABanner";
import { absoluteUrl, getPublishedBlogBySlug, getPublishedBlogs, isValidImageUrl } from "@/lib/blogApi";
import { BlogPost } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300;

function formatDate(date: string | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

const withoutMarkdownNode = <T extends { node?: unknown }>(props: T) => {
  const { node, ...rest } = props;
  void node;
  return rest;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPublishedBlogBySlug(slug);
    const canonicalUrl = `/blog/${post.slug}`;
    const image = post.coverImage || "/og-default.png";
    const title = post.metaTitle || post.title;
    const description = post.metaDescription || post.excerpt;

    return {
      title,
      description,
      keywords: post.keywords.length > 0 ? post.keywords : post.tags,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title,
        description,
        type: "article",
        url: canonicalUrl,
        publishedTime: post.publishedAt || post.createdAt,
        modifiedTime: post.updatedAt,
        tags: post.tags,
        images: [{ url: image, width: 1200, height: 630, alt: post.coverImageAlt || post.title }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch {
    return {
      title: "Post Not Found",
      robots: { index: false, follow: false },
    };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  let post;
  let allPosts: BlogPost[] = [];

  try {
    post = await getPublishedBlogBySlug(slug);
  } catch {
    notFound();
  }

  try {
    allPosts = await getPublishedBlogs();
  } catch {
    allPosts = [];
  }

  const recentPosts = allPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 4);

  const canonicalUrl = absoluteUrl(`/blog/${post.slug}`);
  const image = post.coverImage || absoluteUrl("/og-default.png");
  const description = post.metaDescription || post.excerpt;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description,
    image,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    keywords: post.keywords.join(", "),
    author: {
      "@type": "Organization",
      name: "Profilix",
      url: absoluteUrl(),
    },
    publisher: {
      "@type": "Organization",
      name: "Profilix",
      logo: {
        "@type": "ImageObject",
        url: "https://ik.imagekit.io/v6xwevpjp/Profilix/profilix.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: absoluteUrl("/blog"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-full -translate-x-1/2 bg-gradient-to-b from-primary/5 to-transparent" />

        <Link href="/blog" className="group mb-8 inline-flex items-center text-sm font-medium text-text-secondary transition-colors hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Blog
        </Link>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Article Content */}
          <article className="lg:col-span-8 bg-surface border border-border/50 rounded-[24px] p-6 sm:p-8 shadow-sm">
            <header className="mb-8 border-b border-border/50 pb-6">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-primary">
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span>{readingTime(post.content || "")}</span>
              </div>
              <h1 className="mb-4 font-heading text-3xl font-bold leading-[1.2] text-text-primary md:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-text-secondary">
                {post.excerpt}
              </p>
              {post.tags.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-border bg-surface-low px-2.5 py-0.5 text-xs font-medium text-text-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </header>

            {isValidImageUrl(post.coverImage) ? (
              <div className="mb-8 aspect-video w-full overflow-hidden rounded-2xl border border-border/50 bg-surface-low relative">
                <img
                  src={post.coverImage}
                  alt={post.coverImageAlt || post.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}

            <div className="w-full max-w-none text-base leading-[1.6] text-text-secondary">
              <ReactMarkdown
                components={{
                  h2: (props) => <h2 className="mb-4 mt-10 font-heading text-2xl font-bold text-text-primary" {...withoutMarkdownNode(props)} />,
                  h3: (props) => <h3 className="mb-3 mt-8 font-heading text-xl font-bold text-text-primary" {...withoutMarkdownNode(props)} />,
                  p: (props) => <p className="mb-4 last:mb-0" {...withoutMarkdownNode(props)} />,
                  ul: (props) => <ul className="mb-4 list-disc space-y-2 pl-6" {...withoutMarkdownNode(props)} />,
                  ol: (props) => <ol className="mb-4 list-decimal space-y-2 pl-6" {...withoutMarkdownNode(props)} />,
                  li: (props) => <li className="pl-2 text-text-secondary" {...withoutMarkdownNode(props)} />,
                  strong: (props) => <strong className="font-bold text-text-primary" {...withoutMarkdownNode(props)} />,
                  a: (props) => <a className="font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary/80 hover:decoration-primary" {...withoutMarkdownNode(props)} />,
                  blockquote: (props) => (
                    <blockquote className="my-8 rounded-r-[var(--radius-md)] border-l-4 border-primary bg-primary/5 py-4 pl-6 pr-4 text-lg italic text-text-primary" {...withoutMarkdownNode(props)} />
                  ),
                  code: (props) => (
                    <code className="rounded bg-surface-high px-1.5 py-0.5 font-mono text-sm text-primary" {...withoutMarkdownNode(props)} />
                  ),
                  pre: (props) => (
                    <pre className="my-8 overflow-x-auto rounded-[var(--radius-md)] border border-border/50 bg-surface-high p-6 font-mono text-sm text-text-primary" {...withoutMarkdownNode(props)} />
                  ),
                }}
              >
                {post.content || ""}
              </ReactMarkdown>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
            {/* Search Widget */}
            <div className="bg-surface border border-border/50 rounded-[20px] p-5 shadow-sm">
              <h4 className="font-heading font-bold text-sm text-text-primary mb-3">Search</h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full h-10 px-3 pr-10 rounded-xl border border-border bg-surface-low text-sm outline-none focus:border-primary/60 text-text-primary"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </span>
              </div>
            </div>

            {/* Recent Posts Widget */}
            <div className="bg-surface border border-border/50 rounded-[20px] p-5 shadow-sm">
              <h4 className="font-heading font-bold text-sm text-text-primary mb-4 border-b border-border/50 pb-2">Recent Posts</h4>
              <div className="space-y-4">
                {recentPosts.length === 0 ? (
                  <p className="text-xs text-text-secondary">No other posts found.</p>
                ) : (
                  recentPosts.map((rPost) => (
                    <Link key={rPost.slug} href={`/blog/${rPost.slug}`} className="group flex gap-3 items-center">
                      <div className="hidden sm:block w-20 h-14 rounded-lg border border-border/50 overflow-hidden shrink-0 bg-surface-low relative">
                        {isValidImageUrl(rPost.coverImage) ? (
                          <img
                            src={rPost.coverImage}
                            alt={rPost.coverImageAlt || rPost.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-primary/40" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {rPost.title}
                        </h5>
                        <span className="text-xs text-text-secondary block mt-1">
                          {formatDate(rPost.publishedAt || rPost.createdAt)}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <CTABanner />
      <Footer />
    </main>
  );
}
