import { useState } from "react";
import Link from "next/link";
import { MapPin, ThumbsUp, Star, Users, Globe, Link as LinkIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProfileStatus, TechStack } from "@/types";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

interface CommunityCardProps {
  profile: {
    id: string;
    userId: string;
    displayName: string;
    headline: string | null;
    bio: string | null;
    status: ProfileStatus;
    statusCustomText: string | null;
    location: string | null;
    username: string;
    fullName: string;
    avatarUrl: string | null;
    skills: string[];
    upvoteCount: number;
    hasLiked: boolean;
    githubStars: number;
    githubFollowers: number;
    projectCount: number;
    experienceCount: number;
    achievementCount: number;
    socialLinks?: Array<{ platform: string; url: string }>;
  };
}

const STATUS_CONFIGS: Record<
  ProfileStatus,
  { label: string; className: string; barBg: string }
> = {
  LOOKING_FOR_ROLES: {
    label: "Looking For Roles",
    className: "border-sky-500/25 bg-sky-500/10 text-sky-400",
    barBg: "bg-sky-500",
  },
  OPEN_TO_HACKATHONS: {
    label: "Open To Hackathons",
    className: "border-purple-500/25 bg-purple-500/10 text-purple-400",
    barBg: "bg-purple-500",
  },
  BUILDING_SOMETHING: {
    label: "Building Something",
    className: "border-amber-500/25 bg-amber-500/10 text-amber-400",
    barBg: "bg-amber-500",
  },
  AVAILABLE_FOR_FREELANCE: {
    label: "Available For Freelance",
    className: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
    barBg: "bg-emerald-500",
  },
  NOT_AVAILABLE: {
    label: "Not Available",
    className: "border-border/40 bg-surface-low text-text-secondary",
    barBg: "bg-border/60",
  },
  CUSTOM: {
    label: "Custom Status",
    className: "border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-400",
    barBg: "bg-fuchsia-500",
  },
};

const LeetCodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-9.77 9.77a1.375 1.375 0 0 0 0 1.945l1.9 1.9a1.37 1.37 0 0 0 1.936.006l.004-.004 8.28-8.284a.919.919 0 0 1 1.299 0 .922.922 0 0 1-.006 1.302l-7.31 7.31a2.725 2.725 0 0 0 0 3.853l1.898 1.898a2.73 2.73 0 0 0 3.853 0l9.772-9.771a1.374 1.374 0 0 0-.001-1.945l-1.9-1.9a1.374 1.374 0 0 0-1.944 0l-8.29 8.29a.922.922 0 1 1-1.302-1.302l7.31-7.31a2.724 2.724 0 0 0 0-3.853l-1.898-1.898A1.365 1.365 0 0 0 13.483 0z" />
  </svg>
);

function getSocialIcon(platform: string) {
  const p = platform.toUpperCase();
  if (p === "GITHUB") return FaGithub;
  if (p === "LINKEDIN") return FaLinkedin;
  if (p === "TWITTER") return FaTwitter;
  if (p === "LEETCODE") return LeetCodeIcon;
  if (p === "PERSONAL_WEBSITE") return Globe;
  return LinkIcon;
}

export function CommunityCard({ profile }: CommunityCardProps) {
  const { isAuthenticated, user: currentUser } = useAuthStore();
  const [liked, setLiked] = useState(profile.hasLiked);
  const [likesCount, setLikesCount] = useState(profile.upvoteCount);
  const [isLiking, setIsLiking] = useState(false);

  const statusCfg = STATUS_CONFIGS[profile.status] || STATUS_CONFIGS.NOT_AVAILABLE;
  const displayStatus =
    profile.status === "CUSTOM" && profile.statusCustomText
      ? profile.statusCustomText
      : statusCfg.label;

  const initials = profile.displayName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please sign in to upvote profiles");
      return;
    }

    if (currentUser?.id === profile.userId) {
      toast.error("You cannot upvote your own profile");
      return;
    }

    setIsLiking(true);
    const originalLiked = liked;
    const originalCount = likesCount;

    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);

    try {
      if (liked) {
        await api.delete(`/profile/${profile.id}/like`);
        toast.success("Upvote removed");
      } else {
        await api.post(`/profile/${profile.id}/like`);
        toast.success("Profile upvoted");
      }
    } catch (err: any) {
      setLiked(originalLiked);
      setLikesCount(originalCount);
      toast.error(err.response?.data?.message || "Failed to update upvote");
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card
      variant="glass"
      className="group relative flex h-full flex-col justify-between overflow-hidden border border-border/40 bg-surface-low/30 hover:border-primary/45 hover:bg-surface-low/50 hover:shadow-[0_0_35px_var(--color-primary-glow)] transition-all duration-300"
    >
      {/* Availability Colored Top Bar */}
      <div className={cn("absolute top-0 left-0 right-0 h-1.5 z-20", statusCfg.barBg)} />

      {/* Abstract Glassmorphic Mesh & Noise Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none rounded-2xl">
        {/* Subtle noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
        />
        
        {/* Soft floating orb 1 */}
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/15 blur-[35px] group-hover:bg-primary/25 group-hover:scale-110 transition-all duration-700 ease-out" />
        
        {/* Soft floating orb 2 */}
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-sky-500/10 blur-[35px] group-hover:bg-sky-500/20 group-hover:scale-110 transition-all duration-700 ease-out" />
        
        {/* Soft floating orb 3 (Center subtle) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-fuchsia-500/5 blur-[40px] group-hover:bg-fuchsia-500/10 group-hover:rotate-45 group-hover:scale-110 transition-all duration-700 ease-out" />

        {/* Diagonal glass glare */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.05] dark:via-white/[0.02] to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </div>

      <CardContent className="relative z-10 flex-1 space-y-4 p-5 pt-7">
        {/* Header: Avatar, Name, Username, Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary/20 bg-surface-high ring-2 ring-primary/5 shadow-inner">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <span className="text-sm font-semibold text-text-secondary">{initials}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-heading text-base font-bold text-text-primary group-hover:text-primary transition-colors">
                {profile.displayName}
              </h3>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="truncate text-xs text-text-muted shrink-0">@{profile.username}</span>
                {profile.headline && (
                  <>
                    <span className="text-text-muted/40 text-[10px] shrink-0">&bull;</span>
                    <span className="truncate text-xs font-semibold text-primary/80">{profile.headline}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <Badge
            className={cn(
              "shrink-0 max-w-[120px] items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
              statusCfg.className
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse shrink-0" />
            <span className="truncate">{displayStatus}</span>
          </Badge>
        </div>

        {/* Truncated Bio */}
        <p className="line-clamp-3 min-h-[4.5rem] text-sm text-text-secondary leading-relaxed">
          {profile.bio || "No professional summary set yet."}
        </p>

        {/* User Metrics Dashboard Panel */}
        <div className="grid grid-cols-3 gap-2 border border-border/10 bg-surface-high/10 backdrop-blur-md py-2.5 my-3 rounded-2xl relative z-10">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-sm font-extrabold text-text-primary">
              {profile.projectCount || 0}
            </span>
            <span className="text-[9px] text-text-muted font-bold tracking-wider uppercase">
              Projects
            </span>
          </div>
          <div className="flex flex-col items-center justify-center text-center border-x border-border/10">
            <span className="text-sm font-extrabold text-text-primary">
              {profile.experienceCount || 0}
            </span>
            <span className="text-[9px] text-text-muted font-bold tracking-wider uppercase">
              Experience
            </span>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-sm font-extrabold text-text-primary">
              {profile.achievementCount || 0}
            </span>
            <span className="text-[9px] text-text-muted font-bold tracking-wider uppercase">
              Awards
            </span>
          </div>
        </div>

        {/* Location & Social links row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {profile.location ? (
            <div className="flex items-center gap-1.5 text-xs text-text-muted min-w-0 max-w-[60%]">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-text-muted/70" />
              <span className="truncate">{profile.location}</span>
            </div>
          ) : (
            <div />
          )}

          {profile.socialLinks && profile.socialLinks.length > 0 && (
            <div className="flex items-center gap-1.5 ml-auto shrink-0">
              {profile.socialLinks.map((link) => {
                const Icon = getSocialIcon(link.platform);
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="flex h-6.5 w-6.5 items-center justify-center rounded-lg border border-border/10 bg-surface-high/40 text-text-secondary hover:border-primary/40 hover:text-primary transition-all duration-200"
                    title={link.platform.replace(/_/g, " ")}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Skills Chips */}
        {profile.skills && profile.skills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 pt-2 relative z-10">
            {profile.skills.slice(0, 5).map((skill, idx) => (
              <Badge
                key={idx}
                className="border-border bg-surface/50 text-[10px] text-text-secondary font-medium"
              >
                {skill}
              </Badge>
            ))}
            {profile.skills.length > 5 && (
              <Badge className="border-transparent bg-transparent text-[10px] text-text-muted">
                +{profile.skills.length - 5} more
              </Badge>
            )}
          </div>
        ) : (
          <div className="h-6" /> // spacer
        )}
      </CardContent>

      {/* Footer Stats and Button (Removed border-t to prevent SVG grid collision) */}
      <div className="relative z-10 flex items-center justify-between bg-surface-low/25 px-5 py-3">
        <div className="flex items-center gap-4 text-xs text-text-secondary">
          <button
            onClick={handleLikeClick}
            disabled={isLiking}
            className="flex items-center gap-1.5 hover:text-primary transition-colors disabled:opacity-50 group/upvote"
            title="Upvote"
          >
            <ThumbsUp
              className={cn(
                "h-3.5 w-3.5 transition-transform group-hover/upvote:scale-110",
                liked ? "text-primary fill-primary/20" : "text-text-muted"
              )}
            />
            <span className={cn("font-semibold", liked ? "text-primary font-bold" : "")}>
              {likesCount}
            </span>
          </button>

          {profile.githubStars > 0 && (
            <div className="flex items-center gap-1" title="GitHub Stars">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500/10" />
              <span>{profile.githubStars}</span>
            </div>
          )}

          {profile.githubFollowers > 0 && (
            <div className="flex items-center gap-1" title="GitHub Followers">
              <Users className="h-3.5 w-3.5 text-text-muted" />
              <span>{profile.githubFollowers}</span>
            </div>
          )}
        </div>

        <Link
          href={`/u/${profile.username}`}
          className="text-xs font-bold text-primary hover:text-primary-hover group-hover:translate-x-0.5 transition-all"
        >
          View Profile &rarr;
        </Link>
      </div>
    </Card>
  );
}
