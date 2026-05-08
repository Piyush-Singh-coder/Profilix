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
    title: "Smart Templates",
    description: "Industry-specific designs that impress.",
    icon: <LayoutTemplate className="h-6 w-6 text-primary" />,
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
    <section className="relative py-10 overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto mb-20 max-w-2xl text-center"
        >
          <h2 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl tracking-tight">Built for modern professionals</h2>
          <p className="mt-4 text-text-secondary">
            Everything you need to stand out and get hired.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] bg-surface-high border border-border/50 group-hover:border-primary/50 transition-colors shadow-sm">
                {feature.icon}
              </div>
              <h3 className="font-heading text-lg font-bold text-text-primary mb-2">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary px-2">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
