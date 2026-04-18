import QRCode from "qrcode";
import sharp from "sharp";
import { prisma } from "../config/database";
import { cloudinary } from "../config/cloudinary";
import { env } from "../config/env";
import { NotFoundError } from "../utils/errors";
import { QRVariant } from "@prisma/client";
import { Readable } from "stream";

const PROFILE_BASE_URL = env.FRONTEND_URL;

/**
 * Generates a QR code PNG buffer pointing to the user's public hub.
 */
const generateQRBuffer = async (username: string): Promise<Buffer> => {
  const url = `${PROFILE_BASE_URL}/u/${username}`;
  return QRCode.toBuffer(url, {
    type: "png",
    width: 400,
    margin: 2,
    color: { dark: "#0f172a", light: "#ffffff" },
    errorCorrectionLevel: "H",
  });
};

/**
 * Generates a vertical lock-screen card:
 * Name + headline + large QR code — perfect for phone wallpaper / meetup sharing.
 * Rendered as SVG then converted to PNG via sharp.
 */
const generateLockScreenBuffer = async (
  username: string,
  displayName: string,
  headline: string
): Promise<Buffer> => {
  // Generate raw QR as base64 PNG so we can embed it in the SVG
  const url = `${PROFILE_BASE_URL}/u/${username}`;
  const qrBase64 = await QRCode.toDataURL(url, {
    width: 320,
    margin: 2,
    color: { dark: "#ffffff", light: "#0f172a" },
    errorCorrectionLevel: "H",
  });

  const truncatedHeadline =
    headline.length > 48 ? headline.slice(0, 45) + "…" : headline;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="540" height="960" viewBox="0 0 540 960">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="540" height="960" fill="url(#bg)" rx="32"/>

  <!-- Top accent bar -->
  <rect x="40" y="60" width="460" height="4" fill="url(#accent)" rx="2"/>

  <!-- App name -->
  <text x="270" y="110" font-family="system-ui, -apple-system, sans-serif"
        font-size="16" fill="#6366f1" text-anchor="middle" letter-spacing="4" font-weight="600">PROFILIX</text>

  <!-- Name -->
  <text x="270" y="190" font-family="system-ui, -apple-system, sans-serif"
        font-size="38" fill="#f8fafc" text-anchor="middle" font-weight="700">${escapeXml(displayName)}</text>

  <!-- Headline -->
  <text x="270" y="232" font-family="system-ui, -apple-system, sans-serif"
        font-size="17" fill="#94a3b8" text-anchor="middle">${escapeXml(truncatedHeadline)}</text>

  <!-- QR container card -->
  <rect x="90" y="290" width="360" height="360" fill="#1e293b" rx="20" stroke="#334155" stroke-width="1.5"/>
  <image x="110" y="310" width="320" height="320" href="${qrBase64}"/>

  <!-- Scan instruction -->
  <text x="270" y="698" font-family="system-ui, -apple-system, sans-serif"
        font-size="14" fill="#64748b" text-anchor="middle" letter-spacing="1">SCAN TO VIEW PROFILE</text>

  <!-- URL -->
  <text x="270" y="730" font-family="system-ui, -apple-system, sans-serif"
        font-size="15" fill="#818cf8" text-anchor="middle">${escapeXml(url)}</text>

  <!-- Bottom accent bar -->
  <rect x="40" y="896" width="460" height="4" fill="url(#accent)" rx="2"/>
</svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
};

const escapeXml = (str: string): string =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/**
 * Uploads a PNG buffer to Cloudinary and returns the secure URL.
 */
const uploadToCloudinary = (
  buffer: Buffer,
  userId: string,
  variant: QRVariant
): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `profilix/qr/${userId}`,
        public_id: variant === QRVariant.LOCK_SCREEN ? "lock_screen" : "standard",
        resource_type: "image",
        format: "png",
        overwrite: true,
      },
      (error, result) => {
        if (error || !result)
          return reject(error ?? new Error("Cloudinary upload failed"));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
};

/**
 * Main entry point — generates (or regenerates) a QR code for the given user.
 */
export const getOrGenerateQR = async (
  userId: string,
  variant: QRVariant = QRVariant.STANDARD
) => {
  // Load user + profile info
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      username: true,
      fullName: true,
      profile: { select: { displayName: true, headline: true } },
    },
  });

  if (!user) throw new NotFoundError("User");

  const displayName = user.profile?.displayName ?? user.fullName;
  const headline = user.profile?.headline ?? "";

  // Generate the image buffer
  const buffer =
    variant === QRVariant.LOCK_SCREEN
      ? await generateLockScreenBuffer(user.username, displayName, headline)
      : await generateQRBuffer(user.username);

  // Upload to Cloudinary
  const { url: imageUrl, publicId: cloudinaryId } = await uploadToCloudinary(
    buffer,
    userId,
    variant
  );

  // Upsert DB record
  const qrCode = await prisma.qRCode.upsert({
    where: { userId_variant: { userId, variant } },
    create: { userId, variant, imageUrl },
    update: { imageUrl },
  });

  return { imageUrl: qrCode.imageUrl, cloudinaryId };
};
