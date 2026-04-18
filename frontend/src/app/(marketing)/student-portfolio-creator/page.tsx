import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTABanner } from "@/components/landing/CTABanner";
import { GraduationCap, FileText, Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Digital Portfolio Card for Students",
  description: "Jumpstart your tech career. Generate a professional portfolio card and download an ATS-friendly resume to land your first internship or junior role.",
  keywords: ["digital portfolio card for students", "student developer portfolio", "tech intern portfolio builder", "entry level resume generator"],
};

export default function StudentPortfolioPage() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <Navbar />
      
      {/* Hero */}
      <section className="py-24 bg-surface-low border-b border-border/50 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border text-sm text-text-secondary mb-6 font-medium">
            <GraduationCap className="w-4 h-4 text-green-500" /> Made for Students
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-text-primary mb-6 leading-tight">
            The Digital <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">
              Portfolio Card for Students
            </span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Land your first internship or junior dev role. Profilix automatically formats your student projects, hackathon wins, and GitHub activity into a professional card and ATS-ready resume.
          </p>
          <div className="flex justify-center">
            <Link href="/auth">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg">
                <GraduationCap className="w-5 h-5 mr-2" /> Start Building Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center group">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-3 text-text-primary">1-Click Resume Export</h3>
            <p className="text-text-secondary">Stop struggling with Word templates. Export your profile instantly to an ATS-friendly PDF or DOCX file structured perfectly for recruiters.</p>
          </div>
          
          <div className="text-center group">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 text-green-500 group-hover:scale-110 transition-transform">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-3 text-text-primary">Showcase Projects</h3>
            <p className="text-text-secondary">No professional experience yet? No problem. Highlight your top academic projects, hackathons, and personal repositories front and center.</p>
          </div>

          <div className="text-center group">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-3 text-text-primary">Stand Out Instantly</h3>
            <p className="text-text-secondary">Most students just hand over a disorganized GitHub link. You'll hand over a beautiful, trackable digital portfolio card that screams professionalism.</p>
          </div>
        </div>
      </section>

      <CTABanner />
      <Footer />
    </main>
  );
}
