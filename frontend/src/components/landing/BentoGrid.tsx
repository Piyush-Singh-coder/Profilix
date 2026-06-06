import Link from "next/link";
import { FileText, IdCard, QrCode, BarChart3, Sparkles, LayoutTemplate, ArrowRight, PenTool } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "ATS-Friendly Resumes",
    description: "Build ATS-optimized resumes that pass hiring scans. Upload your existing PDF resume via our AI Resume Parser to instantly auto-fill your profile details.",
    icon: <FileText className="h-5 w-5 text-primary" />,
    href: "/ats-resume-generator",
    className: "lg:col-span-2",
  },
  {
    title: "AI Cover Letters",
    description: "Generate styled cover letters matched to specific job roles in seconds, ready to download in Word (.docx) or PDF format.",
    icon: <PenTool className="h-5 w-5 text-primary" />,
    href: "/features/cover-letter",
    className: "",
  },
  {
    title: "Glassmorphic Profile Cards",
    description: "Share your professional card with premium dark glassmorphism, dynamic custom sections (Languages, Certifications), and skill category tags.",
    icon: <IdCard className="h-5 w-5 text-primary" />,
    href: "/features/profile-cards",
    className: "",
  },
  {
    title: "GitHub Stats & Heatmap Sync",
    description: "Sync your GitHub username to automatically showcase public contribution calendars, stargazers, forks, and programming language ratios.",
    icon: <FaGithub className="h-5 w-5 text-primary" />,
    href: "/features/github-sync",
    className: "",
  },
  {
    title: "QR Code Sharing Wallpapers",
    description: "Generate recruiter-specific QR codes and custom mobile lock screen wallpapers for seamless physical and online networking.",
    icon: <QrCode className="h-5 w-5 text-primary" />,
    href: "/features/qr-code",
    className: "",
  },
  {
    title: "Real-time Visitor Analytics",
    description: "Track profile views, resume download counts, and social link clicks in a secure, privacy-focused dashboard.",
    icon: <BarChart3 className="h-5 w-5 text-primary" />,
    href: "/features/analytics",
    className: "",
  },
  {
    title: "AI Assistant",
    description: "Optimize your professional summaries, work experience bullets, and taglines using state-of-the-art AI reasoning.",
    icon: <Sparkles className="h-5 w-5 text-primary" />,
    href: "/features/ai-assistant",
    className: "",
  },
  {
    title: "PDF & Word DOCX Exporter",
    description: "Choose from multiple professional resume templates and export them in high-quality PDF or Microsoft Word formats.",
    icon: <LayoutTemplate className="h-5 w-5 text-primary" />,
    href: "/features/templates",
    className: "",
  },
];

export function BentoGrid() {
  return (
    <section className="py-6 md:py-10 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 mb-6 text-[10px] font-bold uppercase tracking-widest text-primary">
            FEATURES
          </div>
          <h2 className="text-2xl md:text-5xl font-heading font-bold text-text-primary mb-4 md:mb-6 leading-tight">
            Everything you need <br className="hidden md:block" />
            to grow your career
          </h2>
          <p className="text-text-secondary text-base max-w-xl mx-auto">
            Powerful tools that help you create, share and grow your professional presence.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {features.map((feature, i) => (
            <Link
              key={i}
              href={feature.href}
              className={cn("group block h-full", feature.className)}
            >
              <div className="bg-background border border-border/50 rounded-xl md:rounded-2xl p-4 md:p-8 hover:border-primary/50 transition-colors h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                
                <div className="relative z-10">
                  <div className="mb-4 md:mb-6 inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg md:rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <div className="scale-90 md:scale-100">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="mb-2 md:mb-3 text-sm md:text-lg font-bold font-heading text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary text-[10px] md:text-sm leading-tight md:leading-relaxed mb-4 md:mb-8 line-clamp-2 md:line-clamp-none">
                    {feature.description}
                  </p>
                </div>

                <div className="relative z-10 text-primary text-xs md:text-sm font-semibold flex items-center mt-auto">
                  <span className="hidden sm:inline">Explore feature</span>
                  <span className="inline sm:hidden">Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
