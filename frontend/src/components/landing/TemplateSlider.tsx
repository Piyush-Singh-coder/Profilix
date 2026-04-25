"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const TEMPLATES = [
  {
    id: "resume-ats",
    name: "ATS-Optimized",
    description: "Clean, parsable structure",
    image: "https://ik.imagekit.io/v6xwevpjp/Profilix/ats-resume-template.png",
    type: "Resume",
  },
  {
    id: "resume-premium",
    name: "Premium Executive",
    description: "Bold and impactful",
    image: "https://ik.imagekit.io/v6xwevpjp/Profilix/premium-design-template.png",
    type: "Resume",
  },
  {
    id: "profile-glass",
    name: "Glassmorphism",
    description: "Modern frosted glass",
    image: "https://ik.imagekit.io/v6xwevpjp/Profilix/profilix-card-glass-template.png",
    type: "Profile",
  },
  {
    id: "profile-apple",
    name: "Apple Minimal",
    description: "Clean and structured",
    image: "https://ik.imagekit.io/v6xwevpjp/Profilix/profilix-card-apple-template.png",
    type: "Profile",
  },
  {
    id: "profile-brutal",
    name: "Brutalism",
    description: "Raw and expressive",
    image: "https://ik.imagekit.io/v6xwevpjp/Profilix/profilix-card-brutalism-template.png",
    type: "Profile",
  },
];

export function TemplateSlider() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="font-heading text-3xl font-black text-text-primary sm:text-4xl">
            Beautiful Templates for Every Professional
          </h2>
          <p className="mt-4 text-text-secondary">
            Choose from a variety of professionally designed templates.
          </p>
        </motion.div>

        {/* CSS grid for 5 items. Stacks on mobile, scrolls horizontally or wraps on larger screens. Here we'll use a responsive flex wrap or grid. */}
        <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory gap-6 md:grid md:grid-cols-5 md:overflow-visible md:pb-0 hide-scrollbar">
          {TEMPLATES.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1 }}
              className="group min-w-[280px] snap-center flex flex-col relative transition-all duration-300 hover:z-50 hover:scale-105"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-surface-low transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg group-hover:-translate-y-1">
                <Image
                  src={template.image}
                  alt={template.name}
                  fill
                  className="object-cover opacity-80 transition-opacity group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60" />
                <div className="absolute top-4 left-4 rounded-full bg-surface-high/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-text-primary backdrop-blur-md border border-border/50">
                  {template.type}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-heading text-base font-bold text-text-primary">{template.name}</h3>
                <p className="text-sm text-text-secondary mt-1">{template.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
