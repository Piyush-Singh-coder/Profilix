"use client";

import { motion } from "framer-motion";
import { Save, Layers, FileText, IdCard, ArrowRight } from "lucide-react";

export function HowItWorks() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="font-heading text-3xl font-black text-text-primary sm:text-4xl">How Profilix Works</h2>
          <p className="mt-4 text-text-secondary">
            From raw data to a professional identity in three simple steps.
          </p>
        </motion.div>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Decorative dashed line connecting steps on desktop */}
          <div className="absolute top-1/2 left-[16.66%] right-[16.66%] hidden h-[2px] -translate-y-1/2 border-t-2 border-dashed border-border/50 md:block" />

          {/* Step 1 */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0 }}
            className="glass-panel relative z-10 rounded-[24px] p-8 text-center sm:text-left flex flex-col items-center sm:items-start"
          >
            <div className="mb-6 inline-flex rounded-2xl bg-primary/10 p-4 text-primary">
              <Save className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-text-primary">Input Details</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">Add your bio, experience, skills, projects, and achievements.</p>
          </motion.article>

          {/* Step 2 */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.1 }}
            className="glass-panel relative z-10 rounded-[24px] p-8 text-center sm:text-left flex flex-col items-center sm:items-start"
          >
            {/* Branching Arrows pointing to Step 3 */}
            <svg className="absolute -right-16 top-1/2 -translate-y-1/2 hidden lg:block w-24 h-48 text-border/70 z-0 overflow-visible" fill="none" stroke="currentColor" viewBox="0 0 100 200">
              {/* Arrow pointing up to Generate Resume */}
              <path d="M0,100 C40,100 50,30 100,30" strokeWidth="2" strokeDasharray="4 4" fill="none" />
              <polygon points="95,25 102,30 95,35" fill="currentColor" stroke="none" />
              {/* Arrow pointing down to Professional Cards (starting lower) */}
              <path d="M10,160 C40,160 50,180 100,180" strokeWidth="2" strokeDasharray="4 4" fill="none" />
              <polygon points="95,175 102,180 95,185" fill="currentColor" stroke="none" />
            </svg>
            <div className="mb-6 inline-flex rounded-2xl bg-indigo-500/10 p-4 text-indigo-500">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-text-primary">Choose a Template</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">Pick a template that fits your style and profession.</p>
          </motion.article>

          {/* Step 3 (Staggered Layout) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.2 }}
            className="relative z-10 flex flex-col justify-center h-full min-h-[260px]"
          >
            {/* Card 1 (Up) */}
            <div className="absolute left-0 top-0 w-[85%] z-10 glass-panel rounded-2xl p-6 shadow-lg border border-border bg-surface-low transform transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-heading text-base font-bold text-text-primary">Generate Resume</h4>
                  <p className="text-xs text-text-secondary mt-1">ATS-friendly PDF/DOCX</p>
                </div>
              </div>
            </div>

            {/* Card 2 (Down) */}
            <div className="absolute right-0 bottom-0 w-[85%] z-20 glass-panel rounded-2xl p-6 shadow-xl border border-border bg-surface-high transform transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                  <IdCard className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-heading text-base font-bold text-text-primary">Professional Cards</h4>
                  <p className="text-xs text-text-secondary mt-1">Shareable web identity</p>
                </div>
              </div>
            </div>
            
            {/* Removed the middle connecting arrow per user request */}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
