import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTABanner } from "@/components/landing/CTABanner";
import { Sparkles, Wand2, FileText, MessageSquare, CheckCircle2, ArrowRight, BrainCircuit, Target, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "AI Resume & Profile Assistant – Tailor Content Instantly | Profilix",
  description: "Leverage AI to write high-impact resume bullet points and professional bios. Tailor your application to specific job descriptions with our smart AI assistant.",
  keywords: [
    "ai resume builder", 
    "ai bullet point generator", 
    "resume tailoring ai", 
    "professional bio generator", 
    "impact quantification",
    "ai career assistant",
    "write resume with ai"
  ],
  alternates: { canonical: "/features/ai-assistant" },
};

const STEPS = [
  {
    icon: Target,
    title: "1. Paste Job Desc",
    description: "Input the job description you are targeting to help the AI understand the required skills.",
  },
  {
    icon: BrainCircuit,
    title: "2. Analyze Experience",
    description: "Our AI scans your background to find the perfect match for the role's requirements.",
  },
  {
    icon: Wand2,
    title: "3. Generate Content",
    description: "Get multiple high-impact variations for your bullet points and professional summary.",
  },
  {
    icon: Zap,
    title: "4. Apply & Win",
    description: "Choose the best suggestions and instantly apply them to your resume or profile card.",
  },
];

export default function AIAssistantPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Profilix AI Assistant",
    "applicationCategory": "CareerService",
    "description": "AI-powered tool for optimizing resume content and profile cards."
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
              <Sparkles className="h-4 w-4" /> Next-Gen AI
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-6xl">
              Write with <span className="text-primary">Confidence</span> using AI
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
              Don&apos;t settle for generic bullet points. Our AI assistant helps you quantify your achievements and tailor your content to every specific job application.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 rounded-full px-10 text-lg group">
                  Start Writing Free <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-heading text-3xl font-bold text-text-primary md:text-4xl">The AI Workflow</h2>
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

      {/* Before/After Section */}
      <section className="bg-surface-low py-24 relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
        
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-8 font-heading text-3xl font-bold text-text-primary md:text-4xl">
                Optimize for Impact
              </h2>

              <div className="space-y-10">
                <div className="flex gap-6 group">
                  <div className="mt-1 shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-heading text-xl font-bold text-text-primary mb-2">Quantifiable Results</h4>
                    <p className="text-text-secondary leading-relaxed">Our AI identifies opportunities to add metrics and percentages to your experience, making you 3x more likely to be hired.</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="mt-1 shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Sparkles className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-heading text-xl font-bold text-text-primary">Content Relevance</h4>
                    <p className="text-text-secondary leading-relaxed">Automatically inject high-value keywords and skills that recruiters are specifically looking for in your industry.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group mt-10 lg:mt-0">
              <div className="glass-panel overflow-hidden rounded-[32px] md:rounded-[40px] border border-border/50 bg-surface p-5 sm:p-8 shadow-2xl space-y-6 md:space-y-8">
                {/* Before Card */}
                <div className="rounded-2xl border border-border bg-slate-50 p-4 sm:p-6 relative opacity-60 transition-all group-hover:opacity-100">
                  <span className="absolute -top-3 left-6 rounded-full bg-slate-400 px-3 py-1 text-[10px] font-bold text-white">BEFORE</span>
                  <p className="text-sm text-text-secondary italic">"Responsible for building a web application and managing the team."</p>
                </div>
                
                {/* AI Arrow */}
                <div className="flex justify-center">
                   <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-bounce-subtle">
                      <Wand2 className="h-5 w-5" />
                   </div>
                </div>
 
                {/* After Card */}
                <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-4 sm:p-6 relative shadow-lg shadow-primary/5">
                  <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest">AI Optimized</span>
                  <p className="text-sm text-text-primary font-medium">"Spearheaded the development of a scalable React application, increasing user engagement by 45% while managing a cross-functional team of 5 engineers."</p>
                </div>
              </div>
 
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 rounded-2xl bg-success px-5 md:px-6 py-3 md:py-4 text-white shadow-xl animate-pulse z-20">
                <p className="text-lg md:text-xl font-bold">45%</p>
                <p className="text-[10px] md:text-xs opacity-80 font-bold">Boost in Impact</p>
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