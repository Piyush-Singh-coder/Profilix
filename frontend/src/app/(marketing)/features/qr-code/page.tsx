import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTABanner } from "@/components/landing/CTABanner";
import { QrCode, Smartphone, Printer, Scan, CheckCircle2, ArrowRight, Sparkles, Share2, MousePointer2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "QR Code Portfolios – Instantly Share Your Profile | Profilix",
  description: "Generate a high-quality QR code that leads directly to your professional profile. Perfect for resumes, business cards, and networking events. 100% free.",
  keywords: [
    "qr code generator", 
    "profile qr code", 
    "resume qr code", 
    "digital business card qr", 
    "share portfolio qr",
    "networking qr code",
    "contactless business card"
  ],
  alternates: { canonical: "/features/qr-code" },
};

const STEPS = [
  {
    icon: QrCode,
    title: "1. Generate Instantly",
    description: "Your unique QR code is automatically created as soon as your profile is live.",
  },
  {
    icon: Printer,
    title: "2. Download & Print",
    description: "Export high-resolution QR codes in PNG or SVG for resumes and business cards.",
  },
  {
    icon: Scan,
    title: "3. Quick Access",
    description: "Recruiters scan with any smartphone camera to see your full experience and projects.",
  },
  {
    icon: Share2,
    title: "4. Track Scans",
    description: "See exactly how many times your QR code has been scanned in your analytics dashboard.",
  },
];

export default function QRCodePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Profilix QR Code Feature",
    "description": "Generate and track QR codes for professional profiles and resumes."
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
              <MousePointer2 className="h-4 w-4" /> One-Scan Access
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-6xl">
              Bridge the Gap with <span className="text-primary">QR Technology</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
              Make your physical resume interactive. Generate high-resolution QR codes that lead recruiters directly to your digital portfolio and live projects.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 rounded-full px-10 text-lg group">
                  Get Your QR Code <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
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
            <h2 className="font-heading text-3xl font-bold text-text-primary md:text-4xl">Why Use QR Codes?</h2>
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
                The Networking Edge
              </h2>

              <div className="space-y-10">
                <div className="flex gap-6 group">
                  <div className="mt-1 shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-heading text-xl font-bold text-text-primary mb-2">Zero Friction</h4>
                    <p className="text-text-secondary leading-relaxed">No more spelling out long URLs. One scan takes a recruiter straight to your work, keeping your engagement high.</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="mt-1 shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Sparkles className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-heading text-xl font-bold text-text-primary">Professional Branding</h4>
                    <p className="text-text-secondary leading-relaxed">Add a modern, tech-forward touch to your printed materials that signals you are up-to-date with current digital standards.</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="mt-1 shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                      <Smartphone className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-heading text-xl font-bold text-text-primary">Mobile Optimized</h4>
                    <p className="text-text-secondary leading-relaxed">Our profile cards are built for mobile-first consumption, ensuring a perfect experience on any smartphone.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group mt-10 lg:mt-0">
              <div className="glass-panel overflow-hidden rounded-[32px] md:rounded-[40px] border border-border/50 bg-surface p-6 sm:p-12 shadow-2xl relative flex flex-col items-center">
                {/* Premium QR Mockup */}
                <div className="relative p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-border/50 transition-transform group-hover:scale-105 duration-500">
                  <div className="aspect-square w-32 sm:w-48 relative">
                    <QrCode className="h-full w-full text-text-primary" />
                    
                    {/* Scanning Animation Overlay */}
                    <div className="absolute inset-0 border-2 border-primary/40 rounded-lg animate-pulse" />
                    <div className="absolute left-0 top-0 h-1 w-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] animate-scan-line" />
                  </div>
                </div>
                
                <div className="mt-6 sm:mt-8 text-center">
                   <p className="text-text-primary font-bold text-base sm:text-lg mb-1">Scan Me</p>
                   <p className="text-text-tertiary text-xs sm:text-sm">To see live profile card</p>
                </div>
              </div>
 
              {/* Floating Badge */}
              <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 rounded-xl sm:rounded-2xl bg-primary px-4 py-3 sm:px-6 sm:py-4 text-white shadow-xl animate-bounce-subtle z-20">
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest">High Res</p>
                <p className="text-[10px] sm:text-xs opacity-80">SVG & PNG</p>
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