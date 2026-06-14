import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTABanner } from "@/components/landing/CTABanner";
import { FileText, Sparkles, Download, CheckCircle2, ArrowRight, PenTool, LayoutTemplate, HelpCircle } from "lucide-react";
import { FaFilePdf, FaFileWord } from "react-icons/fa6";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "AI Cover Letter Generator – Land More Developer Interviews | Profilix",
  description: "Generate professionally styled, tailored cover letters in seconds. Matches your developer experience to the job description with Classic, Modern, Creative, and Minimalist layouts.",
  keywords: [
    "AI cover letter builder", 
    "developer cover letter", 
    "job description match cover letter", 
    "PDF cover letter export", 
    "Word cover letter template", 
    "resume cover letter generator",
    "ATS friendly cover letter"
  ],
  alternates: { canonical: "/features/cover-letter" },
};

const THEMES = [
  {
    name: "Classic",
    description: "Traditional, authoritative layout with a formal top letterhead. Ideal for enterprise roles and banks.",
    color: "bg-primary/20",
  },
  {
    name: "Modern Serif",
    description: "Elegant centered typography utilizing classic serif fonts. Offers a polished, editorial editorial look.",
    color: "bg-purple-500/20",
  },
  {
    name: "Creative",
    description: "A dynamic layout featuring a stylish left-aligned visual border. Perfect for modern agencies and startups.",
    color: "bg-warning/20",
  },
  {
    name: "Minimalist",
    description: "Ultra-clean spacing, precise margins, and absolute clarity. Built for modern engineers.",
    color: "bg-surface-high",
  },
];

const STEPS = [
  {
    icon: FileText,
    title: "1. Job Description Analysis",
    description: "Paste your target job description. The AI extracts key stack requirements, soft skills, and core responsibilities.",
  },
  {
    icon: Sparkles,
    title: "2. Technical Achievement Alignment",
    description: "AI scans your active developer profile to match your real achievements, stars, and projects with what the hiring team seeks.",
  },
  {
    icon: LayoutTemplate,
    title: "3. Choose a Styling Template",
    description: "Select from our four premium layouts. Spacing, margins, and headers instantly shift on our live canvas.",
  },
  {
    icon: Download,
    title: "4. Clean PDF & Word Exports",
    description: "Instantly download a guaranteed single-page PDF for applications, or an editable DOCX file for quick manual edits.",
  },
];

export default function CoverLetterFeaturePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Profilix AI Cover Letter Generator",
    "description": "High-fidelity AI cover letter builder matching developer profiles to job descriptions in real-time.",
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
              <PenTool className="h-3.5 w-3.5" /> AI-Powered & Styled
            </div>
            <h1 className="font-heading text-4xl font-black leading-tight tracking-tight text-text-primary md:text-6xl">
              Write Custom Cover Letters <span className="animated-gradient-text">In Seconds</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl font-medium">
              Stop sending generic copy-paste cover letters. Match your specific developer accomplishments, projects, and languages directly to the job description automatically.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard/cover-letter">
                <Button size="lg" className="h-14 rounded-full px-10 text-lg group">
                  Generate My Cover Letter <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-heading text-3xl font-bold text-text-primary md:text-4xl">Engineered Styles</h2>
            <p className="text-text-secondary mt-3">Curated layouts built strictly for high-end professional applications.</p>
            <div className="mt-4 mx-auto h-1.5 w-24 rounded-full bg-primary/20" />
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {THEMES.map((theme, i) => (
              <div key={i} className="group glass-panel rounded-[32px] border border-border/50 bg-surface p-6 transition-all hover:border-primary/40 hover:shadow-xl">
                <div className={`mb-6 h-36 w-full rounded-2xl ${theme.color} border border-border/50 flex items-center justify-center overflow-hidden relative`}>
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
                  <FileText className="h-12 w-12 text-primary/40 transition-transform group-hover:scale-110" />
                </div>
                <h3 className="mb-2 font-heading text-lg font-bold text-text-primary">{theme.name}</h3>
                <p className="text-xs leading-relaxed text-text-secondary">{theme.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works section */}
      <section className="bg-surface-low py-24 relative">
        <div className="pointer-events-none absolute left-0 top-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[80px]" />
        
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-8 font-heading text-3xl font-bold text-text-primary md:text-4xl">
                How It Works
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

            {/* Letter Mockup */}
            <div className="relative mt-10 lg:mt-0">
              <div className="glass-panel overflow-hidden rounded-[32px] md:rounded-[40px] border border-border/50 bg-surface p-4 sm:p-6 shadow-2xl relative">
                
                {/* Mock letter */}
                <div className="aspect-[1/1.4] w-full rounded-[24px] bg-white border border-border p-6 sm:p-8 shadow-inner overflow-hidden relative group text-[7px] text-slate-800 leading-normal">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                  
                  {/* Modern Serif header mock */}
                  <div className="text-center mb-6 border-b pb-4">
                    <h3 className="font-heading text-[11px] font-bold text-primary tracking-wide">ALEX RIVERA</h3>
                    <p className="text-slate-500 text-[6px] mt-1">San Francisco, CA &bull; alex.rivera@dev.io &bull; github.com/arivera</p>
                  </div>

                  <div className="space-y-3">
                    <div className="text-slate-400 text-[5px]">May 27, 2026</div>

                    <div>
                      <div className="font-bold text-slate-700">Hiring Manager</div>
                      <div className="text-slate-500">TechCorp Solutions Inc.</div>
                    </div>

                    <div className="font-bold text-slate-900 border-l-2 border-primary/40 pl-2 py-0.5">
                      SUBJECT: Application for Senior Frontend Engineer Role
                    </div>

                    <p className="text-slate-600 font-sans leading-relaxed">
                      Dear Hiring Manager, I am thrilled to express my interest in the Senior Frontend Engineer role at TechCorp. Having followed TechCorp's strides in high-performance web infrastructure, I am highly eager to bring my expertise in React architecture, TypeScript pipelines, and state optimization to your development crew.
                    </p>

                    <p className="text-slate-600 font-sans leading-relaxed">
                      During my time at Profilix, I led the migration of our main dashboard to a Next.js Turbopack core, resulting in a 40% speed boost. This directly aligns with your requirement for engineers skilled in server-side rendering and client loading optimizations. Furthermore, my active open-source contribution graph showcases a robust developer footprint.
                    </p>

                    <p className="text-slate-600 font-sans leading-relaxed">
                      I welcome the opportunity to discuss how my skill set can support TechCorp's product roadmap. Thank you for your time and consideration.
                    </p>

                    <div className="pt-2">
                      <p className="text-slate-500">Sincerely,</p>
                      <p className="font-bold text-slate-800 mt-2 font-heading text-[8px]">Alex Rivera</p>
                    </div>
                  </div>

                  {/* PDF and Word mock buttons overlay */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    <div className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold text-[8px] shadow-lg">
                      <FaFilePdf /> PDF
                    </div>
                    <div className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold text-[8px] shadow-lg">
                      <FaFileWord /> Word
                    </div>
                  </div>
                </div>

              </div>

              {/* Floating Decoration */}
              <div className="absolute -top-4 -left-4 rounded-2xl bg-primary px-4 py-3 text-white shadow-xl animate-bounce-subtle z-20">
                <p className="text-xs font-bold">Style: Modern Serif</p>
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
