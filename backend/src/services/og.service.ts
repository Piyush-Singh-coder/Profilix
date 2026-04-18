import sharp from "sharp";
import { prisma } from "../config/database";
import { env } from "../config/env";
import { NotFoundError } from "../utils/errors";

const escapeXml = (str: string): string =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const truncate = (str: string, max: number): string =>
  str.length > max ? str.slice(0, max - 1) + "…" : str;

/**
 * Splits tech tags into rows of up to `perRow` items for SVG layout.
 */
const chunkArray = <T>(arr: T[], perRow: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += perRow) {
    result.push(arr.slice(i, i + perRow));
  }
  return result;
};

/**
 * Generates a 1200×630 OG image PNG for the given username profile.
 * Returns a Buffer so the controller can stream it directly.
 */
export const generateOGImage = async (username: string): Promise<Buffer> => {
  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    select: {
      fullName: true,
      profile: {
        select: {
          displayName: true,
          headline: true,
          isPublic: true,
          techStacks: {
            include: { tech: { select: { name: true } } },
            take: 8,
            orderBy: { assignedAt: "asc" },
          },
        },
      },
    },
  });

  if (!user || !user.profile || !user.profile.isPublic) {
    throw new NotFoundError("Profile");
  }

  const displayName = truncate(user.profile.displayName ?? user.fullName, 40);
  const headline = truncate(user.profile.headline ?? "Developer", 64);
  const techNames = user.profile.techStacks.map((pt) => pt.tech.name);
  const profileUrl = `${env.FRONTEND_URL}/${username}`;

  // Build tech tag pills SVG elements
  const rows = chunkArray(techNames, 4);
  const tagStartY = 380;
  const tagH = 36;
  const tagPaddingX = 18;
  const fontSize = 15;
  const estimatedCharWidth = 9;
  const rowGap = 50;

  let techTagsSvg = "";
  rows.forEach((row, rowIndex) => {
    let xOffset = 80;
    const y = tagStartY + rowIndex * rowGap;

    row.forEach((name) => {
      const pillWidth = name.length * estimatedCharWidth + tagPaddingX * 2;
      techTagsSvg += `
        <rect x="${xOffset}" y="${y}" width="${pillWidth}" height="${tagH}" rx="${tagH / 2}"
              fill="#1e293b" stroke="#334155" stroke-width="1.2"/>
        <text x="${xOffset + pillWidth / 2}" y="${y + tagH / 2 + 5}"
              font-family="system-ui, -apple-system, sans-serif"
              font-size="${fontSize}" fill="#94a3b8" text-anchor="middle">${escapeXml(name)}</text>
      `;
      xOffset += pillWidth + 12;
    });
  });

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Top glow blob -->
  <ellipse cx="200" cy="0" rx="400" ry="300" fill="url(#glow)"/>

  <!-- Left accent bar -->
  <rect x="0" y="0" width="6" height="630" fill="url(#accent)"/>

  <!-- Top accent line -->
  <rect x="80" y="60" width="1040" height="3" fill="url(#accent)" rx="2" opacity="0.4"/>

  <!-- Profilix wordmark -->
  <text x="80" y="50" font-family="system-ui, -apple-system, sans-serif"
        font-size="14" fill="#6366f1" letter-spacing="5" font-weight="700">PROFILIX</text>

  <!-- Name -->
  <text x="80" y="190" font-family="system-ui, -apple-system, sans-serif"
        font-size="72" fill="#f8fafc" font-weight="800" letter-spacing="-1">${escapeXml(displayName)}</text>

  <!-- Accent underline under name -->
  <rect x="80" y="204" width="120" height="4" fill="url(#accent)" rx="2"/>

  <!-- Headline -->
  <text x="80" y="270" font-family="system-ui, -apple-system, sans-serif"
        font-size="28" fill="#94a3b8" font-weight="400">${escapeXml(headline)}</text>

  <!-- Divider -->
  <rect x="80" y="330" width="1040" height="1" fill="#334155"/>

  <!-- Tech label -->
  <text x="80" y="370" font-family="system-ui, -apple-system, sans-serif"
        font-size="13" fill="#475569" letter-spacing="3" font-weight="600">TECH STACK</text>

  <!-- Tech pills -->
  ${techTagsSvg}

  <!-- Bottom URL -->
  <text x="80" y="590" font-family="system-ui, -apple-system, sans-serif"
        font-size="18" fill="#6366f1">${escapeXml(profileUrl)}</text>

  <!-- Bottom right decorative circle -->
  <circle cx="1100" cy="315" r="200" fill="none" stroke="#6366f1" stroke-width="1" opacity="0.1"/>
  <circle cx="1100" cy="315" r="150" fill="none" stroke="#6366f1" stroke-width="1" opacity="0.1"/>
  <circle cx="1100" cy="315" r="80" fill="#6366f1" opacity="0.04"/>
</svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
};
