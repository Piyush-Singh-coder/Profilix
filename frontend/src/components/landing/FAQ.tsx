"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "Is Profilix completely free?",
    answer: "Yes, the core features of Profilix including GitHub sync, portfolio generation, and ATS resume exports are completely free to use. Premium themes and advanced analytics may be introduced in the future.",
  },
  {
    question: "How does the GitHub Sync work?",
    answer: "When you link your GitHub username, our servers fetch your public repositories, star counts, programming languages, and your 26-week contribution graph. All of this is neatly bundled into your public card.",
  },
  {
    question: "Will my resume beat the ATS (Applicant Tracking Systems)?",
    answer: "Yes! Our DOCX and PDF resume exports are specifically structured without complex columns or unreadable SVGs, ensuring ATS parsers can perfectly read your text, skills, and experience.",
  },
  {
    question: "Can I use my own domain?",
    answer: "Currently, profiles are hosted on our high-speed domains (e.g. profilix.site/yourname). Custom domain support is on our roadmap for Q3.",
  },
  {
    question: "What happens if I make my profile private?",
    answer: "If you toggle 'Private Profile' in your settings, your public share link will instantly return a 404 error to visitors. Only you will be able to see your dashboard data.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-surface-low border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-text-secondary">
            Everything you need to know about setting up your developer portfolio.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="border border-border/50 bg-background rounded-2xl overflow-hidden transition-all duration-200"
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-semibold text-lg text-text-primary pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-text-secondary transition-transform duration-300 flex-shrink-0",
                    openIndex === i && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "px-6 overflow-hidden transition-all duration-300 ease-in-out",
                  openIndex === i ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <p className="text-text-secondary leading-relaxed pt-1 border-t border-border/30">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
