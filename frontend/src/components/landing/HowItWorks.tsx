"use client";

import { motion } from "framer-motion";
import { GitBranch, Link as LinkIcon, Sliders } from "lucide-react";

const STEPS = [
  {
    id: 1,
    icon: GitBranch,
    title: "Connect GitHub",
    description: "OAuth login pulls avatar and project context instantly.",
  },
  {
    id: 2,
    icon: Sliders,
    title: "Generate ATS Resumes",
    description: "The best and easiest way to generate premium, ATS-friendly resumes that help you land more interviews.",
  },
  {
    id: 3,
    icon: LinkIcon,
    title: "Share Everywhere",
    description: "Publish one URL with dynamic themes, social card, and QR.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <h2 className="font-heading text-4xl font-black text-text-primary sm:text-5xl">From signup to wow in 60 seconds</h2>
          <p className="mt-3 text-sm text-text-secondary">
            A focused setup flow that outputs a polished public developer portfolio.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.article
                key={step.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel rounded-[28px] p-7"
              >
                <div className="mb-5 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-xl font-bold text-text-primary">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{step.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
