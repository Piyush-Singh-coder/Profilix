import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTABanner } from "@/components/landing/CTABanner";
import { Layout, Palette, FileText, Layers, CheckCircle2, ArrowRight, Monitor, Smartphone, Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Professional Resume & Profile Card Templates | Profilix",
  description: "Choose from our premium collection of ATS-optimized resume templates and beautiful social profile cards. Find the perfect style to represent your professional identity.",
  keywords: [
    "resume templates", 
    "profile card templates",
    "social link cards",
    "ATS resume templates", 
    "professional resume design", 
    "modern resume classic", 
    "premium resume templates",
    "free resume templates download",
    "software engineer resume template",
    "two column resume builder"
  ],
  alternates: { canonical: "/features/templates" },
};

const TEMPLATES = [
  {
    name: "ATS Friendly",
    description: "Clean single-column layout optimized for maximum parser compatibility. Best for high-volume job applications.",
    tag: "Most Popular",
    formats: ["PDF", "DOCX"],
    image: "https://ik.imagekit.io/v6xwevpjp/Profilix/ats-friendly.png"
  },
  {
    name: "Modern Classic",
    description: "Elegant serif typography with a centered header. Perfect for senior roles and traditional industries.",
    tag: "New",
    formats: ["PDF", "DOCX"],
    image: "https://ik.imagekit.io/v6xwevpjp/Profilix/modern-classic.png"
  },
  {
    name: "Premium Dark",
    description: "Bold two-column design with a dark navy sidebar. Stands out on a recruiter's screen with high-contrast styling.",
    tag: "Premium",
    formats: ["PDF"],
    image: "https://ik.imagekit.io/v6xwevpjp/Profilix/premium-dark.png"
  },
  {
    name: "Premium Two-Column",
    description: "Modern Enhancv-style layout with chip-style skills and color accents tied to your personal brand.",
    tag: "Visual",
    formats: ["PDF"],
    image: "https://ik.imagekit.io/v6xwevpjp/Profilix/premium-two-col.png"
  },
];

const CARDS = [
  {
    name: "Glassmorphism",
    description: "Modern translucent effect with vibrant mesh gradients and glass-style layers. Perfect for creative tech roles.",
    tag: "Best for Devs",
    formats: ["SVG", "PNG"],
    image: "https://ik.imagekit.io/v6xwevpjp/Profilix/glass-profile-card.png"
  },
  {
    name: "Brutalist Flat",
    description: "High-contrast design with bold lines, neo-brutalist typography, and flat aesthetic. For those who want to stand out.",
    tag: "Creative",
    formats: ["SVG", "PNG"],
    image: "https://ik.imagekit.io/v6xwevpjp/Profilix/brutal-profile-card.png"
  },
  {
    name: "Minimal Apple",
    description: "Clean, soft shadows and premium white space inspired by high-end design systems. Professional and elegant.",
    tag: "Minimal",
    formats: ["SVG", "PNG"],
    image: "https://ik.imagekit.io/v6xwevpjp/Profilix/apple-profile-card.png"
  },
];

const STEPS = [
  {
    icon: Palette,
    title: "1. Choose Your Style",
    description: "Select from professional resume layouts or modern social profile cards.",
  },
  {
    icon: Sparkles,
    title: "2. AI Tailoring",
    description: "Our AI optimizes your content specifically for the template you choose.",
  },
  {
    icon: Monitor,
    title: "3. Live Preview",
    description: "See exactly how your designs look as you type with our real-time editor.",
  },
  {
    icon: Globe,
    title: "4. Versatile Export",
    description: "Download in PDF, DOCX, SVG, or PNG format for use across any platform.",
  },
];

export default function TemplatesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [...TEMPLATES, ...CARDS].map((t, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": t.name,
      "description": t.description
    }))
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
        {/* Ambient Blurs for consistency */}
        <div className="pointer-events-none absolute left-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="pointer-events-none absolute right-[10%] bottom-[20%] h-[400px] w-[400px] rounded-full bg-secondary/5 blur-[100px]" />

        <div className="container relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" /> Professional Designs
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-6xl">
              Templates for Your <span className="text-primary">Professional Identity</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
              Whether you need a job-winning resume or a stunning profile card for your bio, we've got you covered with curated, high-impact designs.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 rounded-full px-10 text-lg group">
                  Explore All Templates <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Templates Grid */}
      <section className="py-24 relative border-b border-border/30">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-heading text-3xl font-bold text-text-primary md:text-4xl">Resume Templates</h2>
            <p className="mt-4 text-text-secondary">Every template is pre-validated for maximum readability</p>
            <div className="mt-4 mx-auto h-1.5 w-24 rounded-full bg-primary/20" />
          </div>

          <div className="grid gap-12 md:grid-cols-2">
            {TEMPLATES.map((template, i) => (
              <div
                key={i}
                className="group h-full"
              >
                <Link href="/dashboard/resume" className="block h-full">
                  <div className="h-full flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-surface shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl hover:border-primary/30 group">
                    {/* Image area */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden">
                      <Image 
                        src={template.image} 
                        alt={template.name}
                        fill
                        className="object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-10">
                         <div className="w-full h-14 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-primary font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                            Start with this Template
                         </div>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-8 right-8 z-20">
                        <div className="rounded-full bg-primary/20 border border-primary/30 px-5 py-2 text-[10px] font-black uppercase tracking-tighter text-primary backdrop-blur-md">
                          {template.tag}
                        </div>
                      </div>
                    </div>
                    
                    {/* Content area */}
                    <div className="p-6 sm:p-10 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary group-hover:text-primary transition-colors">{template.name}</h3>
                        <div className="flex gap-2 mt-1">
                          {template.formats.map(f => (
                            <span key={f} className="text-[10px] font-black text-text-tertiary border-2 border-border/50 rounded-md px-2 py-0.5 uppercase tracking-tighter">{f}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-text-secondary leading-relaxed mb-8 text-base sm:text-lg flex-1">{template.description}</p>
                      <div className="flex items-center gap-3 text-primary font-bold transition-all group-hover:translate-x-1">
                        Create Resume <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profile Card Templates Grid */}
      <section className="py-24 relative">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-heading text-3xl font-bold text-text-primary md:text-4xl">Profile Card Templates</h2>
            <p className="mt-4 text-text-secondary">Share your identity with beautiful social cards</p>
            <div className="mt-4 mx-auto h-1.5 w-24 rounded-full bg-secondary/20" />
          </div>

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {CARDS.map((card, i) => (
              <div
                key={i}
                className="group h-full"
              >
                <Link href="/dashboard/profile-card" className="block h-full">
                  <div className="h-full flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-surface shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl hover:border-secondary/30 group">
                    {/* Image area */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden">
                      <Image 
                        src={card.image} 
                        alt={card.name}
                        fill
                        className="object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                         <div className="w-full h-12 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-secondary font-bold text-md transform translate-y-4 group-hover:translate-y-0 transition-transform">
                            Try this Style
                         </div>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-6 right-6 z-20">
                        <div className="rounded-full bg-secondary/20 border border-secondary/30 px-4 py-1.5 text-[9px] font-black uppercase tracking-tighter text-secondary backdrop-blur-md">
                          {card.tag}
                        </div>
                      </div>
                    </div>
                    
                    {/* Content area */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-heading text-xl sm:text-2xl font-bold text-text-primary group-hover:text-secondary transition-colors">{card.name}</h3>
                        <div className="flex gap-2 mt-1">
                          {card.formats.map(f => (
                            <span key={f} className="text-[9px] font-black text-text-tertiary border-2 border-border/50 rounded-md px-1.5 py-0.5 uppercase tracking-tighter">{f}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-text-secondary leading-relaxed mb-6 text-sm sm:text-md flex-1">{card.description}</p>
                      <div className="flex items-center gap-2 text-secondary font-bold transition-all group-hover:translate-x-1">
                        Design Card <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Detail */}
      <section className="bg-surface-low py-24 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 top-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
        
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-8 font-heading text-3xl font-bold text-text-primary md:text-4xl">
                Smart Template System
              </h2>

              <div className="space-y-10">
                {STEPS.map((step, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="mt-1 shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
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
              <div className="glass-panel overflow-hidden rounded-2xl border border-border/50 bg-surface p-5 sm:p-8 shadow-2xl">
                <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl bg-surface-low border border-border p-5 sm:p-8 overflow-hidden">
                  {/* Dynamic background effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                  
                  <div className="relative z-10 space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-primary/20 animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-3.5 w-24 sm:w-32 rounded bg-text-primary/10" />
                        <div className="h-2.5 w-16 sm:w-20 rounded bg-text-primary/5" />
                      </div>
                    </div>
                    
                    <div className="space-y-2.5 sm:space-y-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-2.5 sm:h-3 w-full rounded bg-border/40" style={{ width: `${100 - i*5}%` }} />
                      ))}
                    </div>
                    
                    <div className="pt-3 sm:pt-4 grid grid-cols-3 gap-2 sm:gap-3">
                      <div className="h-16 sm:h-20 rounded-lg sm:rounded-xl border-2 border-primary/20 bg-primary/5" />
                      <div className="h-16 sm:h-20 rounded-lg sm:rounded-xl border-2 border-border bg-surface" />
                      <div className="h-16 sm:h-20 rounded-lg sm:rounded-xl border-2 border-border bg-surface" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Success Badge */}
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 rounded-xl sm:rounded-2xl bg-success px-5 py-3 sm:px-6 sm:py-4 text-white shadow-xl z-20">
                <p className="text-lg sm:text-xl font-bold">100%</p>
                <p className="text-[10px] sm:text-xs opacity-80 font-bold">Readability</p>
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