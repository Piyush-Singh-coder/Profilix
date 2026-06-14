import { prisma } from "../config/database";
import { NotFoundError } from "../utils/errors";
import { trackEvent } from "./analytics.service";

export const getPublicProfile = async (username: string, mode?: string, viewerId?: string) => {
  const user = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
    include: {
      profile: {
        include: {
          techStacks: {
            include: { tech: true },
            orderBy: { assignedAt: "asc" },
          },
        },
      },
      projects: {
        orderBy: [{ isPinned: "desc" }, { displayOrder: "asc" }],
      },
      experiences: {
        orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
      },
      achievements: {
        orderBy: [{ displayOrder: "asc" }, { date: "desc" }],
      },
      educations: {
        orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
      },
      githubStats: true,
      socialLinks: true,
      resume: { select: { fileUrl: true, updatedAt: true } },
      customSections: {
        orderBy: { displayOrder: "asc" },
      },
      profileSkills: {
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  if (!user || !user.profile) throw new NotFoundError("Profile");
  if (!user.profile.isPublic) throw new NotFoundError("Profile");

  // Track profile view — fire and forget
  trackEvent(user.id, "PROFILE_VIEW");

  // Filter social links based on viewing mode
  const isRecruiterMode = mode === "hire";
  const filteredLinks = user.socialLinks.filter(
    (link: { visibleInRecruiter: boolean; visibleInDefault: boolean }) =>
      isRecruiterMode ? link.visibleInRecruiter : link.visibleInDefault
  );

  // Upvote statistics
  const upvoteCount = await prisma.profileLike.count({
    where: { profileId: user.profile.id },
  });

  let hasLiked = false;
  if (viewerId) {
    const like = await prisma.profileLike.findUnique({
      where: {
        likerId_profileId: {
          likerId: viewerId,
          profileId: user.profile.id,
        },
      },
    });
    hasLiked = !!like;
  }

  // Shape the response differently per mode
  const base = {
    username: user.username,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    profile: user.profile,
    techStacks: user.profile.techStacks.map((pt: { tech: unknown }) => pt.tech),
    socialLinks: filteredLinks,
    resume: user.resume,
    experiences: user.experiences,
    achievements: user.achievements,
    educations: user.educations,
    githubStats: user.githubStats,
    customSections: user.customSections,
    profileSkills: user.profileSkills,
    upvoteCount,
    hasLiked,
  };

  if (isRecruiterMode) {
    // Recruiter view: resume and LinkedIn first
    return {
      ...base,
      viewMode: "hire",
      projects: user.projects,
    };
  }

  // Default peer view
  return {
    ...base,
    viewMode: "default",
    projects: user.projects,
  };
};

export const getCommunityProfiles = async ({
  page,
  limit,
  search,
  status,
  tech,
  viewerId,
}: {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  tech?: string;
  viewerId?: string;
}) => {
  const skip = (page - 1) * limit;
  const take = limit;

  // Build Prisma filter query
  const where: any = {
    isPublic: true,
  };

  if (status && status !== "ALL") {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { displayName: { contains: search, mode: "insensitive" } },
      { bio: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      {
        user: {
          OR: [
            { username: { contains: search, mode: "insensitive" } },
            { fullName: { contains: search, mode: "insensitive" } },
          ],
        },
      },
    ];
  }

  if (tech && tech !== "ALL") {
    const techObj = await prisma.techStack.findFirst({
      where: { slug: { equals: tech, mode: "insensitive" } },
    });
    const matchName = techObj ? techObj.name : tech;

    where.user = {
      profileSkills: {
        some: {
          skills: {
            has: matchName,
          },
        },
      },
    };
  }

  const [profiles, totalCount] = await Promise.all([
    prisma.profile.findMany({
      where,
      skip,
      take,
      include: {
        user: {
          select: {
            username: true,
            fullName: true,
            avatarUrl: true,
            profileSkills: {
              select: {
                skills: true,
              },
            },
            githubStats: {
              select: {
                totalStars: true,
                followers: true,
                avatarUrl: true,
              },
            },
            _count: {
              select: {
                projects: true,
                experiences: true,
                achievements: true,
              },
            },
            socialLinks: {
              select: {
                platform: true,
                url: true,
              },
            },
          },
        },
        // techStacks is deprecated, skills are retrieved from user.profileSkills instead
        _count: {
          select: {
            likesReceived: true,
          },
        },
      },
      orderBy: [
        {
          likesReceived: {
            _count: "desc",
          },
        },
        {
          createdAt: "desc",
        },
      ],
    }),
    prisma.profile.count({ where }),
  ]);

  // If a logged-in viewer is browsing, check which profiles they've upvoted
  let likedProfileIds = new Set<string>();
  if (viewerId) {
    const likes = await prisma.profileLike.findMany({
      where: {
        likerId: viewerId,
        profileId: { in: profiles.map((p) => p.id) },
      },
      select: { profileId: true },
    });
    likedProfileIds = new Set(likes.map((l) => l.profileId));
  }

  const items = profiles.map((p) => ({
    id: p.id,
    displayName: p.displayName,
    headline: p.headline,
    bio: p.bio,
    status: p.status,
    statusCustomText: p.statusCustomText,
    location: p.location,
    isPublic: p.isPublic,
    theme: p.theme,
    cardTheme: p.cardTheme,
    username: p.user.username,
    fullName: p.user.fullName,
    avatarUrl: p.user.avatarUrl || p.user.githubStats?.avatarUrl || null,
    skills: p.user.profileSkills.flatMap((ps) => ps.skills),
    upvoteCount: p._count.likesReceived,
    hasLiked: likedProfileIds.has(p.id),
    githubStars: p.user.githubStats?.totalStars || 0,
    githubFollowers: p.user.githubStats?.followers || 0,
    projectCount: p.user._count.projects,
    experienceCount: p.user._count.experiences,
    achievementCount: p.user._count.achievements,
    socialLinks: p.user.socialLinks,
  }));

  return {
    profiles: items,
    pagination: {
      total: totalCount,
      page,
      limit,
      pages: Math.ceil(totalCount / limit),
    },
  };
};

export const getTechStacks = async () => {
  return prisma.techStack.findMany({
    orderBy: { name: "asc" },
  });
};
