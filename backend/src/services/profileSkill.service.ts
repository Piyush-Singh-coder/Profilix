import { prisma } from "../config/database";
import { NotFoundError, ForbiddenError } from "../utils/errors";
import { CreateProfileSkillInput, UpdateProfileSkillInput } from "../validators/profileSkill.validator";

export const getProfileSkills = async (userId: string) => {
  return prisma.profileSkill.findMany({
    where: { userId },
    orderBy: { displayOrder: "asc" },
  });
};

export const createProfileSkill = async (userId: string, data: CreateProfileSkillInput) => {
  const count = await prisma.profileSkill.count({ where: { userId } });

  return prisma.profileSkill.create({
    data: {
      userId,
      category: data.category,
      skills: data.skills,
      displayOrder: data.displayOrder ?? count,
    },
  });
};

export const updateProfileSkill = async (
  userId: string,
  id: string,
  data: UpdateProfileSkillInput
) => {
  const skill = await prisma.profileSkill.findUnique({ where: { id } });
  if (!skill) throw new NotFoundError("ProfileSkill");
  if (skill.userId !== userId) throw new ForbiddenError("You do not own this skill category");

  return prisma.profileSkill.update({
    where: { id },
    data: {
      category: data.category ?? skill.category,
      skills: data.skills ?? skill.skills,
      displayOrder: data.displayOrder ?? skill.displayOrder,
    },
  });
};

export const deleteProfileSkill = async (userId: string, id: string) => {
  const skill = await prisma.profileSkill.findUnique({ where: { id } });
  if (!skill) throw new NotFoundError("ProfileSkill");
  if (skill.userId !== userId) throw new ForbiddenError("You do not own this skill category");

  await prisma.profileSkill.delete({ where: { id } });
};
