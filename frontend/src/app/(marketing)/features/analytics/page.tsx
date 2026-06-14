import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTABanner } from "@/components/landing/CTABanner";
import { BarChart3, Eye, Clock, Globe, CheckCircle2, ArrowRight, TrendingUp, Users, MousePointer2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Real-Time Profile Analytics – Track Visitor Insights | Profilix",
  description: "Monitor your profile views and engagement sources. Gain data-driven insights to optimize your job search and professional outreach.",
  keywords: [
    "profile analytics", 
    "visitor tracking", 
    "resume views tracker", 
    "engagement dashboard", 
    "job search analytics",
    "professional presence",
    "who viewed my profile"
  ],
  alternates: { canonical: "/features/analytics" },
};

const STEPS = [
  {
    icon: Eye,
    title: "1. Real-Time Tracking",
    description: "Get instant notifications when a recruiter or employer views your profile card or resume.",
  },
  {
    icon: Globe,
    title: "2. Referrer Tracking",
    description: "See where your traffic is coming from, whether it's direct shares or social platforms.",
  },
  {
    icon: Users,
    title: "3. Visitor Source",
    description: "Identify if your traffic is coming from LinkedIn, Twitter, or direct link shares.",
  },
  {
    icon: TrendingUp,
    title: "4. Engagement Trends",
    description: "Analyze daily and weekly view trends to see which updates drive the most traffic.",
  },
];

export default function AnalyticsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Profilix Analytics Features",
    "description": "Dashboard for tracking profile engagement and visitor metrics."
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
              <BarChart3 className="h-3.5 w-3.5" /> Data-Driven Search
            </div>
            <h1 className="font-heading text-4xl font-black leading-tight tracking-tight text-text-primary md:text-6xl">
              Turn Your Profile into a <span className="animated-gradient-text">Data Powerhouse</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl font-medium">
              Stop guessing if your resume was opened. Get precise analytics on visitor counts and engagement sources to optimize your professional presence.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard/analytics">
                <Button size="lg" className="h-14 rounded-full px-10 text-lg group">
                  Explore Your Data <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Grid */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-heading text-3xl font-bold text-text-primary md:text-4xl">Visitor Intelligence</h2>
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
      <section className="bg-surface-low py-24 relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 bottom-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
        
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-8 font-heading text-3xl font-bold text-text-primary md:text-4xl">
                Master Your Outreach
              </h2>

              <div className="space-y-10">
                <div className="flex gap-6 group">
                  <div className="mt-1 shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-heading text-xl font-bold text-text-primary mb-2">Optimize Outreach</h4>
                    <p className="text-text-secondary leading-relaxed">Know the best time to follow up by tracking when your profile is being actively reviewed by hiring teams.</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="mt-1 shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Globe className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-heading text-xl font-bold text-text-primary">Engagement Sources</h4>
                    <p className="text-text-secondary leading-relaxed">See which platforms drive the most traffic to your profile. Track views from LinkedIn, GitHub, and direct link shares.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-10 lg:mt-0">
              {/* Premium Dashboard Mockup */}
              <div className="glass-panel overflow-hidden rounded-[32px] md:rounded-[40px] border border-border/50 bg-surface p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[10px] sm:text-xs font-bold text-text-tertiary uppercase tracking-widest mb-1">Total Views</p>
                      <h4 className="text-3xl sm:text-4xl font-bold text-text-primary">1,284</h4>
                   </div>
                   <div className="text-success text-[10px] sm:text-sm font-bold flex items-center gap-1 bg-success/10 px-2 py-1 rounded-full">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" /> +24%
                   </div>
                </div>
                
                {/* Visual Chart Mockup */}
                <div className="h-32 sm:h-48 w-full flex items-end gap-1 sm:gap-2 px-1 sm:px-2 border-b border-border/50 pb-2">
                   {[40, 60, 30, 80, 95, 70, 85].map((h, i) => (
                      <div key={i} className="flex-1 bg-primary/20 rounded-t-sm sm:rounded-t-lg transition-all hover:bg-primary" style={{ height: `${h}%` }} />
                   ))}
                </div>
 
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                   <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-surface-low border border-border/50">
                      <p className="text-[9px] sm:text-[10px] font-bold text-text-tertiary uppercase mb-1 sm:mb-2">Top Location</p>
                      <p className="text-xs sm:text-sm font-bold text-text-primary flex items-center gap-2">
                        🇺🇸 San Francisco
                      </p>
                   </div>
                   <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-surface-low border border-border/50">
                      <p className="text-[9px] sm:text-[10px] font-bold text-text-tertiary uppercase mb-1 sm:mb-2">Avg. Duration</p>
                      <p className="text-xs sm:text-sm font-bold text-text-primary flex items-center gap-2">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" /> 2m 45s
                      </p>
                   </div>
                </div>
              </div>
 
              {/* Floating Badge Decoration */}
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 rounded-xl sm:rounded-2xl bg-primary px-3 py-2 sm:px-4 sm:py-3 text-white shadow-xl flex items-center gap-2 z-20">
                <MousePointer2 className="h-3 w-3 sm:h-4 sm:w-4" />
                <p className="text-[10px] sm:text-xs font-bold">New view recorded</p>
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