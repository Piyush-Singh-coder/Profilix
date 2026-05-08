import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTABanner } from "@/components/landing/CTABanner";
import { FileText, Card, QrCode, BarChart3, Sparkles, Layout, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Features – Profilix - Build Your Professional Identity",
  description:
    "Discover all the features that make Profilix the ultimate tool for creating ATS-friendly resumes, professional profile cards, QR codes, and more.",
  keywords: [
    "features",
    "ats resume",
    "profile card",
    "qr code generator",
    "analytics dashboard",
    "ai resume builder",
    "resume templates",
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
    title: "ATS-Friendly Resumes",
    description: "Create resumes that pass ATS scanners and get you noticed. Our templates are optimized for all major applicant tracking systems.",
    exploreLink: "/ats-resume-generator",
    color: "primary",
  },
  {
    icon: Card,
    title: "Professional Profile Cards",
    description: "Beautiful digital cards to share your professional identity. Stand out with a sleek, shareable profile that leaves a lasting impression.",
    exploreLink: "/dashboard/profile-card",
    color: "success",
  },
  {
    icon: QrCode,
    title: "QR Code Profile",
    description: "Generate a QR code that leads to your profile page. Perfect for business cards, resumes, and networking events.",
    exploreLink: "/dashboard/qr",
    color: "purple",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track profile views and engagement in real-time. Know who's viewing your profile and when they're checking you out.",
    exploreLink: "/dashboard/analytics",
    color: "orange",
  },
  {
    icon: Sparkles,
    title: "AI Content Assistant",
    description: "Get AI suggestions to write better, faster. From resume bullet points to profile bios, let AI help you sound your best.",
    exploreLink: "/ats-resume-generator",
    color: "pink",
  },
  {
    icon: Layout,
    title: "Multiple Templates",
    description: "Choose from modern, professional templates for any role. Whether you're a developer, designer, or manager, we have the right style for you.",
    exploreLink: "/ats-resume-generator",
    color: "cyan",
  },
];

const BENEFITS = [
  "Free to get started",
  "No credit card required",
  "Export to PDF & DOCX",
  "AI-powered optimization",
  "Real-time analytics",
  "Developer-friendly",
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50 bg-surface-low py-24 md:py-32">
        {/* Ambient Blur */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

        <div className="container relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-6xl">
              Everything You Need to <span className="text-primary">Stand Out</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
              From ATS-optimized resumes to beautiful profile cards, Profilix gives you all the tools to build your professional identity.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 rounded-full px-10 text-lg">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="glass-panel group relative overflow-hidden rounded-[32px] border border-border/50 bg-surface p-8 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Color accent bar */}
                <div className={`absolute top-0 left-0 h-1 w-full bg-${feature.color}`} />

                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-${feature.color}/10 text-${feature.color} transition-transform group-hover:scale-110`}>
                  <feature.icon className="h-7 w-7" />
                </div>

                <h3 className="mb-3 font-heading text-xl font-bold text-text-primary">{feature.title}</h3>

                <p className="mb-6 text-sm leading-relaxed text-text-secondary">{feature.description}</p>

                <Link
                  href={feature.exploreLink}
                  className={`inline-flex items-center text-sm font-semibold text-${feature.color} hover:underline`}
                >
                  Explore feature <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Profilix */}
      <section className="bg-surface-low py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-8 font-heading text-3xl font-bold text-text-primary md:text-4xl">
                Why professionals choose Profilix
              </h2>

              <div className="space-y-6">
                {BENEFITS.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10 text-success">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="text-text-primary font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Link href="/dashboard">
                  <Button size="lg" className="rounded-full px-8">
                    Start Building Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="glass-panel overflow-hidden rounded-[32px] border border-border/50 bg-surface p-6 shadow-2xl">
                <div className="aspect-[4/3] w-full rounded-2xl bg-surface-low border border-border p-6">
                  {/* Mock Resume Preview */}
                  <div className="space-y-4">
                    <div className="h-8 w-48 rounded bg-text-primary/10 mb-2" />
                    <div className="h-4 w-full rounded bg-border/50" />
                    <div className="h-4 w-2/3 rounded bg-border/50" />

                    <div className="mt-6 h-6 w-32 rounded bg-primary/20" />
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-border/30" />
                      <div className="h-3 w-[90%] rounded bg-border/30" />
                    </div>

                    <div className="mt-4 h-6 w-32 rounded bg-success/20" />
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-border/30" />
                      <div className="h-3 w-[85%] rounded bg-border/30" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 rounded-2xl bg-success px-6 py-4 text-white shadow-xl">
                <p className="text-xl font-bold">Free</p>
                <p className="text-xs opacity-80 uppercase tracking-widest font-bold">Forever</p>
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