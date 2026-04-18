import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TechMarquee } from "@/components/landing/TechMarquee";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { FeaturesBlog } from "@/components/landing/FeaturesBlog";
import { FAQ } from "@/components/landing/FAQ";
import { CTABanner } from "@/components/landing/CTABanner";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <Navbar />
      <Hero />
      <HowItWorks />
      <TechMarquee />
      <BentoGrid />
      <FeaturesBlog />
      <FAQ />
      <CTABanner />
      <Footer />
    </main>
  );
}
