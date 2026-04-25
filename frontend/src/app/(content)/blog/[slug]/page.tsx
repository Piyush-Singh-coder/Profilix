import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_POSTS } from "@/lib/blogData";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTABanner } from "@/components/landing/CTABanner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const ogUrl = `/og-default.png`;
  const canonicalUrl = `/blog/${slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: post.title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .split(" ")
      .filter((w) => w.length > 3)
      .slice(0, 8),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: canonicalUrl,
      publishedTime: new Date(post.date).toISOString(),
      images: [{ url: ogUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogUrl],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const canonicalUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://profilix.site"}/blog/${slug}`;
  const ogUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://profilix.site"}/og-default.png`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: ogUrl,
    datePublished: new Date(post.date).toISOString(),
    author: {
      "@type": "Organization",
      name: "Profilix",
      url: process.env.NEXT_PUBLIC_APP_URL || "https://profilix.site",
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

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <article className="relative py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Background Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />

        <Link href="/blog" className="inline-flex items-center text-text-secondary hover:text-primary transition-colors mb-12 text-sm font-medium group">
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> Back to Blog
        </Link>
        
        <header className="mb-16 border-b border-border/50 pb-12">
          <div className="flex items-center gap-4 text-sm font-semibold uppercase tracking-wider text-primary mb-6">
            <span>{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>{post.readTime}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-text-primary mb-8 leading-[1.1]">
            {post.title}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-2xl">
            {post.description}
          </p>
        </header>

        <div className="text-lg leading-[1.8] text-text-secondary w-full max-w-none">
          <ReactMarkdown
            components={{
              h2: ({ node, ...props }) => <h2 className="text-3xl font-heading font-bold text-text-primary mt-16 mb-8" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-2xl font-heading font-bold text-text-primary mt-12 mb-6" {...props} />,
              p: ({ node, ...props }) => <p className="mb-8 last:mb-0" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-8 space-y-3" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-8 space-y-3" {...props} />,
              li: ({ node, ...props }) => <li className="text-text-secondary pl-2" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-bold text-text-primary" {...props} />,
              a: ({ node, ...props }) => <a className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4 decoration-primary/30 hover:decoration-primary font-medium" {...props} />,
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-primary bg-primary/5 pl-8 py-6 pr-6 my-12 rounded-r-2xl italic text-text-primary text-xl" {...props} />
              ),
              code: ({ node, inline, ...props }: any) => 
                inline ? (
                  <code className="bg-surface-high px-1.5 py-0.5 rounded text-primary text-sm font-mono" {...props} />
                ) : (
                  <code className="block bg-surface-high p-6 rounded-xl text-text-primary text-sm font-mono my-8 overflow-x-auto border border-border/50" {...props} />
                ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      <CTABanner />
      <Footer />
    </main>
  );
}
