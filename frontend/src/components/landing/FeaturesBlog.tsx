import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blogData";
import { ArrowRight, BookOpen, Layers } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export function FeaturesBlog() {
  const featuredPosts = BLOG_POSTS.slice(0, 3);

  return (
    <section className="py-24 bg-surface-low border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-text-primary mb-4">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">More Tools & Insights</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Deep dive into specific portfolio generators, or read our latest guides to landing your dream developer job.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Highlighted Feature Cards */}
          <div className="space-y-6">
            <h3 className="text-2xl font-heading font-bold text-text-primary mb-6 flex items-center">
              <Layers className="w-6 h-6 mr-3 text-primary" /> Core Features
            </h3>
            
            <Link href="/ats-resume-generator" className="group block">
              <div className="bg-surface border border-border/50 rounded-2xl p-6 hover:border-success/50 transition-colors h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success mb-4">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-heading font-bold text-text-primary mb-2 group-hover:text-success transition-colors">
                    Best ATS Resume Generator
                  </h4>
                  <p className="text-text-secondary mb-4">
                    The easiest way to generate premium, ATS-friendly resumes that bypass filters and get you hired.
                  </p>
                </div>
                <div className="text-success font-semibold flex items-center">
                  Start Generating <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            <Link href="/github-portfolio-card" className="group block">
              <div className="bg-surface border border-border/50 rounded-2xl p-6 hover:border-primary/50 transition-colors h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <FaGithub className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-heading font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                    GitHub Portfolio Card
                  </h4>
                  <p className="text-text-secondary mb-4">
                    Instantly sync your stars, commits, and repos into a stunning presentation card.
                  </p>
                </div>
                <div className="text-primary font-semibold flex items-center">
                  Try it out <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            <Link href="/qr-portfolio" className="group block">
              <div className="bg-surface border border-border/50 rounded-2xl p-6 hover:border-blue-500/50 transition-colors h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-heading font-bold text-text-primary mb-2 group-hover:text-blue-500 transition-colors">
                    QR Code Portfolio
                  </h4>
                  <p className="text-text-secondary mb-4">
                    Generate an instant smartphone-ready code for your next Hackathon or conference.
                  </p>
                </div>
                <div className="text-blue-500 font-semibold flex items-center">
                  Try it out <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>

          {/* Latest Blog Posts */}
          <div className="space-y-6">
            <h3 className="text-2xl font-heading font-bold text-text-primary mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-primary" /> Latest Guides
            </h3>
            
            <div className="grid gap-6">
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
                      <p className="text-text-secondary mb-4 line-clamp-2">
                        {post.description}
                      </p>
                    </div>
                    <div className="text-primary font-semibold flex items-center">
                      Read article <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="pt-2">
              <Link href="/blog" className="text-text-secondary hover:text-primary transition-colors inline-flex items-center font-medium">
                View all articles <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
