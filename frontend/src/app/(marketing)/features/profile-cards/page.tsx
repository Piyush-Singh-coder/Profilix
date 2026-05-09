import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTABanner } from "@/components/landing/CTABanner";
import { IdCard, Sparkles, Share2, Globe, CheckCircle2, ArrowRight, QrCode, Palette } from "lucide-react";
import { FaGithub, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Professional Profile Cards – Showcase Your GitHub & Skills | Profilix",
  description: "Create stunning digital profile cards with GitHub sync. Choose from Glass, Brutalism, and Apple themes to showcase your professional identity and share via QR code.",
  keywords: [
    "profile cards", 
    "digital business card", 
    "developer profile card", 
    "GitHub stats card", 
    "shareable profile link",
    "QR code business card",
    "professional portfolio card",
    "glassmorphism profile"
  ],
  alternates: { canonical: "/features/profile-cards" },
};

const THEMES = [
  {
    name: "Glassmorphism",
    description: "Sleek, modern frosted glass effect with vibrant gradient accents. Perfect for high-tech portfolios.",
    color: "bg-primary/20",
  },
  {
    name: "Brutalism",
    description: "Bold, high-contrast design with heavy shadows and retro typography. For those who want to stand out.",
    color: "bg-warning/20",
  },
  {
    name: "Apple Style",
    description: "Clean, minimal, and premium aesthetic inspired by modern design standards. Professional and polished.",
    color: "bg-surface-high",
  },
];

const STEPS = [
  {
    icon: FaGithub,
    title: "1. Sync GitHub",
    description: "Connect your GitHub to automatically pull your stats, top repos, and contribution graph.",
  },
  {
    icon: Palette,
    title: "2. Choose a Theme",
    description: "Select from Glass, Brutalism, or Apple themes that best fit your personality.",
  },
  {
    icon: QrCode,
    title: "3. Generate QR",
    description: "Get a custom QR code that instantly leads to your live profile card.",
  },
  {
    icon: Share2,
    title: "4. Share Everywhere",
    description: "Link your card in your Twitter bio, LinkedIn, or personal website.",
  },
];

export default function ProfileCardsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Profilix Profile Cards",
    "description": "Digital professional profile cards with GitHub integration and custom themes.",
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
      <section className="relative overflow-hidden border-b border-border/50 bg-surface-low py-24 md:py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        
        <div className="container relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" /> Stunning & Shareable
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-6xl">
              Your Professional <span className="text-primary">Identity, Reimagined</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
              Stop sharing boring resumes. Send a beautiful, interactive profile card that showcases your GitHub stats, top projects, and skills in real-time.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard/profile-card">
                <Button size="lg" className="h-14 rounded-full px-10 text-lg group">
                  Build Your Card <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Themes Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-heading text-3xl font-bold text-text-primary md:text-4xl">Curated Themes</h2>
            <div className="mt-4 mx-auto h-1.5 w-24 rounded-full bg-primary/20" />
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {THEMES.map((theme, i) => (
              <div key={i} className="group glass-panel rounded-[32px] border border-border/50 bg-surface p-8 transition-all hover:border-primary/40 hover:shadow-xl">
                <div className={`mb-6 h-40 w-full rounded-2xl ${theme.color} border border-border/50 flex items-center justify-center overflow-hidden relative`}>
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
                  <IdCard className="h-16 w-16 text-primary/40 transition-transform group-hover:scale-110" />
                </div>
                <h3 className="mb-3 font-heading text-xl font-bold text-text-primary">{theme.name}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{theme.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Detail */}
      <section className="bg-surface-low py-24 relative">
        <div className="pointer-events-none absolute left-0 top-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[80px]" />
        
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-8 font-heading text-3xl font-bold text-text-primary md:text-4xl">
                Powerful Integration
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
                      <p className="text-text-secondary leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-10 lg:mt-0">
              <div className="glass-panel overflow-hidden rounded-[32px] md:rounded-[40px] border border-border/50 bg-surface p-4 sm:p-6 shadow-2xl relative">
                {/* Mock Card Preview */}
                <div className="aspect-[3/4] w-full rounded-[24px] bg-white border border-border p-6 sm:p-8 shadow-inner overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5" />
                  
                  {/* Card Header */}
                  <div className="relative flex flex-col items-center mb-6 sm:mb-8">
                    <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-white bg-slate-100 shadow-md mb-4 flex items-center justify-center overflow-hidden">
                       <div className="h-full w-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse" />
                    </div>
                    <div className="h-5 sm:h-6 w-28 sm:w-32 rounded bg-slate-100 mb-2" />
                    <div className="h-3 w-20 sm:w-24 rounded bg-slate-50" />
                  </div>
 
                  {/* Stats Bar */}
                  <div className="relative grid grid-cols-3 gap-2 mb-6 sm:mb-8">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-10 sm:h-12 rounded-xl bg-slate-50 flex flex-col items-center justify-center gap-1">
                        <div className="h-2.5 sm:h-3 w-6 sm:w-8 rounded bg-primary/20" />
                        <div className="h-1.5 sm:h-2 w-5 sm:w-6 rounded bg-slate-200" />
                      </div>
                    ))}
                  </div>
 
                  {/* Socials */}
                  <div className="relative flex justify-center gap-3">
                    {[FaXTwitter, FaGithub, FaLinkedinIn].map((Icon, i) => (
                      <div key={i} className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border border-border bg-white flex items-center justify-center text-text-tertiary transition-colors hover:text-primary">
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                    ))}
                  </div>
 
                  {/* QR Floating Overlay */}
                  <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white border border-border shadow-lg flex items-center justify-center transition-transform group-hover:scale-110">
                    <QrCode className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                </div>
              </div>
 
              {/* Floating Decoration */}
              <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 rounded-xl sm:rounded-2xl bg-primary px-3 py-2 sm:px-4 sm:py-3 text-white shadow-xl animate-bounce-subtle z-20">
                <p className="text-xs sm:text-sm font-bold">Theme: Glass</p>
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