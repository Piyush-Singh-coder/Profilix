import Link from "next/link";
import { QrCode, FileText, Palette, ShieldCheck, ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "ATS-Optimization Engine",
    description: "Smart keyword analysis and formatting ensure your resume gets shortlisted.",
    icon: <FileText className="h-6 w-6 text-green-500" />,
    href: "/ats-resume-generator",
    actionText: "Generate Resume",
    hoverColor: "hover:border-green-500/50",
    textColor: "text-green-500",
    groupHoverText: "group-hover:text-green-500",
    iconBg: "bg-green-500/10",
  },
  {
    title: "Live Profile Card",
    description: "Share a beautiful, mobile-friendly profile card with a unique link.",
    icon: <FaGithub className="h-6 w-6 text-primary" />,
    href: "/github-portfolio-card",
    actionText: "View Cards",
    hoverColor: "hover:border-primary/50",
    textColor: "text-primary",
    groupHoverText: "group-hover:text-primary",
    iconBg: "bg-primary/10",
  },
  {
    title: "Customizable Themes",
    description: "Choose from multiple themes and make it truly yours.",
    icon: <Palette className="h-6 w-6 text-pink-500" />,
    href: "/dashboard",
    actionText: "Explore Themes",
    hoverColor: "hover:border-pink-500/50",
    textColor: "text-pink-500",
    groupHoverText: "group-hover:text-pink-500",
    iconBg: "bg-pink-500/10",
  },
  {
    title: "Privacy First",
    description: "Your data is secure and private. You're in control.",
    icon: <ShieldCheck className="h-6 w-6 text-purple-500" />,
    href: "/privacy",
    actionText: "Learn More",
    hoverColor: "hover:border-purple-500/50",
    textColor: "text-purple-500",
    groupHoverText: "group-hover:text-purple-500",
    iconBg: "bg-purple-500/10",
  },
];

export function BentoGrid() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-text-primary mb-4">
            Powerful Features for Your Career
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Stop juggling Linktree, Vercel deployments, and Google Docs. Profilix is your all-in-one developer identity platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 auto-rows-max">
          {features.map((feature, i) => (
            <Link key={i} href={feature.href} className="group block h-full">
              <div
                className={cn(
                  "relative overflow-hidden rounded-3xl border border-border/50 bg-surface/50 p-8 transition-colors duration-300 h-full flex flex-col justify-between hover:bg-surface",
                  feature.hoverColor
                )}
              >
                <div className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]" />
                <div>
                  <div className={cn("mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner", feature.iconBg)}>
                    {feature.icon}
                  </div>
                  <h3 className={cn("mb-3 text-2xl font-bold font-heading tracking-tight text-text-primary transition-colors", feature.groupHoverText)}>
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed mb-8">
                    {feature.description}
                  </p>
                </div>
                <div className={cn("font-semibold flex items-center", feature.textColor)}>
                  {feature.actionText} <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
