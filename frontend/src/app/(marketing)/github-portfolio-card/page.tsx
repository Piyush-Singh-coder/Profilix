import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTABanner } from "@/components/landing/CTABanner";
import { Zap, RefreshCw } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "GitHub Portfolio Card Generator – Showcase Your GitHub Stats Instantly",
  description:
    "Create a beautiful GitHub portfolio card instantly. Sync your repos, stars, contribution graph, and top languages without touching a single line of code. Free for developers.",
  keywords: [
    "github portfolio card generator",
    "github profile card",
    "github stats card",
    "developer portfolio card",
    "github contribution graph card",
    "github portfolio website",
    "github readme card generator",
  ],
  alternates: { canonical: "/github-portfolio-card" },
  openGraph: {
    title: "GitHub Portfolio Card Generator – Showcase Your GitHub Stats Instantly",
    description:
      "Sync your GitHub repos, stars, and contribution graph into a beautiful shareable portfolio card. Free for all developers.",
    url: "/github-portfolio-card",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "GitHub Portfolio Card Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GitHub Portfolio Card Generator",
    description: "Sync your GitHub stats into a beautiful shareable portfolio card.",
    images: ["/og-default.png"],
  },
};

export default function GithubPortfolioCardPage() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <Navbar />
      
      {/* Hero */}
      <section className="py-24 bg-surface-low border-b border-border/50 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border text-sm text-text-secondary mb-6 font-medium">
            <FaGithub className="w-4 h-4" /> Seamless GitHub Integration
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-text-primary mb-6 leading-tight">
            The Ultimate <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              GitHub Portfolio Card Generator
            </span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop manually updating your README and LinkTree. Connect your GitHub account and instantly generate a dynamic, shareable profile card that updates automatically as you code.
          </p>
          <div className="flex justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg">
                <FaGithub className="w-5 h-5 mr-2" /> Connect GitHub
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center group">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-3 text-text-primary">Zero Setup</h3>
            <p className="text-text-secondary">No dragging components or writing CSS. Authorize GitHub, and we handle pulling your top pinned repositories and languages automatically.</p>
          </div>
          
          <div className="text-center group">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
              <RefreshCw className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-3 text-text-primary">Real-Time Sync</h3>
            <p className="text-text-secondary">Your 26-week contribution graph and total star counts sync directly onto your card so recruiters always see your most active work.</p>
          </div>

          <div className="text-center group">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform">
              <FaGithub className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-3 text-text-primary">Multiple Themes</h3>
            <p className="text-text-secondary">Choose between Glassmorphism, Brutalism, or Apple Minimal styles to make your GitHub stats pop the way you want them to.</p>
          </div>
        </div>
      </section>

      <CTABanner />
      <Footer />
    </main>
  );
}
