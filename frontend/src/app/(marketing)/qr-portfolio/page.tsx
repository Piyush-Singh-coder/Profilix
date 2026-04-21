import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTABanner } from "@/components/landing/CTABanner";
import { QrCode, Smartphone, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Developer Portfolio QR Code Generator – Share at Hackathons & Job Fairs",
  description:
    "Share your full digital portfolio via a QR code at hackathons, tech meetups, and job fairs. Let recruiters scan your GitHub stats, resume, and top projects instantly. No app needed.",
  keywords: [
    "developer portfolio QR code",
    "portfolio QR code generator",
    "share portfolio via QR code",
    "hackathon portfolio card",
    "digital business card developer",
    "QR code portfolio link",
    "tech meetup networking card",
  ],
  alternates: { canonical: "/qr-portfolio" },
  openGraph: {
    title: "Developer Portfolio QR Code Generator – Share at Hackathons & Job Fairs",
    description:
      "Let recruiters scan your GitHub stats, resume, and projects instantly at hackathons and job fairs. No app installation required.",
    url: "/qr-portfolio",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Developer Portfolio QR Code Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Portfolio QR Code Generator",
    description: "Share your portfolio at hackathons and job fairs via QR code. No app needed.",
    images: ["/og-default.png"],
  },
};

export default function QrPortfolioPage() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <Navbar />
      
      {/* Hero */}
      <section className="py-24 bg-surface-low border-b border-border/50 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border text-sm text-text-secondary mb-6 font-medium">
            <QrCode className="w-4 h-4 text-blue-500" /> Share In Person
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-text-primary mb-6 leading-tight">
            The Ultimate <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
              Developer Portfolio QR Code
            </span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Attending a hackathon or a job fair? Let recruiters scan your dynamic QR code and instantly bookmark your GitHub stats, resume, and featured projects on their phones.
          </p>
          <div className="flex justify-center">
            <Link href="/dashboard/qr">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg">
                <QrCode className="w-5 h-5 mr-2" /> Generate Your QR Now
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
              <Smartphone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-3 text-text-primary">Mobile Optimized</h3>
            <p className="text-text-secondary">Your profile card is designed mobile-first. It looks stunning when recruiters tap your link or scan your code on iOS and Android devices.</p>
          </div>
          
          <div className="text-center group">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
              <QrCode className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-3 text-text-primary">High-Res Exports</h3>
            <p className="text-text-secondary">Download your unique QR code in high definition to print on physical business cards, hoodies, or hackathon nametags.</p>
          </div>

          <div className="text-center group">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-3 text-text-primary">Networking Superpower</h3>
            <p className="text-text-secondary">Skip the awkward exchange of LinkedIn URLs. A single scan connects them to your GitHub, Portfolio, Resume, and Email instantly.</p>
          </div>
        </div>
      </section>

      <CTABanner />
      <Footer />
    </main>
  );
}
