import { prisma } from "../config/database";
import { NotFoundError, ForbiddenError } from "../utils/errors";
import { CreateCustomSectionInput, UpdateCustomSectionInput } from "../validators/customSection.validator";

export const getCustomSections = async (userId: string) => {
  return prisma.customSection.findMany({
    where: { userId },
    orderBy: { displayOrder: "asc" },
  });
};

export const createCustomSection = async (userId: string, data: CreateCustomSectionInput) => {
  const count = await prisma.customSection.count({ where: { userId } });

  return prisma.customSection.create({
    data: {
      userId,
      title: data.title,
      bullets: data.bullets,
      displayOrder: data.displayOrder ?? count,
    },
  });
};

export const updateCustomSection = async (
  userId: string,
  id: string,
  data: UpdateCustomSectionInput
) => {
  const section = await prisma.customSection.findUnique({ where: { id } });
  if (!section) throw new NotFoundError("CustomSection");
  if (section.userId !== userId) throw new ForbiddenError("You do not own this custom section");

  return prisma.customSection.update({
    where: { id },
    data: {
      title: data.title ?? section.title,
      bullets: data.bullets ?? section.bullets,
      displayOrder: data.displayOrder ?? section.displayOrder,
    },
  });
};

export const deleteCustomSection = async (userId: string, id: string) => {
  const section = await prisma.customSection.findUnique({ where: { id } });
  if (!section) throw new NotFoundError("CustomSection");
  if (section.userId !== userId) throw new ForbiddenError("You do not own this custom section");

  await prisma.customSection.delete({ where: { id } });
};
