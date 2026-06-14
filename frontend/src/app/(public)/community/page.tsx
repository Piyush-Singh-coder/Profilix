import { Metadata } from "next";
import CommunityClientPage from "./CommunityClientPage";

export const metadata: Metadata = {
  title: "Developer Community Directory | Profilix",
  description:
    "Discover developers, software engineers, and portfolio creators. Find teammates for hackathons, freelance work, and collaboration on Profilix.",
  alternates: { canonical: "/community" },
  openGraph: {
    title: "Developer Community Directory | Profilix",
    description:
      "Browse and search public developer profiles by technology stack, location, and availability on Profilix.",
    url: "/community",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Profilix Community" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Community Directory | Profilix",
    description:
      "Discover developers, software engineers, and portfolio creators. Search by tech stack, location, and availability on Profilix.",
    images: ["/og-default.png"],
  },
};

export default function CommunityPage() {
  return <CommunityClientPage />;
}
