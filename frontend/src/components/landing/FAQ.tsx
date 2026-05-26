"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "Is Profilix completely free?",
    answer: "Yes, the core features of Profilix including GitHub sync, portfolio generation, and ATS resume exports are completely free to use. No hidden subscriptions or credit cards required.",
  },
  {
    question: "How many templates are available?",
    answer: "Currently, we offer 4 professional resume templates (ATS-Friendly, Modern Classic, Premium Dark, and Premium Two-Column) and 3 premium profile card themes (Glass, Brutal, and Apple). More designs are added monthly.",
  },
  {
    question: "How does the GitHub Sync work?",
    answer: "When you link your GitHub username, our servers fetch your public repositories, star counts, programming languages, and your contribution graph. All of this is neatly bundled into your public card and portfolio.",
  },
  {
    question: "Will my resume beat the ATS?",
    answer: "Yes! Our ATS-Friendly and Modern Classic templates are specifically structured for 100% parser compatibility, ensuring hiring systems can perfectly read your skills and experience.",
  },
  {
    question: "What formats can I export in?",
    answer: "Resumes can be exported as high-quality PDF or editable DOCX (Word) formats. Profile cards are exported as high-resolution PNG images optimized for social media sharing.",
  },
  {
    question: "Can I use AI to write my resume?",
    answer: "Absolutely. Our AI Content Engine analyzes your target job description and suggests impact-focused bullet points and summaries tailored to your specific industry.",
  },
  {
    question: "Can I generate cover letters with Profilix?",
    answer: "Yes! Profilix now features an AI Cover Letter Writer. Input a job description and select one of our 4 professional design styles (Classic, Modern, Creative, or Minimalist), and our AI will compose a highly tailored cover letter matching your experience and top skills in seconds, ready to export as a single-page PDF or Word Document.",
  },
  {
    question: "Can I use my own domain?",
    answer: "By default, your profile is hosted at profilix.site/yourname. Custom domain support (mapping your-name.com to your Profilix profile) is coming soon.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-6 md:py-10 bg-background border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-8 md:mb-16">
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
