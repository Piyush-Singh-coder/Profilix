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
  description: "Generate the best ATS-friendly resumes and premium design portfolio cards with QR codes and GitHub stats. The easiest way to create a professional identity for developers and freelancers.",
  keywords: ["ATS resume generator", "best ATS-friendly resume", "premium design resume", "github portfolio card", "developer portfolio QR code", "easy resume creator"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Profilix – Modern Portfolio Creator",
    description: "Create shareable portfolio cards with QR codes, github stats, and multiple formats.",
    siteName: "Profilix",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profilix – Modern Portfolio Creator",
    description: "Create shareable portfolio cards with QR codes, github stats, and multiple formats.",
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "https://ik.imagekit.io/v6xwevpjp/Profilix/profilix_Logo.png",
    shortcut: "https://ik.imagekit.io/v6xwevpjp/Profilix/profilix_Logo.png",
    apple: "https://ik.imagekit.io/v6xwevpjp/Profilix/profilix_Logo.png",
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
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--surface)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            },
          }}
        />
      </body>
    </html>
  );
}
