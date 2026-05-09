"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FileText, IdCard, Sparkles, Layout, BookOpen, Columns, CheckCircle2, ArrowRight } from "lucide-react";

const CATEGORIES = ["All", "Modern", "Minimal", "Executive", "Creative"];

type TemplateType = "RESUME" | "CARD";

interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  type: TemplateType;
  tag?: string;
}

const TEMPLATES: Template[] = [
  // Resumes
  {
    id: "res-ats",
    name: "ATS Friendly",
    description: "Clean single-column layout optimized for all parsers.",
    image: "https://ik.imagekit.io/v6xwevpjp/Profilix/ats-friendly.png",
    category: "Minimal",
    type: "RESUME",
    tag: "Most Popular",
  },
  {
    id: "res-modern",
    name: "Modern Classic",
    description: "Elegant serif typography for a professional look.",
    image: "https://ik.imagekit.io/v6xwevpjp/Profilix/modern-classic.png",
    category: "Modern",
    type: "RESUME",
  },
  {
    id: "res-dark",
    name: "Premium Dark",
    description: "Bold two-column design with a high-contrast sidebar.",
    image: "https://ik.imagekit.io/v6xwevpjp/Profilix/premium-dark.png",
    category: "Executive",
    type: "RESUME",
    tag: "Premium",
  },
  {
    id: "res-two-col",
    name: "Two-Column Accent",
    description: "Vibrant layout with colored accents and skill chips.",
    image: "https://ik.imagekit.io/v6xwevpjp/Profilix/premium-two-col.png",
    category: "Creative",
    type: "RESUME",
  },
  // Profile Cards
  {
    id: "card-glass",
    name: "Glassmorphism",
    description: "Modern translucent effect with vibrant mesh gradients.",
    image: "https://ik.imagekit.io/v6xwevpjp/Profilix/glass-profile-card.png",
    category: "Modern",
    type: "CARD",
    tag: "Best for Devs",
  },
  {
    id: "card-brutal",
    name: "Brutalist Flat",
    description: "High-contrast, bold lines and flat colors.",
    image: "https://ik.imagekit.io/v6xwevpjp/Profilix/brutal-profile-card.png",
    category: "Creative",
    type: "CARD",
  },
  {
    id: "card-apple",
    name: "Minimal Apple",
    description: "Clean, soft shadows and premium white space.",
    image: "https://ik.imagekit.io/v6xwevpjp/Profilix/apple-profile-card.png",
    category: "Minimal",
    type: "CARD",
  },
];

export function TemplateSlider() {
  const [activeType, setActiveType] = useState<TemplateType>("RESUME");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTemplates = TEMPLATES.filter(
    (t) => t.type === activeType && (activeCategory === "All" || t.category === activeCategory)
  );

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6 text-xs font-bold uppercase tracking-widest text-primary"
          >
            <Sparkles className="h-3 w-3" /> Explore Designs
          </motion.div>
          <h2 className="font-heading text-4xl font-black text-text-primary sm:text-5xl mb-6 tracking-tight">
            Professional templates<br />
            for every industry
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Choose a template that best represents you. From high-parser compatibility to stunning visual cards.
          </p>
        </div>

        {/* Main Mode Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-surface-low border border-border/50 rounded-2xl shadow-inner">
            <button
              onClick={() => { setActiveType("RESUME"); setActiveCategory("All"); }}
              className={cn(
                "flex items-center gap-3 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                activeType === "RESUME" ? "bg-primary text-white shadow-lg" : "text-text-secondary hover:text-text-primary"
              )}
            >
              <FileText className="h-4 w-4" /> Resume Templates
            </button>
            <button
              onClick={() => { setActiveType("CARD"); setActiveCategory("All"); }}
              className={cn(
                "flex items-center gap-3 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                activeType === "CARD" ? "bg-primary text-white shadow-lg" : "text-text-secondary hover:text-text-primary"
              )}
            >
              <IdCard className="h-4 w-4" /> Profile Cards
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2.5 text-xs font-bold rounded-full border-2 transition-all duration-300 uppercase tracking-widest",
                activeCategory === cat
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-surface-low text-text-secondary hover:border-primary/40"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeType + activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-center",
                filteredTemplates.length < 4 && "lg:flex lg:justify-center"
              )}
            >
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template, i) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      "group flex flex-col h-full",
                      filteredTemplates.length < 4 && "lg:w-1/4"
                    )}
                  >
                    <Link href="/dashboard/resume" className="block h-full">
                      <div className={cn(
                        "relative w-full overflow-hidden rounded-2xl border border-border bg-surface-high shadow-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-3xl group-hover:border-primary/30",
                        "aspect-[3/4]"
                      )}>
                        <Image
                          src={template.image}
                          alt={template.name}
                          fill
                          className="object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                          sizes="(max-width: 768px) 100vw, 25vw"
                        />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                           <div className="w-full h-12 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-primary font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform">
                              Use Template
                           </div>
                        </div>

                        {template.tag && (
                          <div className="absolute top-4 right-4 z-20">
                            <div className="rounded-full bg-primary/20 border border-primary/30 px-3 py-1 text-[9px] font-black uppercase tracking-tighter text-primary backdrop-blur-md">
                              {template.tag}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6 px-2">
                        <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{template.name}</h3>
                        <p className="mt-2 text-sm text-text-secondary line-clamp-2 leading-relaxed">{template.description}</p>
                        <div className="mt-4 flex items-center text-xs font-bold text-primary transition-all group-hover:translate-x-1">
                          Get Started <ArrowRight className="ml-2 h-3 w-3" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-surface-low border border-border mb-4">
                    <Layout className="h-8 w-8 text-text-tertiary" />
                  </div>
                  <p className="text-text-secondary font-medium">No templates found in this category.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-20 flex flex-col items-center gap-6">
          <p className="text-sm font-medium text-text-tertiary flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" /> All templates are available on the free plan
          </p>
          <Link href="/dashboard">
            <button className="h-14 px-10 bg-surface border border-border hover:border-primary/40 rounded-full text-text-primary font-bold transition-all shadow-lg hover:shadow-primary/5 flex items-center gap-3 group">
              Explore All Designs <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
