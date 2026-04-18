import { prisma } from "../config/database";
import { NotFoundError, BadRequestError, ForbiddenError } from "../utils/errors";
import { CreateProjectInput, UpdateProjectInput } from "../validators/project.validator";
import { Prisma } from "@prisma/client";

const MAX_PINNED = 3;

export const getProjects = async (userId: string) => {
  return prisma.project.findMany({
    where: { userId },
    orderBy: [{ isPinned: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
  });
};

export const createProject = async (userId: string, data: CreateProjectInput) => {
  const count = await prisma.project.count({ where: { userId } });

  return prisma.project.create({
    data: {
      userId,
      title: data.title,
      description: data.description || null,
      bullets: data.bullets && data.bullets.length > 0 ? data.bullets : Prisma.DbNull,
      repoUrl: data.repoUrl || null,
      liveUrl: data.liveUrl || null,
      videoUrl: data.videoUrl || null,
      isPinned: data.isPinned ?? false,
      techTags: data.techTags ?? Prisma.DbNull,
      displayOrder: count,
    },
  });
};

export const updateProject = async (
  userId: string,
  projectId: string,
  data: UpdateProjectInput
) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new NotFoundError("Project");
  if (project.userId !== userId) throw new ForbiddenError("You do not own this project");

  return prisma.project.update({
    where: { id: projectId },
    data: {
      title: data.title ?? project.title,
      description: data.description !== undefined ? data.description || null : project.description,
      bullets: data.bullets !== undefined
        ? (data.bullets && data.bullets.length > 0 ? data.bullets : Prisma.DbNull)
        : (project.bullets === null ? Prisma.DbNull : project.bullets),
      repoUrl: data.repoUrl !== undefined ? data.repoUrl || null : project.repoUrl,
      liveUrl: data.liveUrl !== undefined ? data.liveUrl || null : project.liveUrl,
      videoUrl: data.videoUrl !== undefined ? data.videoUrl || null : project.videoUrl,
      isPinned: data.isPinned ?? project.isPinned,
      techTags: data.techTags !== undefined ? (data.techTags ?? Prisma.DbNull) : (project.techTags === null ? Prisma.DbNull : project.techTags),
    },
  });
};

export const deleteProject = async (userId: string, projectId: string) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new NotFoundError("Project");
  if (project.userId !== userId) throw new ForbiddenError("You do not own this project");

  await prisma.project.delete({ where: { id: projectId } });
};

export const togglePin = async (userId: string, projectId: string) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new NotFoundError("Project");
  if (project.userId !== userId) throw new ForbiddenError("You do not own this project");

  if (!project.isPinned) {
    const pinnedCount = await prisma.project.count({
      where: { userId, isPinned: true },
    });
    if (pinnedCount >= MAX_PINNED) {
      throw new BadRequestError(`You can pin at most ${MAX_PINNED} projects`);
    }
  }

  return prisma.project.update({
    where: { id: projectId },
    data: { isPinned: !project.isPinned },
  });
};

export const reorderProjects = async (
  userId: string,
  projects: { id: string; displayOrder: number }[]
) => {
  const ownedIds = await prisma.project
    .findMany({ where: { userId }, select: { id: true } })
    .then((rows: { id: string }[]) => rows.map((r) => r.id));

  const allOwned = projects.every((p) => ownedIds.includes(p.id));
  if (!allOwned) throw new ForbiddenError("One or more projects do not belong to you");

  await prisma.$transaction(
    projects.map(({ id, displayOrder }) =>
      prisma.project.update({ where: { id }, data: { displayOrder } })
    )
  );
};
