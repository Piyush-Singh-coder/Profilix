import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTABanner } from "@/components/landing/CTABanner";
import { Sparkles, ArrowRight, GitBranch, Terminal, Shield, RefreshCw, BarChart3 } from "lucide-react";
import { FaGithub, FaStar, FaCodeFork } from "react-icons/fa6";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "GitHub Sync & Developer Profile Integration | Profilix",
  description: "Sync your GitHub profile in one click to dynamically showcase your public contributions, repositories, star counts, and top languages in a professional card.",
  keywords: [
    "GitHub portfolio sync", 
    "developer portfolio generator", 
    "showcase GitHub repositories", 
    "GitHub contribution graph", 
    "GitHub stats card", 
    "portfolio builder for developers"
  ],
  alternates: { canonical: "/features/github-sync" },
};

const SYNC_METRICS = [
  {
    name: "Contribution Heatmap",
    description: "Display your 26-week public contribution grid dynamically in HSL-curated color spectrums.",
    icon: FaGithub,
    color: "bg-green-500/20 text-green-500",
  },
  {
    name: "Repository Spotlights",
    description: "Highlight your top pinned repositories, including their stars, forks, and programming stack badges.",
    icon: GitBranch,
    color: "bg-blue-500/20 text-blue-500",
  },
  {
    name: "Language Composition",
    description: "AI parses your repository sizes to render an elegant relative percentage breakdown of your stack.",
    icon: Terminal,
    color: "bg-purple-500/20 text-purple-500",
  },
  {
    name: "Real-Time Sync",
    description: "Automatic background syncing ensures your star counts and active contribution graphs are always accurate.",
    icon: RefreshCw,
    color: "bg-warning/20 text-warning",
  },
];

const STEPS = [
  {
    icon: FaGithub,
    title: "1. Link Username",
    description: "Simply enter your GitHub username. No authorization tokens or personal access keys required for public data.",
  },
  {
    icon: BarChart3,
    title: "2. Automatic Ingestion",
    description: "Our backend fetches repository details, star counts, programming languages, and contribution matrices.",
  },
  {
    icon: Shield,
    title: "3. Curate Display settings",
    description: "Toggle which repositories you want to showcase, select accent colors, and choose a layout theme.",
  },
  {
    icon: RefreshCw,
    title: "4. Live Dynamic Syncing",
    description: "Your public portfolio dynamically re-fetches and updates in the background, keeping your work current automatically.",
  },
];

export default function GitHubSyncFeaturePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Profilix GitHub Sync Integration",
    "description": "Automated developer profile sync with GitHub contribution heatmaps and repository showcases.",
    "brand": {
      "@type": "Brand",
      "name": "Profilix"
    }
  };

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/30 bg-background/35 pt-24 pb-8 md:pt-28 md:pb-10">
        {/* Radial Background Glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
        
        <div className="container relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest shadow-lg shadow-primary/5">
              <FaGithub className="h-3.5 w-3.5" /> Instant & Automatic
            </div>
            <h1 className="font-heading text-4xl font-black leading-tight tracking-tight text-text-primary md:text-6xl">
              Turn Your GitHub Stats <span className="animated-gradient-text">Into A Portfolio</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl font-medium">
              Link your GitHub username in seconds to render stunning, interactive contribution graphs and repository spotlights directly on your developer profile card.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="h-14 rounded-full px-10 text-lg group">
                  Sync My GitHub Now <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-heading text-3xl font-bold text-text-primary md:text-4xl">Synced Metrics</h2>
            <p className="text-text-secondary mt-3">What gets pulled and dynamically formatted on your live profile.</p>
            <div className="mt-4 mx-auto h-1.5 w-24 rounded-full bg-primary/20" />
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {SYNC_METRICS.map((metric, i) => (
              <div key={i} className="group glass-panel rounded-[32px] border border-border/50 bg-surface p-6 transition-all hover:border-primary/40 hover:shadow-xl">
                <div className={`mb-6 h-12 w-12 rounded-2xl ${metric.color} flex items-center justify-center`}>
                  <metric.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-heading text-lg font-bold text-text-primary">{metric.name}</h3>
                <p className="text-xs leading-relaxed text-text-secondary">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works detail */}
      <section className="bg-surface-low py-24 relative">
        <div className="pointer-events-none absolute left-0 top-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[80px]" />
        
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-8 font-heading text-3xl font-bold text-text-primary md:text-4xl">
                Simple Setup Pipeline
              </h2>

              <div className="space-y-10">
                {STEPS.map((step, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="mt-1 shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-white">
                        <step.icon className="h-6 w-6" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-heading text-xl font-bold text-text-primary mb-2">{step.title}</h4>
                      <p className="text-text-secondary leading-relaxed text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub Card & Grid Mockup */}
            <div className="relative mt-10 lg:mt-0">
              <div className="glass-panel overflow-hidden rounded-[32px] md:rounded-[40px] border border-border/50 bg-surface p-6 shadow-2xl relative">
                
                {/* Mock Repository card */}
                <div className="bg-background border border-border rounded-2xl p-5 mb-5 group relative overflow-hidden transition-all hover:border-primary/40">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full px-2 py-0.5 mb-2">Featured Project</span>
                      <h4 className="font-heading font-bold text-sm text-text-primary flex items-center gap-1.5">
                        <GitBranch className="h-4 w-4 text-primary" /> fast-compiler
                      </h4>
                      <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                        A highly optimized assembly code generator and syntax scanner built in Rust.
                      </p>
                    </div>
                    <div className="flex gap-3 text-xs text-text-tertiary">
                      <span className="flex items-center gap-1"><FaStar className="text-yellow-500 h-3 w-3" /> 248</span>
                      <span className="flex items-center gap-1"><FaCodeFork className="h-3 w-3" /> 18</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <span className="text-[10px] font-mono bg-surface-high border px-2 py-0.5 rounded text-text-secondary">Rust</span>
                    <span className="text-[10px] font-mono bg-surface-high border px-2 py-0.5 rounded text-text-secondary">Assembly</span>
                  </div>
                </div>

                {/* Mock contribution graph grid */}
                <div className="bg-background border border-border rounded-2xl p-5">
                  <h4 className="font-heading font-bold text-xs text-text-primary mb-3">GitHub Contributions (Mock)</h4>
                  
                  {/* Grid cells */}
                  <div className="grid grid-cols-10 gap-1.5">
                    {Array.from({ length: 60 }).map((_, idx) => {
                      let color = "bg-surface-low border border-border/30";
                      if (idx % 7 === 0) color = "bg-green-500/20";
                      else if (idx % 9 === 0) color = "bg-green-500/40";
                      else if (idx % 13 === 0) color = "bg-green-500/70";
                      else if (idx % 21 === 0) color = "bg-green-500";
                      
                      return (
                        <div key={idx} className={`aspect-square w-full rounded-[3px] ${color}`} />
                      );
                    })}
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 text-[9px] text-text-tertiary">
                    <span>Less</span>
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-[1.5px] bg-surface-low border" />
                      <div className="h-2 w-2 rounded-[1.5px] bg-green-500/20" />
                      <div className="h-2 w-2 rounded-[1.5px] bg-green-500/40" />
                      <div className="h-2 w-2 rounded-[1.5px] bg-green-500/70" />
                      <div className="h-2 w-2 rounded-[1.5px] bg-green-500" />
                    </div>
                    <span>More</span>
                  </div>
                </div>

              </div>

              {/* Floating Decoration */}
              <div className="absolute -top-4 -left-4 rounded-2xl bg-primary px-4 py-3 text-white shadow-xl animate-bounce-subtle z-20">
                <p className="text-xs font-bold">1-Click Integration</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
      <Footer />
    </main>
  );
}
