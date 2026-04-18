import { QrCode, FileText, Share2, Palette, BarChart3 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "1-Click GitHub Sync",
    description: "Pull your repos, commits, and languages instantly. No manual typing required.",
    icon: <FaGithub className="h-6 w-6 text-primary" />,
    className: "md:col-span-2",
  },
  {
    title: "Dynamic QR Cards",
    description: "Generate a scanable business card instantly for meetups and hackathons.",
    icon: <QrCode className="h-6 w-6 text-blue-500" />,
    className: "md:col-span-1",
  },
  {
    title: "ATS-Friendly Resumes",
    description: "Export exactly what recruiters need, formatted to pass automated screenings.",
    icon: <FileText className="h-6 w-6 text-green-500" />,
    className: "md:col-span-1",
  },
  {
    title: "Beautiful Themes",
    description: "Glassmorphism, Brutalism, Apple Minimal. Stand out instantly.",
    icon: <Palette className="h-6 w-6 text-pink-500" />,
    className: "md:col-span-2",
  },
  {
    title: "Universal Sharing",
    description: "One unified link for all your socials, code, and career history.",
    icon: <Share2 className="h-6 w-6 text-purple-500" />,
    className: "md:col-span-2",
  },
  {
    title: "Live Analytics",
    description: "Track exactly who views your portfolio and downloads your resume.",
    icon: <BarChart3 className="h-6 w-6 text-orange-500" />,
    className: "md:col-span-1",
  },
];

export function BentoGrid() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-text-primary mb-4">
            Everything you need. <span className="text-primary opacity-80 text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Nothing you don't.</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Stop juggling Linktree, Vercel deployments, and Google Docs. Profilix is your all-in-one developer identity platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-max">
          {features.map((feature, i) => (
            <div
              key={i}
              className={cn(
                "group relative overflow-hidden rounded-3xl border border-border/50 bg-surface/50 p-8 hover:bg-surface transition-colors duration-300",
                feature.className
              )}
            >
              <div className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]" />
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-low shadow-inner">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-2xl font-bold font-heading tracking-tight text-text-primary">
                {feature.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
