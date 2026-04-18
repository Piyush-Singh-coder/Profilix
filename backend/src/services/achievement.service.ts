import { prisma } from "../config/database";
import { NotFoundError, ForbiddenError } from "../utils/errors";
import { CreateAchievementInput, UpdateAchievementInput } from "../validators/achievement.validator";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const getAchievements = async (userId: string) => {
  return prisma.achievement.findMany({
    where: { userId },
    orderBy: [{ displayOrder: "asc" }, { date: "desc" }],
  });
};

export const createAchievement = async (userId: string, data: CreateAchievementInput) => {
  const count = await prisma.achievement.count({ where: { userId } });

  return prisma.achievement.create({
    data: {
      userId,
      title: data.title,
      provider: data.provider || null,
      type: data.type ?? "OTHER",
      date: data.date ? new Date(data.date) : null,
      url: data.url || null,
      imageUrl: data.imageUrl || null,
      cloudinaryId: data.cloudinaryId || null,
      description: data.description || null,
      displayOrder: data.displayOrder ?? count,
    },
  });
};

export const updateAchievement = async (
  userId: string,
  achievementId: string,
  data: UpdateAchievementInput
) => {
  const ach = await prisma.achievement.findUnique({ where: { id: achievementId } });
  if (!ach) throw new NotFoundError("Achievement");
  if (ach.userId !== userId) throw new ForbiddenError("You do not own this achievement");

  return prisma.achievement.update({
    where: { id: achievementId },
    data: {
      title: data.title ?? ach.title,
      provider: data.provider !== undefined ? data.provider || null : ach.provider,
      type: data.type ?? ach.type,
      date: data.date !== undefined ? (data.date ? new Date(data.date) : null) : ach.date,
      url: data.url !== undefined ? data.url || null : ach.url,
      imageUrl: data.imageUrl !== undefined ? data.imageUrl || null : ach.imageUrl,
      cloudinaryId: data.cloudinaryId !== undefined ? data.cloudinaryId || null : ach.cloudinaryId,
      description: data.description !== undefined ? data.description || null : ach.description,
      displayOrder: data.displayOrder ?? ach.displayOrder,
    },
  });
};

export const deleteAchievement = async (userId: string, achievementId: string) => {
  const ach = await prisma.achievement.findUnique({ where: { id: achievementId } });
  if (!ach) throw new NotFoundError("Achievement");
  if (ach.userId !== userId) throw new ForbiddenError("You do not own this achievement");

  // Cleanup Cloudinary image if present
  if (ach.cloudinaryId) {
    try {
      await cloudinary.uploader.destroy(ach.cloudinaryId);
    } catch (_) {}
  }

  await prisma.achievement.delete({ where: { id: achievementId } });
};

/**
 * Upload a certificate image to Cloudinary and return the URLs.
 */
export const uploadCertificateImage = async (
  fileBuffer: Buffer,
  originalName: string
): Promise<{ imageUrl: string; cloudinaryId: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "profilix/achievements",
        resource_type: "image",
        public_id: `cert_${Date.now()}_${originalName.replace(/\.[^/.]+$/, "")}`,
        transformation: [{ width: 1200, height: 900, crop: "limit", quality: "auto" }],
      },
      (error, result) => {
        if (error || !result) return reject(error || new Error("Upload failed"));
        resolve({ imageUrl: result.secure_url, cloudinaryId: result.public_id });
      }
    );
    uploadStream.end(fileBuffer);
  });
};
