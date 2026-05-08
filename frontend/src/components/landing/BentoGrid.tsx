import Link from "next/link";
import { FileText, IdCard, QrCode, BarChart3, Sparkles, LayoutTemplate, ArrowRight } from "lucide-react";

const features = [
  {
    title: "ATS-Friendly Resumes",
    description: "Create resumes that pass ATS scanners and get you noticed.",
    icon: <FileText className="h-5 w-5 text-primary" />,
    href: "/ats-resume-generator",
  },
  {
    title: "Professional Profile Cards",
    description: "Beautiful digital cards to share your professional identity.",
    icon: <IdCard className="h-5 w-5 text-primary" />,
    href: "/github-portfolio-card",
  },
  {
    title: "QR Code Profile",
    description: "Generate a QR code that leads to your profile page.",
    icon: <QrCode className="h-5 w-5 text-primary" />,
    href: "/dashboard",
  },
  {
    title: "Analytics Dashboard",
    description: "Track profile views and engagement in real-time.",
    icon: <BarChart3 className="h-5 w-5 text-primary" />,
    href: "/dashboard",
  },
  {
    title: "AI Content Assistant",
    description: "Get AI suggestions to write better, faster.",
    icon: <Sparkles className="h-5 w-5 text-primary" />,
    href: "/dashboard",
  },
  {
    title: "Multiple Templates",
    description: "Choose from modern, professional templates for any role.",
    icon: <LayoutTemplate className="h-5 w-5 text-primary" />,
    href: "/dashboard/resume",
  },
];

export function BentoGrid() {
  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 mb-6 text-[10px] font-bold uppercase tracking-widest text-primary">
            FEATURES
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-medium text-text-primary mb-6">
            Everything you need <br className="hidden md:block" />
            to grow your career
          </h2>
          <p className="text-text-secondary text-base max-w-xl mx-auto">
            Powerful tools that help you create, share and grow your professional presence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Link key={i} href={feature.href} className="group block h-full">
              <div className="bg-background border border-border/50 rounded-2xl p-8 hover:border-primary/50 transition-colors h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-lg font-bold font-heading text-text-primary group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-8">
                    {feature.description}
                  </p>
                </div>

                <div className="relative z-10 text-primary text-sm font-semibold flex items-center mt-auto">
                  Explore feature <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
