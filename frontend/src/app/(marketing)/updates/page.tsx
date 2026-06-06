import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2, Sparkles, Zap, BarChart3, FileText, Palette } from "lucide-react";

export const metadata: Metadata = {
  title: "What's New – Profilix Updates",
  description: "Stay up to date with the latest features, improvements, and updates from Profilix.",
  keywords: ["updates", "changelog", "new features", "product updates", "Profilix news"],
  alternates: { canonical: "/updates" },
};

type Update = {
  version: string;
  date: string;
  badge: "new" | "improvement" | "fix" | "feature";
  title: string;
  description: string;
  changes: string[];
};

const UPDATES: Update[] = [
  {
    version: "2.2.0",
    date: "June 2026",
    badge: "new",
    title: "AI Resume Parser, Redesigned Profiles & Analytics",
    description: "Our biggest update yet! We've integrated an AI Resume PDF Parser, completely redesigned the public portfolio layouts, and added visitor analytics.",
    changes: [
      "Launched AI Resume PDF Parser powered by Llama 3.3 70B to instantly autofill user profiles",
      "Redesigned public profile card layouts with a premium, dark glassmorphic design and custom timelines",
      "Implemented a real-time analytics dashboard to track page views, resume downloads, and social clicks",
      "Added support for custom sections (Certifications, Languages Known) and categorized technical skills",
      "Created downloadable QR lock screen wallpapers and recruiter-oriented QR modes (?mode=hire)",
      "Strengthened system security with heavy rate limiters on AI, PDF generation, and GitHub sync",
      "Optimized SEO metadata across landing pages and dynamic user portfolio layouts",
    ],
  },
  {
    version: "2.1.0",
    date: "May 2026",
    badge: "new",
    title: "AI Cover Letters & GitHub Sync",
    description: "We have released two massive feature additions: a highly custom AI Cover Letter Writer and an automated GitHub Stats Sync integration.",
    changes: [
      "Released AI Cover Letter Writer with 4 layouts: Classic, Modern, Creative, and Minimalist",
      "Dynamic side-by-side Live Preview editor canvas for instant, single-page letter composition",
      "Guaranteed single-page downloads for high-fidelity PDF and editable Microsoft Word (.docx) formats",
      "Full GitHub Stats Ingestion to dynamically show off contributions, repositories, and languages in one click",
      "Launches two new dedicated feature marketing pages explaining these modules",
    ],
  },
  {
    version: "2.0.0",
    date: "May 2026",
    badge: "new",
    title: "Major Redesign & New Features",
    description: "We've completely revamped the platform with a new design system and exciting features.",
    changes: [
      "Launched dedicated Features page with detailed information about all tools",
      "Added 5 new feature detail pages (Profile Cards, QR Code, Analytics, AI Assistant, Templates)",
      "Completely redesigned dashboard with improved navigation",
      "New onboarding flow for new users",
      "Added theme customization options for profile cards",
    ],
  },
  {
    version: "1.9.0",
    date: "April 2026",
    badge: "feature",
    title: "AI Resume Tailoring",
    description: "New AI-powered feature to help tailor your resume for specific job descriptions.",
    changes: [
      "AI-powered bullet point optimization based on job descriptions",
      "Batch AI tailoring for multiple experiences/projects",
      "Smart keyword integration",
    ],
  },
  {
    version: "1.8.0",
    date: "March 2026",
    badge: "feature",
    title: "QR Code Generation",
    description: "Generate QR codes that link directly to your profile.",
    changes: [
      "Custom QR code generation for your profile URL",
      "Download QR codes in multiple formats",
      "Track QR code scans in analytics",
      "QR code templates with brand colors",
    ],
  },
  {
    version: "1.7.0",
    date: "February 2026",
    badge: "improvement",
    title: "Enhanced Analytics Dashboard",
    description: "More detailed insights into your profile performance.",
    changes: [
      "Detailed view tracking",
      "Referrer data for visitors",
      "Export analytics summaries",
    ],
  },
  {
    version: "1.6.0",
    date: "January 2026",
    badge: "feature",
    title: "Profile Card Builder",
    description: "Create beautiful digital profile cards to share your professional identity.",
    changes: [
      "Drag-and-drop profile card builder",
      "Multiple templates and themes",
      "Social media integration",
      "Link sharing and embedding",
    ],
  },
  {
    version: "1.5.0",
    date: "December 2025",
    badge: "improvement",
    title: "Resume Template Updates",
    description: "Improved our resume templates for better ATS compatibility.",
    changes: [
      "New ATS-optimized template designs",
      "Better PDF rendering",
      " DOCX export improvements",
      "Custom color themes for resumes",
    ],
  },
  {
    version: "1.4.0",
    date: "November 2025",
    badge: "feature",
    title: "GitHub Portfolio Integration",
    description: "Automatically sync your GitHub projects to your portfolio.",
    changes: [
      "One-click GitHub import",
      "Auto-sync repositories",
      "Project showcase with live demos",
      "GitHub stats display",
    ],
  },
  {
    version: "1.3.0",
    date: "October 2025",
    badge: "fix",
    title: "Performance & Bug Fixes",
    description: "Various improvements and bug fixes based on user feedback.",
    changes: [
      "50% faster page load times",
      "Fixed issues with image uploads",
      "Improved mobile responsiveness",
      "Fixed resume PDF generation errors",
    ],
  },
  {
    version: "1.2.0",
    date: "September 2025",
    badge: "feature",
    title: "Public Profile Pages",
    description: "Share your portfolio with a unique public URL.",
    changes: [
      "Custom username support",
      "Public profile page with all info",
      "Social media sharing",
      "SEO optimization for profiles",
    ],
  },
  {
    version: "1.0.0",
    date: "August 2025",
    badge: "new",
    title: "Profilix Launch",
    description: "We're excited to launch Profilix - your complete solution for professional identity.",
    changes: [
      "ATS-friendly resume generator",
      "Multiple resume templates",
      "User authentication",
      "Profile management",
      "PDF and DOCX export",
    ],
  },
];

function getBadgeStyles(badge: Update["badge"]) {
  switch (badge) {
    case "new":
      return "bg-success/10 text-success border-success/20";
    case "feature":
      return "bg-primary/10 text-primary border-primary/20";
    case "improvement":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    case "fix":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    default:
      return "bg-primary/10 text-primary border-primary/20";
  }
}

function getBadgeLabel(badge: Update["badge"]) {
  switch (badge) {
    case "new":
      return "New";
    case "feature":
      return "Feature";
    case "improvement":
      return "Improvement";
    case "fix":
      return "Bug Fix";
    default:
      return badge;
  }
}

function getIcon(badge: Update["badge"]) {
  switch (badge) {
    case "new":
      return <Sparkles className="h-4 w-4" />;
    case "feature":
      return <FileText className="h-4 w-4" />;
    case "improvement":
      return <Zap className="h-4 w-4" />;
    case "fix":
      return <CheckCircle2 className="h-4 w-4" />;
    default:
      return <Sparkles className="h-4 w-4" />;
  }
}

export default function UpdatesPage() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50 bg-surface-low py-24 md:py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

        <div className="container relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-6xl">
              What&apos;s <span className="text-primary">New</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
              Stay up to date with the latest features, improvements, and updates from Profilix. We&apos;re constantly working to make your experience better.
            </p>
          </div>
        </div>
      </section>

      {/* Updates Timeline */}
      <section className="py-24">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px" />

            {UPDATES.map((update, i) => (
              <div
                key={i}
                className={`relative mb-16 last:mb-0 ${i % 2 === 0 ? "md:pr-[50%]" : "md:pl-[50%]"}`}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 top-6 h-5 w-5 rounded-full bg-background border-4 border-primary md:left-1/2 md:-translate-x-1/2" />

                {/* Content */}
                <div className="ml-12 md:ml-0">
                  <div className="glass-panel rounded-[24px] border border-border/50 bg-surface p-6 md:p-8">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeStyles(update.badge)}`}>
                        {getIcon(update.badge)}
                        {getBadgeLabel(update.badge)}
                      </span>
                      <span className="text-sm font-bold text-text-secondary">
                        {update.version}
                      </span>
                      <span className="text-sm text-text-tertiary">
                        {update.date}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h2 className="font-heading text-2xl font-bold text-text-primary mb-3">
                      {update.title}
                    </h2>
                    <p className="text-text-secondary mb-6">
                      {update.description}
                    </p>

                    {/* Changes list */}
                    <ul className="space-y-3">
                      {update.changes.map((change, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-text-secondary">
                          <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-surface-low py-16">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-4">
            Have a suggestion?
          </h2>
          <p className="text-text-secondary mb-8 max-w-xl mx-auto">
            We&apos;re always listening to our users. If you have ideas for new features or improvements, let us know!
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}