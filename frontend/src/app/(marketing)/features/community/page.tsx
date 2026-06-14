import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTABanner } from "@/components/landing/CTABanner";
import { Users, Sparkles, Search, Share2, CheckCircle2, ArrowRight, ShieldCheck, Zap, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Developer Community Directory – Connect & Discover Talent | Profilix",
  description: "Explore the public developer community directory. Discover teammates for hackathons, get profile upvotes, build networks, and view real-time GitHub contributions. 100% free.",
  keywords: [
    "developer community directory",
    "peer profile upvotes",
    "discover developers for hackathons",
    "collaborate with software engineers",
    "public portfolio board",
    "find developers by skills",
    "tech networking platform"
  ],
  alternates: { canonical: "/features/community" },
};

const STEPS = [
  {
    icon: Users,
    title: "1. List Public Portfolio",
    description: "Toggle your profile to public to automatically showcase your card in the public directory.",
  },
  {
    icon: Heart,
    title: "2. Get Peer Endorsements",
    description: "Collect upvotes on your profile cards to prove your expertise to recruiters and peers.",
  },
  {
    icon: Search,
    title: "3. Target Filter Searches",
    description: "Search by skills, location, or availability state (e.g. Open to Hackathons, Available for Freelance).",
  },
  {
    icon: Share2,
    title: "4. Network Instantly",
    description: "Quick links to GitHub, LinkedIn, Twitter/X, or personal sites to connect without friction.",
  },
];

export default function CommunityFeaturePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Profilix Developer Community Feature",
    "description": "Explore and discover public portfolios, upvote developer profiles, and find teammates for hackathons."
  };

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/30 bg-background/35 py-10 md:py-12 mt-20">
        {/* Animated Glow / Radial Backdrop */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[130px] z-0" />
        
        <div className="container relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest animate-pulse">
              <Sparkles className="h-4 w-4" /> Peer Discovery Directory
            </div>
            <h1 className="font-heading text-4xl font-black leading-tight tracking-tight text-text-primary md:text-6xl">
              Connect and Grow in the <span className="animated-gradient-text">Developer Directory</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
              Showcase your profile card to recruiters and the global dev community. Discover collaborators, upvote your peers, and search for teammates with specific skill stacks.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/community">
                <Button size="lg" className="h-14 rounded-full px-10 text-lg group">
                  Explore Community <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-heading text-3xl font-bold text-text-primary md:text-4xl">How the Directory Works</h2>
            <div className="mt-4 mx-auto h-1.5 w-24 rounded-full bg-primary/20" />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div key={i} className="group glass-panel rounded-[32px] border border-border/50 bg-surface p-8 transition-all hover:bg-surface-high">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <step.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 font-heading text-xl font-bold text-text-primary">{step.title}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Detail */}
      <section className="bg-surface-low py-24 relative">
        <div className="pointer-events-none absolute right-0 top-1/2 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[100px]" />
        
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-8 font-heading text-3xl font-bold text-text-primary md:text-4xl">
                Collaborate & Get Noticed
              </h2>

              <div className="space-y-10">
                <div className="flex gap-6 group">
                  <div className="mt-1 shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-heading text-xl font-bold text-text-primary mb-2">Targeted Teammate Matching</h4>
                    <p className="text-text-secondary leading-relaxed">Filter active developers by stack (e.g. Next.js, Rust, Go) and availability status. Directly connect with people looking for hackathon roles or contracts.</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="mt-1 shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Heart className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-heading text-xl font-bold text-text-primary">Peer-Vetted Credibility</h4>
                    <p className="text-text-secondary leading-relaxed">Let your upvote counts highlight your expertise. Authentic validation from peer developers helps bypass initial recruiter filters.</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="mt-1 shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-heading text-xl font-bold text-text-primary">Privacy Toggles & Controls</h4>
                    <p className="text-text-secondary leading-relaxed">You have full control over your privacy settings. Keep your profile private or toggle it public to immediately share it on the directory.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group mt-10 lg:mt-0">
              <div className="glass-panel overflow-hidden rounded-[32px] md:rounded-[40px] border border-border/50 bg-surface p-6 sm:p-12 shadow-2xl relative flex flex-col items-center">
                {/* Premium Community Layout Graphic */}
                <div className="w-full relative bg-surface-low border border-border rounded-2xl p-5 overflow-hidden transition-transform group-hover:scale-[1.02] duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">D</div>
                    <div>
                      <div className="h-4 w-24 rounded bg-text-primary/10 mb-1" />
                      <div className="h-3 w-16 rounded bg-border/40" />
                    </div>
                  </div>
                  <div className="h-3 w-full rounded bg-border/40 mb-2" />
                  <div className="h-3 w-[80%] rounded bg-border/40 mb-4" />
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="h-5 w-12 rounded bg-primary/10 border border-primary/25" />
                    <span className="h-5 w-16 rounded bg-primary/10 border border-primary/25" />
                    <span className="h-5 w-10 rounded bg-primary/10 border border-primary/25" />
                  </div>
                  <div className="flex items-center justify-between border-t border-border/40 pt-4">
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                      <Heart className="h-4 w-4 text-primary fill-primary" />
                      <span>42 Upvotes</span>
                    </div>
                    <span className="h-6 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/35 text-[10px] text-emerald-400 font-bold flex items-center justify-center uppercase">Open Roles</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 rounded-xl sm:rounded-2xl bg-primary px-4 py-3 sm:px-6 sm:py-4 text-white shadow-xl animate-bounce-subtle z-20">
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest">Global</p>
                <p className="text-[10px] sm:text-xs opacity-80">Developer Net</p>
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
