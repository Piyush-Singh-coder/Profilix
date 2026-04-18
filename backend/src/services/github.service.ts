import { prisma } from "../config/database";
import { env } from "../config/env";
import { BadRequestError } from "../utils/errors";
import { Prisma } from "@prisma/client";

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

interface GitHubUserREST {
  login: string;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

interface GitHubPinnedRepo {
  name: string;
  description: string | null;
  url: string;
  primaryLanguage: { name: string; color: string } | null;
  stargazerCount: number;
  forkCount: number;
}

interface GitHubContributionWeek {
  contributionDays: { contributionCount: number; date: string; color: string }[];
}

/**
 * Fetches user stats from GitHub REST API and GraphQL API, then caches them.
 * Uses backend GITHUB_TOKEN if available for higher rate limits.
 */
export const syncGitHubStats = async (userId: string, githubUsername: string) => {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Profilix-App",
  };
  if (env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${env.GITHUB_TOKEN}`;
  }

  // ── 1. REST: Basic user info + repo count ──────────────────────────────
  const userRes = await fetch(
    `https://api.github.com/users/${githubUsername}`,
    { headers }
  );
  if (!userRes.ok) {
    if (userRes.status === 404) throw new BadRequestError("GitHub username not found");
    if (userRes.status === 403) throw new BadRequestError("GitHub API rate limit hit. Please add a GITHUB_TOKEN.");
    throw new BadRequestError("Failed to fetch GitHub user data");
  }
  const ghUser = (await userRes.json()) as GitHubUserREST;

  // ── 2. REST: Calculate total stars across repos ─────────────────────────
  let totalStars = 0;
  let totalForks = 0;
  try {
    const reposRes = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`,
      { headers }
    );
    if (reposRes.ok) {
      const repos = (await reposRes.json()) as { stargazers_count: number; forks_count: number }[];
      totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
      totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
    }
  } catch (_) {}

  // ── 3. GraphQL: Contribution history + pinned repos ────────────────────
  let contributions = null;
  let pinnedRepos: GitHubPinnedRepo[] = [];

  if (env.GITHUB_TOKEN) {
    const graphqlQuery = {
      query: `
        query($login: String!) {
          user(login: $login) {
            pinnedItems(first: 6, types: REPOSITORY) {
              nodes {
                ... on Repository {
                  name
                  description
                  url
                  primaryLanguage { name color }
                  stargazerCount
                  forkCount
                }
              }
            }
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                    color
                  }
                }
              }
            }
          }
        }
      `,
      variables: { login: githubUsername },
    };

    const gqlRes = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { ...(headers as Record<string, string>), "Content-Type": "application/json" },
      body: JSON.stringify(graphqlQuery),
    });

    if (gqlRes.ok) {
      const gqlData = (await gqlRes.json()) as { data?: { user?: any } };
      const gqlUser = gqlData.data?.user;
      if (gqlUser) {
        pinnedRepos = gqlUser.pinnedItems?.nodes ?? [];
        contributions = gqlUser.contributionsCollection?.contributionCalendar ?? null;
      }
    }
  }

  // ── 4. Upsert cache in DB ──────────────────────────────────────────────
  const stats = await prisma.gitHubStats.upsert({
    where: { userId },
    create: {
      userId,
      githubUsername: ghUser.login,
      totalRepos: ghUser.public_repos,
      totalStars,
      totalForks,
      followers: ghUser.followers,
      following: ghUser.following,
      contributions: contributions ? (contributions as any) : Prisma.DbNull,
      pinnedRepos: pinnedRepos.length > 0 ? (pinnedRepos as any) : Prisma.DbNull,
      avatarUrl: ghUser.avatar_url,
      bio: ghUser.bio,
      company: ghUser.company,
      blog: ghUser.blog,
      location: ghUser.location,
      lastSynced: new Date(),
    },
    update: {
      githubUsername: ghUser.login,
      totalRepos: ghUser.public_repos,
      totalStars,
      totalForks,
      followers: ghUser.followers,
      following: ghUser.following,
      contributions: contributions ? (contributions as any) : Prisma.DbNull,
      pinnedRepos: pinnedRepos.length > 0 ? (pinnedRepos as any) : Prisma.DbNull,
      avatarUrl: ghUser.avatar_url,
      bio: ghUser.bio,
      company: ghUser.company,
      blog: ghUser.blog,
      location: ghUser.location,
      lastSynced: new Date(),
    },
  });

  return stats;
};

/**
 * Get cached stats, or refresh if stale (> 6h).
 */
export const getOrSyncGitHubStats = async (userId: string, githubUsername: string) => {
  const cached = await prisma.gitHubStats.findUnique({ where: { userId } });

  if (cached) {
    const ageMs = Date.now() - cached.lastSynced.getTime();
    if (ageMs < CACHE_TTL_MS && cached.githubUsername === githubUsername) {
      return { stats: cached, fromCache: true };
    }
  }

  const stats = await syncGitHubStats(userId, githubUsername);
  return { stats, fromCache: false };
};

/**
 * Get stored stats without refreshing.
 */
export const getGitHubStats = async (userId: string) => {
  return prisma.gitHubStats.findUnique({ where: { userId } });
};
