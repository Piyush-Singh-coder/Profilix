import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TechMarquee } from "@/components/landing/TechMarquee";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { FeaturesBlog } from "@/components/landing/FeaturesBlog";
import { FAQ } from "@/components/landing/FAQ";
import { CTABanner } from "@/components/landing/CTABanner";
import { Footer } from "@/components/layout/Footer";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Profilix completely free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the core features of Profilix including GitHub sync, portfolio generation, and ATS resume exports are completely free to use. Premium themes and advanced analytics may be introduced in the future.",
      },
    },
    {
      "@type": "Question",
      name: "How does the GitHub Sync work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "When you link your GitHub username, our servers fetch your public repositories, star counts, programming languages, and your 26-week contribution graph. All of this is neatly bundled into your public card.",
      },
    },
    {
      "@type": "Question",
      name: "Will my resume beat the ATS (Applicant Tracking Systems)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Our DOCX and PDF resume exports are specifically structured without complex columns or unreadable SVGs, ensuring ATS parsers can perfectly read your text, skills, and experience.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use my own domain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Currently, profiles are hosted on our high-speed domains (e.g. profilix.site/yourname). Custom domain support is on our roadmap for Q3.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if I make my profile private?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If you toggle 'Private Profile' in your settings, your public share link will instantly return a 404 error to visitors. Only you will be able to see your dashboard data.",
      },
    },
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Profilix",
  url: "https://profilix.site",
  description:
    "The best ATS resume generator and portfolio card creator for developers. Sync your GitHub, showcase your projects, and share via QR code.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://profilix.site/u/{search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
