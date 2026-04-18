import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BLOG_POSTS } from "@/lib/blogData";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Developer Career & Portfolio Blog",
  description: "Read the latest guides on how to build a winning developer portfolio, pass tech interviews, and share your resume.",
  keywords: ["developer portfolio blog", "tech interview tips", "resume formats", "software engineer career"],
};

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <Navbar />
      
      {/* Header */}
      <section className="py-24 bg-surface-low border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border text-sm text-text-secondary mb-6 font-medium">
            <BookOpen className="w-4 h-4 text-primary" /> Resources
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary mb-6">
            The Profilix Blog
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Insights, guides, and best practices to help developers build better portfolios and stand out in the tech industry.
          </p>
        </div>
      </section>

      {/* Blog List */}
      <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full">
              <article className="flex flex-col h-full bg-surface border border-border/50 rounded-2xl p-6 hover:border-primary/50 transition-colors">
                <div className="text-sm text-text-secondary mb-4 flex items-center justify-between">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-xl font-heading font-bold text-text-primary mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-text-secondary leading-relaxed mb-6 line-clamp-3 flex-grow">
                  {post.description}
                </p>
                <div className="text-primary text-sm font-semibold flex items-center mt-auto">
                  Read article <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
