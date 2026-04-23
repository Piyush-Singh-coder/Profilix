import type { Metadata } from "next";
import { ApiSuccessResponse, PublicProfileData } from "@/types";
import ProfileContent from "./ProfileContent";

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ mode?: string }>;
}

const getApiBaseUrl = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchPublicProfile(username: string, mode?: string): Promise<PublicProfileData | null> {
  try {
    const modeQuery = mode ? `?mode=${mode}` : "";
    const response = await fetch(`${getApiBaseUrl()}/u/${username}${modeQuery}`, {
      cache: "no-store",
    });

    if (!response.ok) return null;
    const data = (await response.json()) as ApiSuccessResponse<PublicProfileData>;
    if (!data.success) return null;
    return data.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const { mode } = await searchParams;
  const profile = await fetchPublicProfile(username, mode);

  if (!profile) {
    return {
      title: "Profile Not Found | Profilix",
      description: "This user profile is unavailable.",
    };
  }

  const ogUrl = `${getApiBaseUrl()}/u/${username}/og`;
  const title = `${profile.fullName} (@${username}) | Profilix`;
  const description = profile.profile.bio || `${profile.fullName}'s developer portfolio on Profilix.`;

  return {
    title,
    description,
    alternates: { canonical: `/u/${username}` },
    openGraph: {
      title,
      description,
      type: "profile",
      url: `/u/${username}`,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: `${profile.fullName} social card` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl],
    },
  };
}

export default async function UserProfilePage({ params, searchParams }: PageProps) {
  const { username } = await params;
  const { mode } = await searchParams;
  const profile = await fetchPublicProfile(username, mode);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://profilix.site";
  const ogUrl = `${process.env.NEXT_PUBLIC_API_URL || "https://backend-profilix.onrender.com/api"}/u/${username}/og`;

  const personJsonLd = profile
    ? {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        mainEntity: {
          "@type": "Person",
          name: profile.fullName,
          url: `${baseUrl}/u/${username}`,
          description: profile.profile?.bio || undefined,
          jobTitle: profile.profile?.headline || undefined,
          sameAs: profile.socialLinks?.map((s: { url: string }) => s.url) || [],
          image: ogUrl,
        },
      }
    : null;

  return (
    <>
      {personJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      )}
      <ProfileContent initialUsername={username} mode={mode} initialProfile={profile} />
    </>
  );
}
