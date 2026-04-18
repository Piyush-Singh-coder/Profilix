import { prisma } from "../config/database";
import { NotFoundError, ForbiddenError } from "../utils/errors";
import { CreateExperienceInput, UpdateExperienceInput } from "../validators/experience.validator";
import { Prisma } from "@prisma/client";

export const getExperiences = async (userId: string) => {
  return prisma.experience.findMany({
    where: { userId },
    orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
  });
};

export const createExperience = async (userId: string, data: CreateExperienceInput) => {
  const count = await prisma.experience.count({ where: { userId } });

  return prisma.experience.create({
    data: {
      userId,
      company: data.company,
      role: data.role,
      location: data.location || null,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      isCurrent: data.isCurrent ?? false,
      description: data.description || null,
      bullets: data.bullets && data.bullets.length > 0 ? data.bullets : Prisma.DbNull,
      logoUrl: data.logoUrl || null,
      displayOrder: data.displayOrder ?? count,
    },
  });
};

export const updateExperience = async (
  userId: string,
  experienceId: string,
  data: UpdateExperienceInput
) => {
  const exp = await prisma.experience.findUnique({ where: { id: experienceId } });
  if (!exp) throw new NotFoundError("Experience");
  if (exp.userId !== userId) throw new ForbiddenError("You do not own this experience entry");

  return prisma.experience.update({
    where: { id: experienceId },
    data: {
      company: data.company ?? exp.company,
      role: data.role ?? exp.role,
      location: data.location !== undefined ? data.location || null : exp.location,
      startDate: data.startDate ? new Date(data.startDate) : exp.startDate,
      endDate: data.endDate !== undefined
        ? (data.endDate ? new Date(data.endDate) : null)
        : exp.endDate,
      isCurrent: data.isCurrent ?? exp.isCurrent,
      description: data.description !== undefined ? data.description || null : exp.description,
      bullets: data.bullets !== undefined
        ? (data.bullets && data.bullets.length > 0 ? data.bullets : Prisma.DbNull)
        : (exp.bullets === null ? Prisma.DbNull : exp.bullets),
      logoUrl: data.logoUrl !== undefined ? data.logoUrl || null : exp.logoUrl,
      displayOrder: data.displayOrder ?? exp.displayOrder,
    },
  });
};

export const deleteExperience = async (userId: string, experienceId: string) => {
  const exp = await prisma.experience.findUnique({ where: { id: experienceId } });
  if (!exp) throw new NotFoundError("Experience");
  if (exp.userId !== userId) throw new ForbiddenError("You do not own this experience entry");

  await prisma.experience.delete({ where: { id: experienceId } });
};
