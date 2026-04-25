import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blogData";
import { ArrowRight, BookOpen } from "lucide-react";

export function FeaturesBlog() {
  const featuredPosts = BLOG_POSTS.slice(0, 3);

  return (
    <section className="py-24 bg-surface-low border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-text-primary mb-4">
            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Insights & Guides</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Deep dive into specific portfolio generators, or read our latest guides to landing your dream developer job.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <div className="bg-background border border-border/50 rounded-2xl p-6 hover:border-primary/50 transition-colors h-full flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                    {post.readTime}
                  </div>
                  <h4 className="text-xl font-heading font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-text-secondary mb-4 line-clamp-3">
                    {post.description}
                  </p>
                </div>
                <div className="text-primary font-semibold flex items-center mt-4">
                  Read article <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/blog" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-surface border border-border/50 text-text-primary font-medium hover:bg-surface-hover transition-colors">
            View all articles <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
