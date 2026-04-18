import { prisma } from "../config/database";
import { NotFoundError, BadRequestError } from "../utils/errors";
import { UpdateProfileInput } from "../validators/profile.validator";
import { v2 as cloudinary } from "cloudinary";

export const getProfile = async (userId: string) => {
  let profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      techStacks: {
        include: { tech: true },
        orderBy: { assignedAt: "asc" },
      },
    },
  });

  if (!profile) {
    // If the user somehow exists but profile doesn't (legacy account), create a basic one.
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("User");

    profile = await prisma.profile.create({
      data: {
        userId,
        displayName: user.fullName || user.username || "Profilix User",
      },
      include: {
        techStacks: {
          include: { tech: true },
          orderBy: { assignedAt: "asc" },
        },
      },
    });
  }

  return profile;
};

export const updateProfile = async (userId: string, data: UpdateProfileInput) => {
  // Ensure profile exists (create if not — e.g. email/password users who haven't set up yet)
  const profile = await prisma.profile.upsert({
    where: { userId },
    create: {
      userId,
      displayName: data.displayName ?? "Profilix User",
      ...data,
    },
    update: data,
    include: {
      techStacks: { include: { tech: true } },
    },
  });
  return profile;
};

export const updateTechStack = async (userId: string, techIds: string[]) => {
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) throw new NotFoundError("Profile");

  // Validate all tech IDs exist
  const techs = await prisma.techStack.findMany({
    where: { id: { in: techIds } },
  });
  if (techs.length !== techIds.length) {
    throw new BadRequestError("One or more tech IDs are invalid");
  }

  // Replace entire tech stack (delete all existing, insert new)
  await prisma.$transaction([
    prisma.profileTechStack.deleteMany({ where: { profileId: profile.id } }),
    prisma.profileTechStack.createMany({
      data: techIds.map((techId) => ({ profileId: profile.id, techId })),
    }),
  ]);

  return prisma.profile.findUnique({
    where: { userId },
    include: { techStacks: { include: { tech: true } } },
  });
};

export const getTechStackOptions = async () => {
  return prisma.techStack.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
};

export const uploadAvatar = async (userId: string, fileBuffer: Buffer) => {
  const result = await new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "profilix/avatars",
        resource_type: "image",
        public_id: `avatar_${userId}_${Date.now()}`,
        transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face", quality: "auto" }],
      },
      (error, result) => {
        if (error || !result) return reject(error || new Error("Avatar upload failed"));
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });

  return prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: result.secure_url },
  });
};
