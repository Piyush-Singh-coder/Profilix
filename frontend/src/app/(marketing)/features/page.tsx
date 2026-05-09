import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTABanner } from "@/components/landing/CTABanner";
import { FileText, IdCard, QrCode, BarChart3, Sparkles, Layout, ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Features – Profilix - Build Your Professional Identity",
  description:
    "Explore the powerful tools behind Profilix: ATS-optimized resumes, digital profile cards with GitHub sync, real-time analytics, and AI-powered content optimization.",
  keywords: [
    "resume features",
    "ats resume builder",
    "digital profile card",
    "github stats portfolio",
    "resume analytics",
    "ai resume assistant",
    "qr code resume",
    "professional branding tools"
  ],
  alternates: { canonical: "/features" },
  openGraph: {
    title: "Features – Profilix",
    description: "Discover all the features that make Profilix the ultimate tool for creating professional identities.",
    url: "/features",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Profilix Features" }],
  },
};

const FEATURES = [
  {
    icon: FileText,
    title: "ATS-Optimized Resumes",
    description: "Battle-tested templates designed to pass through any Applicant Tracking System (ATS) with 100% readability.",
    href: "/ats-resume-generator",
  },
  {
    icon: IdCard,
    title: "Digital Profile Cards",
    description: "Interactive cards that sync with your GitHub to showcase your real-time stats, repos, and contributions.",
    href: "/features/profile-cards",
  },
  {
    icon: QrCode,
    title: "Dynamic QR Sharing",
    description: "Instantly share your professional identity with a custom QR code that links directly to your portfolio.",
    href: "/features/qr-code",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Know exactly when and where your profile is being viewed with our premium visitor insights dashboard.",
    href: "/features/analytics",
  },
  {
    icon: Sparkles,
    title: "AI Content Engine",
    description: "Optimize every bullet point and summary with AI tailored specifically to your target job descriptions.",
    href: "/features/ai-assistant",
  },
  {
    icon: Layout,
    title: "Premium Templates",
    description: "Choose from 4 distinct styles: ATS Friendly, Modern Classic, Premium Dark, and Premium Two-Column.",
    href: "/features/templates",
  },
];

const BENEFITS = [
  "Free to get started, no credit card required",
  "Export to professional PDF & DOCX formats",
  "GitHub integration for developers",
  "AI-powered content optimization",
  "Detailed visitor engagement tracking",
  "Mobile-first responsive designs",
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50 bg-surface-low py-24 md:py-32">
        {/* Ambient Blurs */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[140px]" />
        <div className="pointer-events-none absolute left-[10%] top-[10%] h-[300px] w-[300px] rounded-full bg-secondary/5 blur-[100px]" />

        <div className="container relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-6xl">
              Tools to Build Your <span className="text-primary">Future Identity</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
              From the first scan of an ATS to the final review by a hiring manager, Profilix provides the data and design you need to win.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 rounded-full px-10 text-lg group">
                  Start Building Free <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <Link
                key={i}
                href={feature.href}
                className="group relative overflow-hidden rounded-[40px] border border-border/50 bg-surface p-10 transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className="absolute top-0 left-0 h-1.5 w-full bg-primary/20 transition-colors group-hover:bg-primary" />

                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <feature.icon className="h-8 w-8" />
                </div>

                <h3 className="mb-4 font-heading text-2xl font-bold text-text-primary">{feature.title}</h3>

                <p className="mb-8 text-text-secondary leading-relaxed">{feature.description}</p>

                <div className="inline-flex items-center text-sm font-bold text-primary">
                  Explore feature <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Profilix */}
      <section className="bg-surface-low py-24 relative overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px]" />
        
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-8 font-heading text-3xl font-bold text-text-primary md:text-4xl">
                The Competitive Advantage
              </h2>

              <div className="space-y-6">
                {BENEFITS.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10 text-success transition-transform group-hover:scale-110">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="text-text-primary font-medium text-lg">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="rounded-full px-10">
                    Get Started Now
                  </Button>
                </Link>
                <Link href="/ats-resume-generator">
                  <Button size="lg" variant="outline" className="rounded-full px-10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="glass-panel overflow-hidden rounded-[48px] border border-border/50 bg-surface p-10 shadow-2xl">
                <div className="relative aspect-[4/3] w-full rounded-3xl bg-surface-low border border-border p-10 overflow-hidden group">
                  {/* Dynamic background effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50 transition-opacity group-hover:opacity-100" />
                  
                  <div className="relative z-10 space-y-8">
                    <div className="flex items-center justify-between">
                       <ShieldCheck className="h-12 w-12 text-success" />
                       <Zap className="h-12 w-12 text-primary animate-pulse" />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="h-5 w-48 rounded-full bg-text-primary/10" />
                      <div className="h-3 w-full rounded-full bg-border/40" />
                      <div className="h-3 w-[90%] rounded-full bg-border/40" />
                      <div className="h-3 w-[80%] rounded-full bg-border/40" />
                    </div>

                    <div className="pt-8 flex gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                         <QrCode className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1 h-16 rounded-2xl bg-white shadow-lg px-6 flex items-center">
                         <div className="h-4 w-32 rounded bg-slate-100" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-8 -right-8 rounded-[32px] bg-success px-10 py-6 text-white shadow-2xl transform hover:scale-105 transition-transform cursor-default">
                <p className="text-3xl font-black">FREE</p>
                <p className="text-sm opacity-90 uppercase tracking-widest font-bold">No Hidden Fees</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTABanner />
      <Footer />
    </main>
  );
}