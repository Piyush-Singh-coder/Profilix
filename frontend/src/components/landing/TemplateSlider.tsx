"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Modern", "Minimal", "Executive", "Creative"];

const TEMPLATES = [
  {
    id: "resume-ats",
    name: "ATS-Optimized",
    description: "Clean, parsable structure",
    image: "https://ik.imagekit.io/v6xwevpjp/Profilix/ats-resume-template.png",
    type: "Minimal",
  },
  {
    id: "resume-premium",
    name: "Premium Executive",
    description: "Bold and impactful",
    image: "https://ik.imagekit.io/v6xwevpjp/Profilix/premium-design-template.png",
    type: "Executive",
  },
  {
    id: "profile-glass",
    name: "Glassmorphism",
    description: "Modern frosted glass",
    image: "https://ik.imagekit.io/v6xwevpjp/Profilix/profilix-card-glass-template.png",
    type: "Modern",
  },
];

export function TemplateSlider() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <section className="relative py-10 bg-background border-t border-border/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-full border border-border/50 bg-surface-high px-3 py-1 mb-6 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            TEMPLATES
          </div>
          <h2 className="font-heading text-4xl font-medium text-text-primary sm:text-5xl mb-4">
            Professional templates<br />
            for every industry
          </h2>
          <p className="text-text-secondary text-base">
            Choose a template that best represents you.
          </p>
        </div>

        {/* Pill Toggles */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 text-sm font-medium rounded-full transition-colors",
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-surface-high text-text-secondary hover:text-text-primary"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Grid (3 items) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEMPLATES.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[24px] border border-border bg-surface shadow-lg transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:border-border/80">
                <Image
                  src={template.image}
                  alt={template.name}
                  fill
                  className="object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
           <button className="text-sm font-medium text-text-secondary hover:text-primary transition-colors flex items-center justify-center mx-auto gap-2">
             View All Templates <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
           </button>
        </div>
      </div>
    </section>
  );
}
