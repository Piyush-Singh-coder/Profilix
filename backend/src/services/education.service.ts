import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { ForbiddenError, NotFoundError } from "../utils/errors";
import { CreateEducationInput, UpdateEducationInput } from "../validators/education.validator";

export const getEducations = async (userId: string) => {
  return prisma.education.findMany({
    where: { userId },
    orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
  });
};

export const createEducation = async (userId: string, data: CreateEducationInput) => {
  const count = await prisma.education.count({ where: { userId } });

  return prisma.education.create({
    data: {
      userId,
      school: data.school,
      degree: data.degree || null,
      fieldOfStudy: data.fieldOfStudy || null,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      isCurrent: data.isCurrent ?? false,
      description: data.description || null,
      bullets: data.bullets && data.bullets.length > 0 ? data.bullets : Prisma.DbNull,
      displayOrder: data.displayOrder ?? count,
    },
  });
};

export const updateEducation = async (userId: string, educationId: string, data: UpdateEducationInput) => {
  const edu = await prisma.education.findUnique({ where: { id: educationId } });
  if (!edu) throw new NotFoundError("Education");
  if (edu.userId !== userId) throw new ForbiddenError("You do not own this education entry");

  return prisma.education.update({
    where: { id: educationId },
    data: {
      school: data.school ?? edu.school,
      degree: data.degree !== undefined ? data.degree || null : edu.degree,
      fieldOfStudy: data.fieldOfStudy !== undefined ? data.fieldOfStudy || null : edu.fieldOfStudy,
      startDate: data.startDate ? new Date(data.startDate) : edu.startDate,
      endDate:
        data.endDate !== undefined ? (data.endDate ? new Date(data.endDate) : null) : edu.endDate,
      isCurrent: data.isCurrent ?? edu.isCurrent,
      description: data.description !== undefined ? data.description || null : edu.description,
      bullets:
        data.bullets !== undefined
          ? data.bullets && data.bullets.length > 0
            ? data.bullets
            : Prisma.DbNull
          : edu.bullets === null
            ? Prisma.DbNull
            : edu.bullets,
      displayOrder: data.displayOrder ?? edu.displayOrder,
    },
  });
};

export const deleteEducation = async (userId: string, educationId: string) => {
  const edu = await prisma.education.findUnique({ where: { id: educationId } });
  if (!edu) throw new NotFoundError("Education");
  if (edu.userId !== userId) throw new ForbiddenError("You do not own this education entry");

  await prisma.education.delete({ where: { id: educationId } });
};

