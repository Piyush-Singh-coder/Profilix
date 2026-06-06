import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Profilix",
    default: "Developer Portfolio Builder & ATS Resume Maker | Profilix",
  },
  description:
    "Profilix is the best free developer portfolio builder & ATS resume maker. Sync GitHub activity, parse PDF resumes, write cover letters with AI, track analytics, and export ATS-friendly resume templates in PDF & Word DOCX formats.",
  keywords: [
    // High-intent primary keywords
    "developer portfolio builder",
    "ATS resume maker",
    "ATS resume builder",
    "AI resume builder",
    "online portfolio for developers",
    "developer resume builder",
    "AI resume parser website autofill",
    "convert PDF resume to portfolio site",
    "instant resume to markdown portfolio",
    "ATS friendly developer resume template",
    "software engineer resume builder with GitHub link",
    "best resume format for senior developers",
    "generate recruiter QR code for resume",
    "track resume download analytics",
    "interactive portfolio with downloadable word resume",
    // Core search keywords
    "free ATS resume generator",
    "ATS resume builder free",
    "ATS friendly resume maker",
    "best free resume builder",
    "free resume generator",
    "ATS resume generator",
    "free ATS resume",
    "developer resume builder",
    "software engineer resume generator",
    "computer science student resume",
    "student portfolio creator",
    "GitHub portfolio card",
    "developer profile card",
    "professional profile card generator",
    "digital business card",
    "portfolio card with QR code",
    "QR code portfolio",
    "share resume with QR code",
    "digital portfolio QR",
    "premium resume templates",
    "ATS friendly resume templates",
    "professional resume design",
    "how to pass ATS resume",
    "AI resume builder free",
    "resume builder for developers",
    "best resume generator for software engineers",
    "free portfolio card generator",
    "create professional profile card online",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://profilix.site"),
  alternates: {
    canonical: "/",
  },
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Developer Portfolio Builder & ATS Resume Maker | Profilix",
    description:
      "Profilix is the best free developer portfolio builder & ATS resume maker. Sync GitHub, write resumes/cover letters with AI, track analytics, and share via QR code.",
    siteName: "Profilix",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Profilix – Developer Portfolio Builder & ATS Resume Maker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@profilix_site",
    creator: "@profilix_site",
    title: "Developer Portfolio Builder & ATS Resume Maker | Profilix",
    description:
      "Profilix is the best free developer portfolio builder & ATS resume maker. Sync GitHub, write resumes/cover letters with AI, track analytics, and share via QR code.",
    images: ["/og-default.png"],
  },
  icons: {
    icon: [
      { url: "https://ik.imagekit.io/v6xwevpjp/Profilix/profilix.png?tr=w-192,h-192", type: "image/png" },
    ],
    shortcut: ["https://ik.imagekit.io/v6xwevpjp/Profilix/profilix.png?tr=w-192,h-192"],
    apple: [
      { url: "https://ik.imagekit.io/v6xwevpjp/Profilix/profilix.png?tr=w-192,h-192", sizes: "192x192", type: "image/png" },
    ],
  },
};

import { Providers } from "@/components/providers/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${manrope.variable}`}>
      <head>
        {/* Blocking script: apply theme before React hydrates to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('profilix-theme') || 'dark';
                  if (theme === 'light') {
                    document.documentElement.removeAttribute('data-theme');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        {/* JSON-LD Structured Data – helps Google rich snippets + AI tool understanding */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebApplication",
                  "@id": "https://profilix.site/#app",
                  "name": "Profilix",
                  "url": "https://profilix.site",
                  "applicationCategory": "BusinessApplication",
                  "operatingSystem": "Web",
                  "browserRequirements": "Requires JavaScript",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock",
                    "name": "Free Plan",
                  },
                  "description": "Profilix is a free ATS resume generator and professional profile platform. Build ATS-friendly resumes, create profile cards with GitHub stats, and share your portfolio via QR code.",
                  "featureList": [
                    "Free ATS Resume Generator",
                    "Professional Profile Card Generator",
                    "QR Code Portfolio Sharing",
                    "Premium Resume Templates",
                    "AI-Powered Resume Writing",
                    "GitHub Stats Integration",
                  ],
                  "screenshot": "https://profilix.site/og-default.png",
                  "sameAs": [
                    "https://x.com/profilix_site",
                    "https://www.instagram.com/profilix.site",
                  ],
                },
                {
                  "@type": "Organization",
                  "@id": "https://profilix.site/#org",
                  "name": "Profilix",
                  "url": "https://profilix.site",
                  "logo": "https://ik.imagekit.io/v6xwevpjp/Profilix/profilix.png",
                  "sameAs": [
                    "https://x.com/profilix_site",
                    "https://www.instagram.com/profilix.site",
                  ],
                },
              ],
            }),
          }}
        />
        <Providers>
          {children}
        </Providers>
        <Toaster
          richColors
          closeButton
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: "var(--surface)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              padding: "16px 24px",
              fontSize: "15px",
            },
          }}
        />
      </body>
    </html>
  );
}
