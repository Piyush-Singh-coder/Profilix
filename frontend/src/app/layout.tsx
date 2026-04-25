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
    default: "Profilix – Best ATS Resume Generator & Premium Portfolio QR Cards",
  },
  description:
    "Generate the best ATS-friendly resumes and premium design portfolio cards with QR codes and GitHub stats. The easiest way to create a professional identity for developers and freelancers.",
  keywords: [
    "ATS resume generator",
    "best ATS-friendly resume",
    "premium design resume",
    "github portfolio card",
    "developer portfolio QR code",
    "easy resume creator",
    "portfolio card generator",
    "developer profile card",
    "free resume builder for developers",
    "software engineer portfolio",
    "tech resume generator",
    "github stats card",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://profilix.site"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Profilix – Best ATS Resume Generator & Premium Portfolio QR Cards",
    description:
      "Generate the best ATS-friendly resumes and premium design portfolio cards with QR codes and GitHub stats. The easiest way to create a professional identity for developers and freelancers.",
    siteName: "Profilix",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Profilix – Developer Portfolio & Resume Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Profilix – Best ATS Resume Generator & Premium Portfolio QR Cards",
    description:
      "Generate the best ATS-friendly resumes and premium design portfolio cards with QR codes and GitHub stats. The easiest way to create a professional identity for developers and freelancers.",
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
    <html lang="en" className={`${spaceGrotesk.variable} ${manrope.variable}`}>
      <body className="antialiased">
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
