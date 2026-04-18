"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  CalendarDays,
  ExternalLink,
  FileDown,
  FolderKanban,
  GitBranch,
  Link as LinkIcon,
  MapPin,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
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

const PUBLIC_THEMES: Record<string, ThemeToken> = {
  GLASS: {
    root: "bg-[#070c19] text-white",
    canvas: "from-[#1a2a4a66] via-[#121d33] to-[#0a101f]",
    card: "glass-panel",
    muted: "text-[#a8b6d8]",
    accent: "text-[#78d4ff]",
    badge: "bg-[#78d4ff]/15 text-[#78d4ff]",
  },
  BRUTALISM: {
    root: "bg-[#f9f7f0] text-[#111111]",
    canvas: "from-[#f6f2e8] via-[#faf8f2] to-[#f1ece0]",
    card: "theme-brutal-card bg-white",
    muted: "text-[#2f2f2f]",
    accent: "text-[#111111]",
    badge: "bg-[#ffd84c] text-[#111111]",
  },
  CLAY: {
    root: "bg-[#f6f2ea] text-[#2e241f]",
    canvas: "from-[#f4eadc] via-[#f6f2ea] to-[#efe6da]",
    card: "bg-[#fff9ef] border border-[#ddcdbb] rounded-[28px] shadow-[0_18px_35px_rgba(104,79,57,0.18)]",
    muted: "text-[#6f5f58]",
    accent: "text-[#d56b46]",
    badge: "bg-[#e76d4720] text-[#b55334]",
  },
  MINIMAL: {
    root: "bg-[#f7f7f7] text-[#141414]",
    canvas: "from-[#ffffff] via-[#f7f7f7] to-[#efefef]",
    card: "bg-white border border-[#d8d8d8] rounded-2xl",
    muted: "text-[#666666]",
    accent: "text-[#202020]",
    badge: "bg-[#14141412] text-[#141414]",
  },
  NEON: {
    root: "bg-[#0a0014] text-white",
    canvas: "from-[#1a0038] via-[#0f0020] to-[#050008]",
    card: "bg-[#1a0038]/60 border border-[#ff00ff30] rounded-2xl shadow-[0_0_30px_rgba(255,0,255,0.08)] backdrop-blur-sm",
    muted: "text-[#c084fc]",
    accent: "text-[#e879f9]",
    badge: "bg-[#e879f920] text-[#e879f9]",
  },
  RETRO: {
    root: "bg-[#0d0d0d] text-[#00ff41]",
    canvas: "from-[#0a0a0a] via-[#0d0d0d] to-[#111111]",
    card: "bg-[#111111] border border-[#00ff4130] rounded-lg shadow-[0_0_15px_rgba(0,255,65,0.06)]",
    muted: "text-[#00cc33]",
    accent: "text-[#00ff41]",
    badge: "bg-[#00ff4115] text-[#00ff41]",
  },
  AURORA: {
    root: "bg-[#0a1628] text-white",
    canvas: "from-[#0d3b66] via-[#0a2540] to-[#061522]",
    card: "bg-[#0d2b4e]/70 border border-[#2dd4bf20] rounded-2xl shadow-[0_0_25px_rgba(45,212,191,0.06)] backdrop-blur-sm",
    muted: "text-[#67b8d4]",
    accent: "text-[#2dd4bf]",
    badge: "bg-[#2dd4bf18] text-[#2dd4bf]",
  },
  SKEUOMORPHIC: {
    root: "bg-[#12141d] text-[#f2f2f7]",
    canvas: "from-[#1a1c25] via-[#12141d] to-[#0c0d12]",
    card: "bg-gradient-to-b from-[#1c1f2b] to-[#161822] border border-[#ffffff0a] rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.4)]",
    muted: "text-[#a1a1aa]",
    accent: "text-[#c3a069]",
    badge: "bg-[#c3a06920] text-[#c3a069]",
  },
};

function formatMonthYear(date?: string | null) {
  if (!date) return "Present";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Present";
  return parsed.toLocaleString("en-US", { month: "short", year: "numeric" });
}

export default function ProfileContent({ initialUsername, initialProfile }: ProfileContentProps) {
  useEffect(() => {
    if (!initialProfile?.profile?.theme) return;
    const previousTheme = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", initialProfile.profile.theme);
    return () => {
      if (previousTheme) {
        document.documentElement.setAttribute("data-theme", previousTheme);
      } else {
        document.documentElement.setAttribute("data-theme", "GLASS");
      }
    };
  }, [initialProfile?.profile?.theme]);

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

  const { fullName, avatarUrl, profile, socialLinks, projects, experiences, techStacks, resume, githubStats } =
    initialProfile;


  const theme = PUBLIC_THEMES[profile.theme] || PUBLIC_THEMES.GLASS;


  return (
    <div className={`min-h-screen ${theme.root}`}>
      <div className={`fixed inset-0 -z-10 bg-gradient-to-br ${theme.canvas}`} />
      <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-14 sm:px-8 sm:pt-16">
        <motion.header
          className={`rounded-[32px] p-8 sm:p-10 ${theme.card}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border border-border bg-surface-high">
              <Image
                src={avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${initialUsername}`}
                alt={fullName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <p
                className={`mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${theme.badge}`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {profile.theme} Theme
              </p>
              <h1 className="font-heading text-4xl font-black sm:text-5xl">{fullName}</h1>
              <p className={`mt-2 text-sm ${theme.muted}`}>@{initialUsername}</p>
              {profile.headline ? <p className="mt-4 text-lg font-medium">{profile.headline}</p> : null}
              {profile.bio ? <p className={`mt-3 max-w-3xl text-sm leading-relaxed ${theme.muted}`}>{profile.bio}</p> : null}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {profile.location ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.location}
                  </span>
                ) : null}
                {resume?.fileUrl ? (
                  <a
                    href={resume.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white"
                  >
                    <FileDown className="h-3.5 w-3.5" />
                    Resume
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </motion.header>



        {githubStats ? (
          <section className="mt-8">
            <h2 className="font-heading text-2xl font-bold">GitHub Activity</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <article className={`rounded-2xl p-5 ${theme.card}`}>
                <p className={`text-xs uppercase tracking-[0.15em] ${theme.muted}`}>GitHub Username</p>
                <p className="mt-2 text-lg font-semibold">{githubStats.githubUsername}</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div>
                    <p className={`text-xs ${theme.muted}`}>Repos</p>
                    <p className="text-base font-bold">{githubStats.totalRepos}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${theme.muted}`}>Stars</p>
                    <p className="text-base font-bold">{githubStats.totalStars}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${theme.muted}`}>Forks</p>
                    <p className="text-base font-bold">{githubStats.totalForks}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {githubStats.followers} followers
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {githubStats.following} following
                  </span>
                </div>
              </article>

              <article className={`rounded-2xl p-5 lg:col-span-2 ${theme.card}`}>
                <p className={`text-xs uppercase tracking-[0.15em] ${theme.muted}`}>Contribution Graph</p>
                {contributionCells.length > 0 ? (
                  <div className="mt-3 grid grid-cols-20 gap-1">
                    {contributionCells.map((day, index) => (
                      <div
                        key={`${day.date}-${index}`}
                        title={`${day.date}: ${day.contributionCount} contributions`}
                        className="h-3 w-3 rounded-[2px]"
                        style={{ backgroundColor: day.color || "#d1d5db" }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className={`mt-3 text-sm ${theme.muted}`}>
                    Contributions are available after syncing with a GitHub token.
                  </p>
                )}
                {githubStats.contributions?.totalContributions !== undefined ? (
                  <p className={`mt-3 text-xs ${theme.muted}`}>
                    Total contributions: {githubStats.contributions.totalContributions}
                  </p>
                ) : null}
              </article>
            </div>

            <h2 className="font-heading text-2xl font-bold">Pinned Repos</h2>
            {githubStats.pinnedRepos && githubStats.pinnedRepos.length > 0 ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {githubStats.pinnedRepos.slice(0, 4).map((repo) => (
                  <a
                    key={repo.url}
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`rounded-2xl p-4 transition-transform hover:-translate-y-0.5 ${theme.card}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold">{repo.name}</h3>
                      <ExternalLink className={`h-4 w-4 ${theme.accent}`} />
                    </div>
                    <p className={`mt-2 text-sm ${theme.muted}`}>{repo.description}</p>
                    <div className="mt-3 flex items-center gap-3 text-xs">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5" /> {repo.stargazerCount}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GitBranch className="h-3.5 w-3.5" /> {repo.forkCount}
                      </span>
                      {repo.primaryLanguage ? (
                        <span className={`inline-flex items-center gap-1 ${theme.muted}`}>
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: repo.primaryLanguage.color || "#999" }}
                          />
                          {repo.primaryLanguage.name}
                        </span>
                      ) : null}
                    </div>
                  </a>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        {experiences.length > 0 ? (
          <section className="mt-12">
            <h2 className="font-heading text-2xl font-bold">Experience Timeline</h2>
            <div className="mt-4 space-y-4">
              {experiences.map((experience) => (
                <article key={experience.id} className={`rounded-2xl p-5 ${theme.card}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-heading text-lg font-semibold">{experience.role}</h3>
                      <p className={`text-sm ${theme.muted}`}>{experience.company}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs ${theme.muted}`}>
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatMonthYear(experience.startDate)} -{" "}
                      {experience.isCurrent ? "Present" : formatMonthYear(experience.endDate)}
                    </span>
                  </div>
                  {experience.description ? <p className={`mt-3 text-sm ${theme.muted}`}>{experience.description}</p> : null}
                  {experience.bullets && experience.bullets.length > 0 ? (
                    <ul className="mt-3 list-disc space-y-1 pl-4 text-xs">
                      {experience.bullets.slice(0, 4).map((bullet, index) => (
                        <li key={`${experience.id}-experience-bullet-${index}`}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {techStacks.length > 0 ? (
          <section className="mt-12">
            <h2 className="font-heading text-2xl font-bold">Tech Stack</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-border py-3">
              <div className="flex animate-marquee gap-3 whitespace-nowrap px-3">
                {[...techStacks, ...techStacks].map((tech, index) => (
                  <span
                    key={`${tech.id}-${index}`}
                    className={`inline-flex items-center rounded-full border border-border px-3 py-1 text-xs ${theme.badge}`}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {sortedProjects.length > 0 ? (
          <section className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold">Featured Projects</h2>
              <FolderKanban className={`h-6 w-6 ${theme.accent} opacity-50`} />
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedProjects.map((project, idx) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-[24px] p-6 transition-all hover:scale-[1.02] ${theme.card}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-heading text-xl font-black">{project.title}</h3>
                      {project.isPinned && (
                        <Star className={`h-4 w-4 fill-current ${theme.accent}`} />
                      )}
                    </div>
                    {project.description && (
                      <p className={`mt-3 line-clamp-3 text-sm leading-relaxed ${theme.muted}`}>
                        {project.description}
                      </p>
                    )}
                    {project.techTags && project.techTags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.techTags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className={`rounded-full border border-border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${theme.badge} border-opacity-30`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border border-opacity-50 pt-4">
                    <div className="flex items-center gap-3">
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex h-9 w-9 items-center justify-center rounded-full border border-border transition-all hover:bg-surface-high ${theme.accent}`}
                          title="View Repository"
                        >
                          <GitBranch className="h-4.5 w-4.5" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex h-9 w-9 items-center justify-center rounded-full border border-border transition-all hover:bg-surface-high ${theme.accent}`}
                          title="Live Demo"
                        >
                          <ExternalLink className="h-4.5 w-4.5" />
                        </a>
                      )}
                    </div>
                    {(project.repoUrl || project.liveUrl) && (
                      <div className={`text-[10px] font-bold uppercase tracking-widest ${theme.muted}`}>
                        View Details
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        ) : null}



        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className={`rounded-2xl px-4 py-3 transition-transform hover:-translate-y-0.5 ${theme.card}`}
            >
              <p className={`text-xs uppercase tracking-[0.15em] ${theme.muted}`}>{link.platform}</p>
              <p className={`mt-1 line-clamp-1 text-sm font-semibold ${theme.accent}`}>
                {link.url.replace(/^https?:\/\/(www\.)?/i, "")}
              </p>
            </a>
          ))}
        </section>

        <footer className={`mt-14 rounded-2xl p-6 ${theme.card}`}>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-heading text-lg font-semibold">Connect with {fullName.split(" ")[0]}</p>
              <p className={`mt-1 text-sm ${theme.muted}`}>
                Built with Profilix - {socialLinks.length} social links - {projects.length} projects
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs hover:bg-surface-high"
            >
              <LinkIcon className="h-3.5 w-3.5" />
              Create your own
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
