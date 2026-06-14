import { prisma } from "../config/database";
import { NotFoundError, BadRequestError } from "../utils/errors";

export const likeProfile = async (likerId: string, profileId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
  });

  if (!profile) {
    throw new NotFoundError("Profile");
  }

  if (profile.userId === likerId) {
    throw new BadRequestError("You cannot upvote your own profile");
  }

  // Check if already liked
  const existingLike = await prisma.profileLike.findUnique({
    where: {
      likerId_profileId: {
        likerId,
        profileId,
      },
    },
  });

  if (existingLike) {
    return existingLike;
  }

  return prisma.profileLike.create({
    data: {
      likerId,
      profileId,
    },
  });
};

export const unlikeProfile = async (likerId: string, profileId: string) => {
  const existingLike = await prisma.profileLike.findUnique({
    where: {
      likerId_profileId: {
        likerId,
        profileId,
      },
    },
  });

  if (!existingLike) {
    throw new NotFoundError("Upvote not found");
  }

  await prisma.profileLike.delete({
    where: {
      id: existingLike.id,
    },
  });

  return { success: true };
};
