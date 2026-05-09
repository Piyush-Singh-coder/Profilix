import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTABanner } from "@/components/landing/CTABanner";
import { FileText, Cpu, Zap, Search, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Free ATS Resume Generator – Build ATS-Friendly Resumes That Land Interviews",
  description:
    "The best free ATS resume generator for developers and job seekers. Build ATS-optimized resumes in minutes with AI-powered bullet points, professional templates, and PDF/DOCX export. 100% free, no credit card required.",
  keywords: [
    "free ATS resume generator",
    "ATS resume builder free",
    "ATS friendly resume",
    "ATS resume generator",
    "best free resume builder",
    "ATS resume maker",
    "free resume builder no signup",
    "AI resume generator free",
    "resume that passes ATS",
    "ATS optimized resume",
    "developer resume generator",
    "software engineer resume builder",
    "tech resume builder free",
    "resume builder for developers",
    "free resume builder 2025",
    "ATS resume checker free",
    "resume builder with AI",
    "how to make ATS friendly resume",
    "pass ATS screening resume",
    "free professional resume builder",
    "modern resume template free",
    "two column resume template free",
    "resume builder multiple templates",
    "serif resume template free",
    "Enhancv style resume free",
    "Harvard style resume template",
    "resume template for software engineer",
    "free resume templates download",
  ],
  alternates: { canonical: "/ats-resume-generator" },
  openGraph: {
    title: "Free ATS Resume Generator – Build Resumes That Land Interviews | Profilix",
    description:
      "Build ATS-optimized resumes in minutes. AI-powered bullet points, professional templates, PDF/DOCX export. 100% free, no credit card required.",
    url: "/ats-resume-generator",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Profilix Free ATS Resume Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@profilix_site",
    title: "Free ATS Resume Generator – Build Resumes That Land Interviews | Profilix",
    description: "Build ATS-optimized resumes in minutes. AI-powered, professional templates, PDF/DOCX export. 100% free.",
    images: ["/og-default.png"],
  },
};

const STEPS = [
  {
    icon: Zap,
    title: "1. Fill Details",
    description: "Fill your basic information, education, experience, projects, achievements, etc.",
  },
  {
    icon: Cpu,
    title: "2. AI Tailoring",
    description: "Paste a job description and let our AI optimize your bullet points to match exactly what recruiters are looking for.",
  },
  {
    icon: Search,
    title: "3. ATS Validation",
    description: "Our templates are pre-structured for ATS systems. No complex columns, no unreadable fonts—just pure, parsable data.",
  },
  {
    icon: FileText,
    title: "4. Fast Export",
    description: "Download your polished resume in PDF for sharing or DOCX for the highest compatibility with online application systems.",
  },
];

export default function ATSResumeGeneratorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        "name": "How to Build a Free ATS-Friendly Resume with Profilix",
        "description": "Step-by-step guide to creating an ATS-optimized resume that passes applicant tracking systems and lands interviews.",
        "totalTime": "PT5M",
        "estimatedCost": { "@type": "MonetaryAmount", "currency": "USD", "value": "0" },
        "step": [
          {
            "@type": "HowToStep",
            "name": "Fill Your Details",
            "text": "Enter your personal information, education, work experience, projects, skills, and achievements on Profilix.",
            "position": 1,
          },
          {
            "@type": "HowToStep",
            "name": "AI Tailoring",
            "text": "Paste the job description and let Profilix's AI optimize your bullet points to match the keywords recruiters and ATS systems scan for.",
            "position": 2,
          },
          {
            "@type": "HowToStep",
            "name": "ATS Validation",
            "text": "Your resume is automatically structured in a clean, single-column layout that all major ATS systems can parse correctly.",
            "position": 3,
          },
          {
            "@type": "HowToStep",
            "name": "Download Free",
            "text": "Export your ATS-optimized resume as a PDF or DOCX. 100% free, no credit card required.",
            "position": 4,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is Profilix's ATS resume generator free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Profilix is 100% free. You can build, customize, and download ATS-optimized resumes with no credit card required.",
            },
          },
          {
            "@type": "Question",
            "name": "What is an ATS-friendly resume?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "An ATS-friendly resume is formatted to be readable by Applicant Tracking Systems (ATS) — software used by 99% of Fortune 500 companies to filter candidates. It uses a clean single-column layout, standard fonts, and avoids complex tables, graphics, or headers that ATS parsers cannot read.",
            },
          },
          {
            "@type": "Question",
            "name": "What makes Profilix better than other free resume builders?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Profilix is purpose-built for ATS compatibility and offers 4 professional templates: ATS Friendly (single-column, PDF+DOCX), Modern Classic (serif style, PDF+DOCX), Premium Dark (two-column dark sidebar, PDF), and Premium Two-Column (Enhancv-style with accent colors, PDF). It uses AI to tailor bullet points to specific job descriptions, and also offers professional profile cards with GitHub stats and QR code portfolio sharing — all in one free platform.",
            },
          },
          {
            "@type": "Question",
            "name": "Can I download my resume as a PDF?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Profilix lets you export your resume as both PDF and DOCX formats. The ATS Friendly and Modern Classic templates support both PDF and DOCX. The Premium Dark and Premium Two-Column templates export as PDF only.",
            },
          },
          {
            "@type": "Question",
            "name": "What resume template styles does Profilix offer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Profilix offers 4 resume templates: (1) ATS Friendly — clean single-column layout, best for passing applicant tracking systems; (2) Modern Classic — serif Georgia-style resume with centered name header and minimal section dividers, similar to Harvard or classic professional resumes; (3) Premium Dark — two-column resume with a dark navy sidebar, accent colors, and professional typography; (4) Premium Two-Column — Enhancv-style layout with a light sidebar, chip-style skill tags, and color accents tied to your profile theme. All are free.",
            },
          },
        ],
      },
    ],
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
        {/* Ambient Blur */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        
        <div className="container relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
              <CheckCircle2 className="h-4 w-4" /> 100% ATS Optimized
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-6xl">
              Stop Fighting <span className="text-primary">ATS Systems</span>. Start Landing Interviews.
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
              Most resumes get rejected by robots before a human even sees them. Profilix builds resumes specifically designed to pass through ATS filters while looking premium to recruiters.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 rounded-full px-10 text-lg">
                  Start Building Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-sm text-text-tertiary">No credit card required. Connect GitHub to save time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section - How it Works */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-heading text-3xl font-bold text-text-primary md:text-4xl text-center">How it works in 60 seconds</h2>
            <div className="mt-4 mx-auto h-1.5 w-24 rounded-full bg-primary/20" />
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div key={i} className="glass-panel group relative rounded-[32px] p-8 transition-all hover:bg-surface-high">
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
      <section className="bg-surface-low py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-8 font-heading text-3xl font-bold text-text-primary md:text-4xl">
                Why Profilix is different
              </h2>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="mt-1 shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10 text-success">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-bold text-text-primary">Single-Column Magic</h4>
                    <p className="mt-2 text-text-secondary leading-relaxed">ATS systems struggle with complex layouts and sidebars. We use a high-conversion single-column structure that parsers love and humans find easy to scan.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-bold text-text-primary">AI-Powered Bullet Points</h4>
                    <p className="mt-2 text-text-secondary leading-relaxed">Don't just list tasks. Our AI helps you frame your experience in terms of impact and results, using keywords that match specific job descriptions.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-500">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-bold text-text-primary">Built for Developers</h4>
                    <p className="mt-2 text-text-secondary leading-relaxed">Every developer has a unique stack. Profilix understands technical skills, GitHub projects, and open-source contributions better than generic resume builders.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="glass-panel overflow-hidden rounded-[32px] border border-border/50 bg-surface p-4 shadow-2xl">
                <div className="aspect-[4/5] w-full rounded-2xl bg-surface-low border border-border p-8 animate-pulse-subtle">
                  <div className="h-8 w-48 rounded bg-border mb-6" />
                  <div className="h-4 w-full rounded bg-border mb-3 opacity-60" />
                  <div className="h-4 w-2/3 rounded bg-border mb-12 opacity-40" />
                  
                  <div className="h-6 w-32 rounded bg-primary/20 mb-6" />
                  <div className="space-y-4">
                    <div className="h-4 w-full rounded bg-border opacity-20" />
                    <div className="h-4 w-full rounded bg-border opacity-20" />
                    <div className="h-4 w-[90%] rounded bg-border opacity-20" />
                  </div>
                </div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 rounded-2xl bg-primary px-6 py-4 text-white shadow-xl">
                <p className="text-xl font-bold">100/100</p>
                <p className="text-xs opacity-80 uppercase tracking-widest font-bold">ATS Score</p>
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
