"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function ActionSection() {
  return (
    <section className="relative py-10 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="flex-1 max-w-xl"
          >
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 mb-6 text-[10px] font-bold uppercase tracking-widest text-primary">
              4X FASTER THAN TYPING
            </div>
            <h2 className="font-heading text-4xl font-black text-text-primary sm:text-5xl leading-tight tracking-tight mb-6">
              Build in minutes.<br />
              Impress for years.
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              Create a powerful resume and profile in minutes and let your work speak for you.
            </p>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-text-primary font-medium">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                AI-powered content suggestions
              </li>
              <li className="flex items-center gap-3 text-text-primary font-medium">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                GitHub & Performance Sync
              </li>
            </ul>

            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">Create My Profile</Button>
            </Link>
          </motion.div>

          {/* Right Dark Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="flex-1 w-full max-w-md lg:max-w-none"
          >
            <div className="rounded-3xl border border-border bg-surface-low p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 flex items-center justify-end w-full">
                <div className="flex items-center gap-2 text-text-primary hover:text-primary transition-colors cursor-pointer text-sm font-medium">
                  Download Resume <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-sm font-medium text-text-secondary mb-8">Profile Strength</p>
                <div className="flex items-center justify-between">
                  {/* Circular Progress */}
                  <div className="relative h-40 w-40 flex items-center justify-center shrink-0">
                    <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-border" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset="28" className="text-success" />
                      {/* Gradient outline segment */}
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset="260" className="text-primary transform rotate-[300deg] origin-center" />
                    </svg>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-text-primary font-heading">95%</div>
                      <div className="text-xs text-text-secondary mt-1">Ready to apply</div>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-4 pl-8 border-l border-border/50">
                    {["GitHub Linked", "Resume Exported", "Projects Synced", "Skills Verified", "Public Link Active"].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-text-primary">
                        <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
