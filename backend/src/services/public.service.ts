import { prisma } from "../config/database";
import { NotFoundError } from "../utils/errors";
import { trackEvent } from "./analytics.service";

export const getPublicProfile = async (username: string, mode?: string) => {
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
