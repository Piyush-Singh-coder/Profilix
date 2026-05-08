"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  CalendarDays,
  ExternalLink,
  FileDown,
  FolderKanban,
  Link as LinkIcon,
  MapPin,
  Sparkles,
  Star,
  Users,
  Award
} from "lucide-react";
import { FaYoutube, FaGithub } from "react-icons/fa";
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


function formatMonthYear(date?: string | null) {
  if (!date) return "Present";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Present";
  return parsed.toLocaleString("en-US", { month: "short", year: "numeric" });
}

export default function ProfileContent({ initialUsername, initialProfile }: ProfileContentProps) {
  useEffect(() => {
    // Respect the user's saved global theme preference (LIGHT/DARK)
    const userPreferredTheme = initialProfile?.profile?.theme?.toLowerCase() || "dark";
    
    const previousTheme = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", userPreferredTheme);

    return () => {
      if (previousTheme) {
        document.documentElement.setAttribute("data-theme", previousTheme);
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
    };
  }, [initialProfile?.profile?.theme]);

  // Dynamic Theme Generation based on both cardTheme and global theme
  const theme = useMemo(() => {
    const cardTheme = initialProfile?.profile?.cardTheme || "GLASS";
    const isDark = initialProfile?.profile?.theme === "DARK";

    const themes: Record<string, ThemeToken> = {
      GLASS: {
        root: isDark ? "bg-background text-text-primary" : "bg-slate-50 text-slate-900",
        canvas: isDark 
          ? "from-[#0B0F1A] via-[#0F172A] to-[#0B0F1A]" 
          : "from-slate-50 via-slate-100 to-slate-50",
        card: isDark 
          ? "glass-panel border-white/10" 
          : "bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-xl shadow-slate-200/50",
        muted: isDark ? "text-text-secondary" : "text-slate-500",
        accent: "text-primary",
        badge: isDark ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary",
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

  const { fullName, avatarUrl, profile, socialLinks, projects, experiences, techStacks, resume, githubStats, achievements } =
    initialProfile;

  const displayFullName = profile?.displayName || fullName;





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
                alt={displayFullName}
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
                {profile.cardTheme || "GLASS"} Theme
              </p>
              <h1 className="font-heading text-4xl font-black sm:text-5xl">{displayFullName}</h1>
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
                        <FaGithub className="h-3.5 w-3.5" /> {repo.forkCount}
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
                    {project.bullets && project.bullets.length > 0 && (
                      <ul className={`mt-3 list-disc space-y-1 pl-4 text-xs ${theme.muted}`}>
                        {project.bullets.slice(0, 4).map((bullet, index) => (
                          <li key={`${project.id}-bullet-${index}`}>{bullet}</li>
                        ))}
                      </ul>
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
                    <div className="flex items-center gap-2">
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex h-9 w-9 items-center justify-center rounded-full border border-border transition-all hover:bg-surface-high ${theme.accent}`}
                          title="View Repository"
                        >
                          <FaGithub className="h-4.5 w-4.5" />
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
                      {project.videoUrl && (
                        <a
                          href={project.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex h-9 w-9 items-center justify-center rounded-full border border-border transition-all hover:bg-surface-high ${theme.accent}`}
                          title="Video Link"
                        >
                          <FaYoutube className="h-4.5 w-4.5" />
                        </a>
                      )}
                    </div>
                    {(project.repoUrl || project.liveUrl || project.videoUrl) && (
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

        {achievements && achievements.length > 0 ? (
          <section className="mt-12">
            <h2 className="font-heading text-2xl font-bold">Achievements</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {achievements.map((achievement) => (
                <article key={achievement.id} className={`flex items-start gap-4 rounded-2xl p-5 ${theme.card}`}>
                  <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-high ${theme.accent}`}>
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading text-lg font-semibold">{achievement.title}</h3>
                    {achievement.provider && <p className={`mt-0.5 text-sm ${theme.muted}`}>{achievement.provider}</p>}
                    {achievement.description && (
                      <p className={`mt-2 text-xs leading-relaxed ${theme.muted}`}>{achievement.description}</p>
                    )}
                    <div className="mt-3 flex items-center justify-between text-xs">
                      {achievement.date && (
                        <span className={`inline-flex items-center gap-1 ${theme.muted}`}>
                          <CalendarDays className="h-3 w-3" />
                          {formatMonthYear(achievement.date)}
                        </span>
                      )}
                      {achievement.url && (
                        <a
                          href={achievement.url}
                          target="_blank"
                          rel="noreferrer"
                          className={`inline-flex items-center gap-1 font-medium hover:underline ${theme.accent}`}
                        >
                          View Credential <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
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
              <p className="font-heading text-lg font-semibold">Connect with {displayFullName.split(" ")[0]}</p>
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
