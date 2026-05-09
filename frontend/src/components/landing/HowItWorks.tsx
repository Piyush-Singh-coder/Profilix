"use client";

import { motion } from "framer-motion";
import { FileText, LayoutTemplate, IdCard, QrCode, BarChart3 } from "lucide-react";

const features = [
  {
    title: "ATS Friendly",
    description: "Optimized templates that pass ATS scans.",
    icon: <FileText className="h-6 w-6 text-primary" />,
  },
  {
    title: "Profile Cards",
    description: "Digital cards to showcase your professional brand.",
    icon: <IdCard className="h-6 w-6 text-primary" />,
  },
  {
    title: "QR Code",
    description: "Share your profile with a scan.",
    icon: <QrCode className="h-6 w-6 text-primary" />,
  },
  {
    title: "Analytics",
    description: "Track views and engagement on your profile.",
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
  },
];

export function HowItWorks() {
  return (
    <section className="relative pt-0 pb-8 md:pt-4 md:pb-16 overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto mb-8 md:mb-20 max-w-2xl text-center"
        >
          <h2 className="font-heading text-2xl md:text-5xl font-bold text-text-primary tracking-tight leading-tight">Built for modern professionals</h2>
          <p className="mt-4 text-sm md:text-lg text-text-secondary max-w-xl mx-auto">
            A simple, powerful workflow designed to showcase your expertise and get you noticed by top companies.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: idx * 0.1 }}
              className="group h-full"
            >
              <div className="relative overflow-hidden bg-surface-low/20 backdrop-blur-sm border border-border/40 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col items-center text-center h-full hover:border-primary/40 hover:bg-surface-low/40 transition-all duration-500 shadow-2xl shadow-black/10">
                {/* Subtle Glow */}
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-6 md:mb-10 flex h-14 w-14 md:h-20 md:w-20 items-center justify-center rounded-2xl md:rounded-3xl bg-surface-high border border-border group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-500 shadow-xl shadow-black/20">
                    <div className="scale-100 md:scale-125 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-heading text-base md:text-2xl font-bold text-text-primary mb-2 md:mb-4 group-hover:text-primary transition-colors tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-base leading-relaxed text-text-secondary opacity-70 group-hover:opacity-100 transition-opacity">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
