import { prisma } from "../config/database";
import { NotFoundError, BadRequestError } from "../utils/errors";
import { cloudinary } from "../config/cloudinary";
import { Readable } from "stream";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const uploadResume = async (
  userId: string,
  file: Express.Multer.File
): Promise<{ fileUrl: string; cloudinaryId: string }> => {
  if (file.mimetype !== "application/pdf") {
    throw new BadRequestError("Only PDF files are allowed");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new BadRequestError("File size must not exceed 5MB");
  }

  // Upload buffer to Cloudinary
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `profilix/resumes/${userId}`,
        resource_type: "raw",
        public_id: "resume",
        overwrite: true,
        format: "pdf",
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Cloudinary upload failed"));
        resolve({ fileUrl: result.secure_url, cloudinaryId: result.public_id });
      }
    );
    const stream = Readable.from(file.buffer);
    stream.pipe(uploadStream);
  });
};

export const saveResumeRecord = async (
  userId: string,
  fileUrl: string,
  cloudinaryId: string,
  originalFilename: string,
  fileSizeBytes: number
) => {
  return prisma.resume.upsert({
    where: { userId },
    create: { userId, fileUrl, cloudinaryId, originalFilename, fileSizeBytes },
    update: { fileUrl, cloudinaryId, originalFilename, fileSizeBytes },
  });
};

export const getResume = async (userId: string) => {
  const resume = await prisma.resume.findUnique({ where: { userId } });
  if (!resume) throw new NotFoundError("Resume");
  return resume;
};

export const deleteResume = async (userId: string) => {
  const resume = await prisma.resume.findUnique({ where: { userId } });
  if (!resume) throw new NotFoundError("Resume");

  // Delete from Cloudinary
  await cloudinary.uploader.destroy(resume.cloudinaryId, { resource_type: "raw" });

  await prisma.resume.delete({ where: { userId } });
};
