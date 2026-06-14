"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  ExternalLink,
  FileDown,
  FolderKanban,
  Link as LinkIcon,
  MapPin,
  Sparkles,
  Star,
  Users,
  Award,
  Briefcase,
  GraduationCap,
  Code2,
  Trophy,
  ArrowRight,
  Monitor,
  Server,
  Database,
  Cpu,
  Cloud,
  Terminal,
  RotateCw,
  Globe2,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Laptop,
  Layers,
  Flag,
  ThumbsUp
} from "lucide-react";
import { FaYoutube, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { PublicProfileData } from "@/types";

interface ProfileContentProps {
  initialUsername: string;
  mode?: string;
  initialProfile: PublicProfileData | null;
}

type ThemeToken = {
  root: string;
  canvas: string;
  card: string;
  muted: string;
  accent: string;
  badge: string;
};

const LeetCodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-9.77 9.77a1.375 1.375 0 0 0 0 1.945l1.9 1.9a1.37 1.37 0 0 0 1.936.006l.004-.004 8.28-8.284a.919.919 0 0 1 1.299 0 .922.922 0 0 1-.006 1.302l-7.31 7.31a2.725 2.725 0 0 0 0 3.853l1.898 1.898a2.73 2.73 0 0 0 3.853 0l9.772-9.771a1.374 1.374 0 0 0-.001-1.945l-1.9-1.9a1.374 1.374 0 0 0-1.944 0l-8.29 8.29a.922.922 0 1 1-1.302-1.302l7.31-7.31a2.724 2.724 0 0 0 0-3.853l-1.898-1.898A1.365 1.365 0 0 0 13.483 0z" />
  </svg>
);

function formatMonthYear(date?: string | null) {
  if (!date) return "Present";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Present";
  return parsed.toLocaleString("en-US", { month: "short", year: "numeric" });
}

function getSocialIcon(platform: string) {
  const p = platform.toUpperCase();
  if (p === "GITHUB") return <FaGithub className="h-4.5 w-4.5 text-slate-400 shrink-0" />;
  if (p === "LINKEDIN") return <FaLinkedin className="h-4.5 w-4.5 text-[#0a66c2] shrink-0" />;
  if (p === "TWITTER") return <FaTwitter className="h-4.5 w-4.5 text-[#1da1f2] shrink-0" />;
  if (p === "LEETCODE") return <LeetCodeIcon className="h-4.5 w-4.5 text-[#ffa116] shrink-0" />;
  return <LinkIcon className="h-4.5 w-4.5 text-slate-400 shrink-0" />;
}

function getSkillCategoryIcon(category: string) {
  const name = category.toLowerCase();
  if (name.includes("language")) return <Code2 className="h-4.5 w-4.5 text-sky-400" />;
  if (name.includes("front")) return <Monitor className="h-4.5 w-4.5 text-sky-400" />;
  if (name.includes("back")) return <Server className="h-4.5 w-4.5 text-sky-400" />;
  if (name.includes("data")) return <Database className="h-4.5 w-4.5 text-sky-400" />;
  if (name.includes("tool") || name.includes("dev tool")) return <Terminal className="h-4.5 w-4.5 text-sky-400" />;
  if (name.includes("cloud") || name.includes("devops")) return <Cloud className="h-4.5 w-4.5 text-sky-400" />;
  if (name.includes("cycle") || name.includes("sdlc") || name.includes("life")) return <RotateCw className="h-4.5 w-4.5 text-sky-400" />;
  if (name.includes("fundamental") || name.includes("cs")) return <Cpu className="h-4.5 w-4.5 text-sky-400" />;
  return <Code2 className="h-4.5 w-4.5 text-sky-400" />;
}

function getProjectIcon(title: string) {
  const name = title.toLowerCase();
  if (name.includes("connect") || name.includes("social") || name.includes("chat") || name.includes("network") || name.includes("xport")) return <Globe2 className="h-5 w-5 text-sky-400" />;
  if (name.includes("bot") || name.includes("chat") || name.includes("ai") || name.includes("agent") || name.includes("budget")) return <MessageSquare className="h-5 w-5 text-sky-400" />;
  if (name.includes("money") || name.includes("budget") || name.includes("finance") || name.includes("wallet")) return <DollarSign className="h-5 w-5 text-sky-400" />;
  if (name.includes("track") || name.includes("analytics") || name.includes("chart") || name.includes("dashboard") || name.includes("stratify")) return <TrendingUp className="h-5 w-5 text-sky-400" />;
  if (name.includes("app") || name.includes("editor") || name.includes("web") || name.includes("code")) return <Laptop className="h-5 w-5 text-sky-400" />;
  return <Layers className="h-5 w-5 text-sky-400" />;
}

const isTechStackBullet = (bullet: string) => {
  return bullet.trim().toLowerCase().startsWith("tech stack:") || bullet.trim().toLowerCase().startsWith("technologies:");
};

export default function ProfileContent({ initialUsername, initialProfile }: ProfileContentProps) {
  useEffect(() => {
    // Apply the profile owner's global theme preference on public profile
    const userPreferredTheme = initialProfile?.profile?.theme?.toLowerCase() || "dark";
    const THEME_STORAGE_KEY = "profilix-theme";

    // Apply the profile's theme to the document
    document.documentElement.setAttribute("data-theme", userPreferredTheme);

    const restoreGlobalTheme = () => {
      const globalTheme = localStorage.getItem(THEME_STORAGE_KEY) || "dark";
      if (globalTheme === "light") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
      }
    };

    window.addEventListener("pagehide", restoreGlobalTheme);

    return () => {
      window.removeEventListener("pagehide", restoreGlobalTheme);
      restoreGlobalTheme();
    };
  }, [initialProfile?.profile?.theme]);

  // Dynamic Theme Generation based on both cardTheme and global theme
  const theme = useMemo(() => {
    const cardTheme = initialProfile?.profile?.cardTheme || "GLASS";
    const isDark = initialProfile?.profile?.theme === "DARK";

    const themes: Record<string, ThemeToken> = {
      GLASS: {
        root: isDark ? "bg-[#060913] text-slate-100" : "bg-slate-50 text-slate-900",
        canvas: isDark 
          ? "from-[#060913] via-[#0B0F1A] to-[#060913]" 
          : "from-slate-50 via-slate-100 to-slate-50",
        card: isDark 
          ? "bg-[#0a0f1d]/75 backdrop-blur-xl border border-blue-950/40 shadow-2xl" 
          : "bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-xl shadow-slate-200/50",
        muted: isDark ? "text-slate-300" : "text-slate-500",
        accent: "text-sky-400",
        badge: isDark ? "bg-sky-950/30 text-sky-400 border border-sky-500/20" : "bg-primary/10 text-primary",
      },
      BRUTAL: {
        root: "bg-background text-text-primary",
        canvas: isDark ? "from-background via-surface-low to-background" : "from-[#FCFAF7] via-[#F3EEE4] to-[#FCFAF7]",
        card: "theme-brutal-card bg-surface border-text-primary",
        muted: "text-text-secondary",
        accent: "text-text-primary",
        badge: "bg-primary/10 text-primary",
      },
      APPLE: {
        root: "bg-background text-text-primary",
        canvas: isDark ? "from-background via-surface-low to-background" : "from-[#FFFFFF] via-[#FBF9F4] to-[#FFFFFF]",
        card: "bg-surface border border-border rounded-3xl shadow-sm",
        muted: "text-text-secondary",
        accent: "text-text-primary",
        badge: "bg-surface-high text-text-primary",
      },
    };

    return themes[cardTheme] || themes.GLASS;
  }, [initialProfile?.profile?.cardTheme, initialProfile?.profile?.theme]);

  const contributionCells = useMemo(() => {
    const days = initialProfile?.githubStats?.contributions?.weeks?.flatMap((week) => week.contributionDays) ?? [];
    return days.slice(-140);
  }, [initialProfile?.githubStats?.contributions?.weeks]);

  const sortedProjects = useMemo(() => {
    return [...(initialProfile?.projects || [])].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return a.displayOrder - b.displayOrder;
    });
  }, [initialProfile?.projects]);

  if (!initialProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div>
          <p className="font-heading text-5xl font-black text-primary">404</p>
          <p className="mt-2 text-text-secondary">This profile is private or does not exist.</p>
        </div>
      </div>
    );
  }

  const { fullName, avatarUrl, profile, socialLinks, projects, experiences, resume, githubStats, achievements, educations, customSections, profileSkills } =
    initialProfile;

  const { isAuthenticated, user: currentUser } = useAuthStore();
  const [upvoteCount, setUpvoteCount] = useState(initialProfile?.upvoteCount || 0);
  const [hasLiked, setHasLiked] = useState(initialProfile?.hasLiked || false);
  const [isLiking, setIsLiking] = useState(false);

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to upvote profiles");
      return;
    }
    if (currentUser?.id === profile.userId) {
      toast.error("You cannot upvote your own profile");
      return;
    }

    setIsLiking(true);
    const originalCount = upvoteCount;
    const originalLiked = hasLiked;

    // Optimistic Update
    setHasLiked(!hasLiked);
    setUpvoteCount(hasLiked ? upvoteCount - 1 : upvoteCount + 1);

    try {
      if (hasLiked) {
        await api.delete(`/profile/${profile.id}/like`);
        toast.success("Upvote removed");
      } else {
        await api.post(`/profile/${profile.id}/like`);
        toast.success("Profile upvoted");
      }
    } catch (error: any) {
      // Rollback
      setHasLiked(originalLiked);
      setUpvoteCount(originalCount);
      toast.error(error.response?.data?.message || "Failed to update upvote");
    } finally {
      setIsLiking(false);
    }
  };

  const displayFullName = profile?.displayName || fullName;
  const isDark = profile?.theme === "DARK";

  const initials = displayFullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`min-h-screen ${theme.root} transition-colors duration-300 overflow-x-hidden`}>
      <div className={`fixed inset-0 -z-10 bg-gradient-to-br ${theme.canvas}`} />
      
      {/* Background Glows */}
      {isDark && (
        <>
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-sky-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        </>
      )}

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        
        {/* ==================== HEADER ==================== */}
        <motion.header
          className={`rounded-[32px] p-5 sm:p-6 md:p-8 ${theme.card} flex flex-col md:flex-row justify-between items-start gap-8 w-full overflow-hidden`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1 w-full min-w-0">
            {avatarUrl ? (
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border border-sky-500/35 bg-[#0a1128]/70 shadow-lg shadow-sky-500/5">
                <Image
                  src={avatarUrl}
                  alt={displayFullName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-[#0a1128]/70 border border-sky-500/35 font-heading text-4xl font-extrabold text-white shadow-lg shadow-sky-500/5">
                {initials}
              </div>
            )}
            
            <div className="min-w-0 w-full">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${theme.badge}`}>
                  <Sparkles className="h-3 w-3" />
                  {profile.cardTheme || "GLASS"} THEME
                </span>
              </div>
              <h1 className="font-heading text-3xl font-extrabold md:text-4xl text-white tracking-tight leading-tight break-words">{displayFullName}</h1>
              <p className="mt-1 text-sm font-semibold text-sky-400 break-all">@{initialUsername}</p>
              {profile.bio && (
                <p className={`mt-4 max-w-2xl text-xs md:text-sm leading-relaxed break-words ${theme.muted}`}>
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[260px] shrink-0">
            <button
              onClick={handleUpvote}
              disabled={isLiking}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold transition-all hover:scale-[1.01] w-full text-center cursor-pointer disabled:opacity-50",
                hasLiked
                  ? "bg-primary/20 border-primary text-primary shadow-lg shadow-primary/10"
                  : "bg-surface-low/50 border-border/40 hover:bg-surface-low hover:border-primary/30 text-text-primary"
              )}
            >
              <ThumbsUp className={cn("h-4 w-4", hasLiked ? "fill-primary/25" : "")} />
              {hasLiked ? "Upvoted" : "Upvote Profile"}
              <span className="ml-1 rounded-full bg-surface-high/50 border border-border/20 px-2 py-0.5 text-xs text-text-secondary">
                {upvoteCount}
              </span>
            </button>

            {profile.location && (
              <div className="flex items-start gap-2 text-sm text-slate-400 px-1 mb-1 w-full break-words">
                <MapPin className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="break-words">{profile.location}</span>
              </div>
            )}

            {resume?.fileUrl && (
              <a
                href={resume.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.01] w-full text-center"
              >
                <FileDown className="h-4 w-4" />
                Download Resume
              </a>
            )}

            {socialLinks.map((link) => {
              const platform = link.platform.replace(/_/g, " ");
              const label = platform.charAt(0) + platform.slice(1).toLowerCase();
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 rounded-xl border border-slate-800 bg-[#0b1329]/50 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-[#121b36]/60 hover:border-sky-500/40 hover:text-white w-full"
                >
                  {getSocialIcon(link.platform)}
                  <span>{label} Profile</span>
                </a>
              );
            })}
          </div>
        </motion.header>

        {/* ==================== GITHUB SECTION ==================== */}
        {githubStats && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
            {/* GitHub Stats & Contribution Graph Card */}
            <article className={`lg:col-span-5 rounded-[32px] p-5 sm:p-6 ${theme.card} flex flex-col justify-between w-full overflow-hidden`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 text-sky-400 mb-6">
                  <FaGithub className="h-5 w-5 text-white" />
                  <h2 className="font-heading text-lg font-bold text-white">GitHub Activity</h2>
                </div>
                
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">GitHub Username</p>
                <a
                  href={`https://github.com/${githubStats.githubUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 text-lg font-black hover:underline text-sky-400 inline-block break-all"
                >
                  {githubStats.githubUsername}
                </a>

                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-800/50 pt-6">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Repos</p>
                    <p className="text-xl font-black text-white mt-1">{githubStats.totalRepos}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Stars</p>
                    <p className="text-xl font-black text-white mt-1">{githubStats.totalStars}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Forks</p>
                    <p className="text-xl font-black text-white mt-1">{githubStats.totalForks}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-4 text-xs text-slate-400 font-semibold">
                  <span><strong className="text-white">{githubStats.followers}</strong> followers</span>
                  <span><strong className="text-white">{githubStats.following}</strong> following</span>
                </div>
              </div>

              <div className="flex-1 mt-6 border-t border-slate-800/50 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Contribution Graph</span>
                  {githubStats.contributions?.totalContributions !== undefined && (
                    <span className="text-[11px] text-sky-400 font-bold">
                      Total contributions: {githubStats.contributions.totalContributions}
                    </span>
                  )}
                </div>
                {contributionCells.length > 0 ? (
                  <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    <div className="min-w-[340px]">
                      {/* Months Header Row */}
                      <div className="grid grid-cols-12 text-[9px] text-slate-400 mb-1.5 px-1 font-bold">
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                        <span>Aug</span>
                        <span>Sep</span>
                        <span>Oct</span>
                        <span>Nov</span>
                        <span>Dec</span>
                        <span>Jan</span>
                      </div>
                      
                      <div 
                        className="grid gap-1 justify-center" 
                        style={{ gridTemplateColumns: "repeat(20, minmax(0, 1fr))" }}
                      >
                        {contributionCells.map((day, index) => (
                          <div
                            key={`${day.date}-${index}`}
                            title={`${day.date}: ${day.contributionCount} contributions`}
                            className="h-2.5 w-2.5 rounded-[2px] transition-all hover:scale-110"
                            style={{ backgroundColor: day.color || "rgba(255,255,255,0.05)" }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No contributions available</p>
                )}
              </div>
            </article>

            {/* Pinned Repos Card */}
            <article className={`lg:col-span-7 rounded-[32px] p-5 sm:p-6 ${theme.card} w-full overflow-hidden`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5 text-sky-400">
                  <Flag className="h-5 w-5" />
                  <h2 className="font-heading text-lg font-bold text-white">Pinned Repos</h2>
                </div>
                <a
                  href={`https://github.com/${githubStats.githubUsername}?tab=repositories`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-sky-400 font-bold hover:underline flex items-center gap-1"
                >
                  View all repositories <ArrowRight className="h-3 w-3" />
                </a>
              </div>

              {githubStats.pinnedRepos && githubStats.pinnedRepos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {githubStats.pinnedRepos.slice(0, 4).map((repo) => (
                    <a
                      key={repo.url}
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl border border-blue-950/40 bg-[#0f172a]/30 p-4 transition-all hover:scale-[1.01] hover:border-sky-500/30 flex flex-col justify-between min-h-[120px] shadow-lg"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-sm text-white break-all">{repo.name}</h3>
                          <ExternalLink className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        </div>
                        {repo.description && (
                          <p className="mt-2 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            {repo.description}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] text-slate-400 font-semibold">
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3 w-3 text-slate-400" /> {repo.stargazerCount}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3 w-3 text-slate-400" /> {repo.forkCount}
                        </span>
                        {repo.primaryLanguage ? (
                          <span className="inline-flex items-center gap-1">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: repo.primaryLanguage.color || "#999" }}
                            />
                            {repo.primaryLanguage.name}
                          </span>
                        ) : null}
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="flex h-44 items-center justify-center text-sm text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                  No pinned repositories found.
                </div>
              )}
            </article>
          </section>
        )}

        {/* ==================== EXPERIENCE & EDUCATION ==================== */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Experience Card */}
          {experiences.length > 0 && (
            <article className={`rounded-[32px] p-5 sm:p-6 ${theme.card} w-full overflow-hidden`}>
              <div className="flex items-center gap-2.5 text-sky-400 mb-6">
                <Briefcase className="h-5 w-5" />
                <h2 className="font-heading text-lg font-bold text-white">Experience</h2>
              </div>
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-6 border-l border-slate-800/80 last:border-l-0 pb-2 w-full min-w-0">
                    <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-sky-400" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5 mb-1 w-full min-w-0">
                      <h3 className="font-heading text-base font-extrabold text-sky-400 break-words">{exp.role}</h3>
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-semibold shrink-0">
                        <Calendar className="h-3.5 w-3.5 text-sky-400/80" />
                        {formatMonthYear(exp.startDate)} - {exp.isCurrent ? "Present" : formatMonthYear(exp.endDate)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-200 mb-3 break-words">
                      {exp.company}
                      {exp.location ? ` · ${exp.location}` : ""}
                    </p>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc space-y-1.5 pl-4 text-xs text-slate-300 leading-relaxed">
                        {exp.bullets.map((bullet, idx) => {
                          if (isTechStackBullet(bullet)) {
                            const firstColon = bullet.indexOf(":");
                            const label = firstColon !== -1 ? bullet.substring(0, firstColon + 1) : bullet;
                            const content = firstColon !== -1 ? bullet.substring(firstColon + 1) : "";
                            return (
                              <li key={idx} className="list-none -ml-4 mt-3 break-words">
                                <span className="text-slate-400 font-bold">{label} </span>
                                <span className="text-slate-300 font-semibold">{content}</span>
                              </li>
                            );
                          }
                          return (
                            <li key={idx} className="marker:text-sky-400/80 break-words">
                              {bullet}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
              {resume?.fileUrl && (
                <a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-sky-400 hover:underline"
                >
                  View Full Experience <ArrowRight className="h-3 w-3" />
                </a>
              )}
            </article>
          )}

          {/* Education Card */}
          {educations && educations.length > 0 && (
            <article className={`rounded-[32px] p-5 sm:p-6 ${theme.card} w-full overflow-hidden`}>
              <div className="flex items-center gap-2.5 text-sky-400 mb-6">
                <GraduationCap className="h-5 w-5" />
                <h2 className="font-heading text-lg font-bold text-white">Education</h2>
              </div>
              <div className="space-y-6">
                {educations.map((edu) => (
                  <div key={edu.id} className="relative pl-6 border-l border-slate-800/80 last:border-l-0 pb-2 w-full min-w-0">
                    <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-sky-400" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5 mb-1 w-full min-w-0">
                      <h3 className="font-heading text-base font-extrabold text-sky-400 break-words">{edu.school}</h3>
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-semibold shrink-0">
                        <Calendar className="h-3.5 w-3.5 text-sky-400/80" />
                        {formatMonthYear(edu.startDate)} - {edu.isCurrent ? "Present" : formatMonthYear(edu.endDate)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-200 mb-2 break-words">
                      {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}
                    </p>
                    {edu.score && (
                      <p className="text-xs font-bold text-sky-400 break-words">
                        {edu.scoreType || "CGPA"}: {edu.score}
                      </p>
                    )}
                    {edu.description && (
                      <p className="mt-2 text-xs text-slate-400 leading-relaxed break-words">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
              {resume?.fileUrl && (
                <a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-sky-400 hover:underline"
                >
                  View Full Education <ArrowRight className="h-3 w-3" />
                </a>
              )}
            </article>
          )}
        </section>

        {/* ==================== SKILLS & TECHNOLOGIES ==================== */}
        {profileSkills && profileSkills.length > 0 && (
          <section className="rounded-[32px] p-5 sm:p-6 bg-[#0a0f1d]/75 backdrop-blur-xl border border-blue-950/40 shadow-2xl mt-8 w-full overflow-hidden">
            <div className="flex items-center gap-2.5 text-sky-400 mb-6">
              <Code2 className="h-5 w-5" />
              <h2 className="font-heading text-lg font-bold text-white">Skills & Technologies</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {profileSkills.map((group) => (
                <article key={group.id} className="rounded-2xl border border-blue-950/40 bg-[#0f172a]/30 p-4 transition-all hover:scale-[1.01] hover:border-sky-500/30 flex flex-col justify-between shadow-lg w-full overflow-hidden">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      {getSkillCategoryIcon(group.category)}
                      <h3 className="font-heading text-xs font-black text-white uppercase tracking-wider break-words">{group.category}</h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.skills.map((skill) => (
                        <span
                          key={skill}
                          className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold break-words ${theme.badge}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ==================== FEATURED PROJECTS ==================== */}
        {sortedProjects.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5 text-sky-400">
                <FolderKanban className="h-5 w-5" />
                <h2 className="font-heading text-lg font-bold text-white">Featured Projects</h2>
              </div>
              <a
                href={`https://github.com/${githubStats?.githubUsername || ""}?tab=repositories`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-sky-400 font-bold hover:underline flex items-center gap-1"
              >
                View all projects <ArrowRight className="h-3 w-3" />
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProjects.map((project, idx) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] p-5 sm:p-6 bg-[#0a0f1d]/75 backdrop-blur-xl border border-blue-950/40 shadow-2xl transition-all hover:scale-[1.01] hover:border-sky-500/30 min-h-[220px] w-full"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 w-full min-w-0">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {getProjectIcon(project.title)}
                        <h3 className="font-heading text-base font-extrabold text-white break-words min-w-0">{project.title}</h3>
                      </div>
                      {project.isPinned && (
                        <Star className="h-4 w-4 fill-current text-sky-400 shrink-0" />
                      )}
                    </div>
                    {project.bullets && project.bullets.length > 0 && (
                      <ul className="mt-4 list-disc space-y-1.5 pl-4 text-xs text-slate-300 leading-relaxed">
                        {project.bullets.map((bullet, index) => (
                          <li key={`${project.id}-bullet-${index}`} className="marker:text-sky-400/80 break-words">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                    {project.techTags && project.techTags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.techTags.map((tag) => (
                          <span
                            key={tag}
                            className={`rounded-lg border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${theme.badge} border-opacity-35 break-words`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-800/60 pt-4">
                    <div className="flex items-center gap-3">
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 transition-colors hover:text-sky-400"
                          title="View Repository"
                        >
                          <FaGithub className="h-5 w-5" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 transition-colors hover:text-sky-400"
                          title="Live Demo"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      )}
                      {project.videoUrl && (
                        <a
                          href={project.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 transition-colors hover:text-sky-400"
                          title="Video Link"
                        >
                          <FaYoutube className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                    {(project.repoUrl || project.liveUrl || project.videoUrl) && (
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        View Project
                      </span>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        {/* ==================== ACHIEVEMENTS ==================== */}
        {achievements && achievements.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center gap-2.5 text-sky-400 mb-6">
              <Trophy className="h-5 w-5" />
              <h2 className="font-heading text-lg font-bold text-white">Achievements</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <article key={achievement.id} className="flex items-start gap-4 rounded-3xl p-4 sm:p-5 bg-[#0a0f1d]/75 backdrop-blur-xl border border-blue-950/40 shadow-2xl w-full overflow-hidden">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-950/40 border border-sky-500/20 text-sky-400">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading text-sm font-bold text-white break-words">{achievement.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-x-2 items-center text-xs text-slate-400 font-semibold">
                      {achievement.provider && <span className="break-words">{achievement.provider}</span>}
                      {achievement.provider && achievement.date && <span>·</span>}
                      {achievement.date && (
                        <span>{formatMonthYear(achievement.date)}</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ==================== DYNAMIC FOOTER SECTIONS ==================== */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border-t border-slate-800/60 pt-8 w-full">
          {/* Column 1: Custom Section / Languages */}
          <div className="w-full min-w-0">
            {customSections && customSections.length > 0 ? (
              customSections.map((section) => (
                <div key={section.id} className="mb-6 last:mb-0 w-full min-w-0">
                  <div className="flex items-center gap-2 mb-4 text-sky-400 w-full min-w-0">
                    <Globe2 className="h-5 w-5 text-sky-400 shrink-0" />
                    <h3 className="font-heading text-base font-bold text-white break-words min-w-0">{section.title}</h3>
                  </div>
                  <div className="rounded-3xl p-4 sm:p-5 bg-[#0a0f1d]/75 backdrop-blur-xl border border-blue-950/40 shadow-2xl w-full">
                    <ul className="list-disc space-y-1.5 pl-4 text-xs text-slate-300 leading-relaxed">
                      {section.bullets.map((bullet, idx) => (
                        <li key={idx} className="marker:text-sky-400/80 break-words">{bullet}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full">
                <h3 className="font-heading text-base font-bold text-white mb-4 break-words">Connect</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold break-words">
                  Open to exciting full-stack development, software engineering, and contract opportunities. Feel free to download my resume or follow my socials!
                </p>
              </div>
            )}
          </div>

          {/* Column 2: Connect Message */}
          <div className="flex flex-col justify-between min-h-[120px] w-full min-w-0">
            <div>
              <div className="flex items-center gap-2 mb-4 text-sky-400 w-full">
                <Users className="h-5 w-5 text-sky-400 shrink-0" />
                <h3 className="font-heading text-base font-bold text-white break-words">Connect with {displayFullName.split(" ")[0]}</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-semibold break-words">
                Thank you for visiting my portfolio card! Let's build something awesome together.
              </p>
            </div>
            <p className="text-[10px] text-slate-500 font-bold mt-6 md:mt-0">
              Built with ❤️ using React & Tailwind CSS
            </p>
          </div>

          {/* Column 3: Quick Links List */}
          <div className="w-full min-w-0">
            <h3 className="font-heading text-base font-bold text-white mb-4">Quick Links</h3>
            <div className="space-y-2.5">
              {socialLinks.map((link) => {
                const platform = link.platform.replace(/_/g, " ");
                const label = platform.charAt(0) + platform.slice(1).toLowerCase();
                return (
                  <div key={link.id} className="flex items-center gap-2 text-xs">
                    <span className="text-sky-400 font-bold">#</span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-300 hover:text-sky-400 transition-colors font-semibold break-all"
                    >
                      {label}: {link.url.replace(/^https?:\/\/(www\.)?/i, "")}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
