import { prisma } from "../config/database";
import { NotFoundError, ForbiddenError } from "../utils/errors";
import { CreateSocialLinkInput } from "../validators/social.validator";

export const getSocialLinks = async (userId: string) => {
  return prisma.socialLink.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
};

export const createSocialLink = async (userId: string, data: CreateSocialLinkInput) => {
  return prisma.socialLink.create({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { ...data, userId } as any,
  });
};

export const updateSocialLink = async (
  userId: string,
  linkId: string,
  data: Partial<CreateSocialLinkInput>
) => {
  const link = await prisma.socialLink.findUnique({ where: { id: linkId } });
  if (!link) throw new NotFoundError("Social link");
  if (link.userId !== userId) throw new ForbiddenError("You do not own this social link");

  return prisma.socialLink.update({
    where: { id: linkId },
    data,
  });
};

export const deleteSocialLink = async (userId: string, linkId: string) => {
  const link = await prisma.socialLink.findUnique({ where: { id: linkId } });
  if (!link) throw new NotFoundError("Social link");
  if (link.userId !== userId) throw new ForbiddenError("You do not own this social link");

  await prisma.socialLink.delete({ where: { id: linkId } });
};
