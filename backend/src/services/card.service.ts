import sharp from "sharp";
import QRCode from "qrcode";
import { prisma } from "../config/database";
import { env } from "../config/env";
import { NotFoundError } from "../utils/errors";

// ─── Helpers ────────────────────────────────────────────────────────────────

const escapeXml = (str: string): string =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const truncate = (str: string, max: number): string =>
  str.length > max ? str.slice(0, max - 1) + "…" : str;

const wrapText = (text: string, maxChars: number): string[] => {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const word of words) {
    if ((cur + word).length > maxChars) {
      if (cur.trim()) lines.push(cur.trim());
      cur = word + " ";
    } else {
      cur += word + " ";
    }
  }
  if (cur.trim()) lines.push(cur.trim());
  return lines;
};

const monthYear = (dateStr: Date | string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

const dateRange = (start: Date, end: Date | null, isCurrent: boolean) =>
  isCurrent || !end
    ? `${monthYear(start)} – Present`
    : `${monthYear(start)} – ${monthYear(end)}`;

const cleanUrl = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/**
 * Word-wraps bullets within a column width.
 * Conservative char estimate (0.58) prevents overflow.
 */
const renderBullets = (
  bullets: string[] | null | undefined,
  startY: number,
  fontSize: number,
  fill: string,
  fontFamily: string,
  colWidth: number,
  maxBullets = 3,
): { svg: string; totalHeight: number } => {
  if (!bullets || bullets.length === 0) return { svg: "", totalHeight: 0 };
  // 0.58 is conservative - prevents text overflow at all font sizes
  const charsPerLine = Math.max(Math.floor(colWidth / (fontSize * 0.58)), 16);
  const lineH = fontSize + 6;
  const shown = bullets.slice(0, maxBullets);
  let curY = startY;
  const parts: string[] = [];
  for (const bullet of shown) {
    const lines = wrapText(bullet, charsPerLine - 2);
    for (let li = 0; li < lines.length; li++) {
      const prefix = li === 0 ? "• " : "  ";
      parts.push(
        `<text y="${curY}" font-family="${fontFamily}" font-size="${fontSize}" fill="${fill}">${escapeXml(prefix + lines[li])}</text>`,
      );
      curY += lineH;
    }
    curY += 3; // gap between bullets
  }
  return { svg: parts.join(""), totalHeight: curY - startY };
};

/**
 * 2-column skill grid. Conservative char estimate prevents overflow.
 */
const renderSkills = (
  skills: string[],
  startY: number,
  fontSize: number,
  fill: string,
  fontFamily: string,
  colWidth: number,
): { svg: string; totalHeight: number } => {
  if (skills.length === 0) return { svg: "", totalHeight: 0 };
  const halfW = Math.floor(colWidth / 2);
  const lineH = fontSize + 10;
  const maxCharsHalf = Math.max(Math.floor(halfW / (fontSize * 0.56)) - 2, 10);
  const parts: string[] = [];
  skills.forEach((name, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = col * halfW;
    const y = startY + row * lineH;
    parts.push(
      `<text x="${x}" y="${y}" font-family="${fontFamily}" font-size="${fontSize}" fill="${fill}">· ${escapeXml(truncate(name, maxCharsHalf))}</text>`,
    );
  });
  const rows = Math.ceil(skills.length / 2);
  return { svg: parts.join(""), totalHeight: rows * lineH };
};

// ─── Card Sizes ──────────────────────────────────────────────────────────────

interface Sz {
  w: number;
  h: number;
  pad: number;
  nameFs: number;
  hlFs: number;
  bodyFs: number;
  labelFs: number;
  smallFs: number;
  avatarR: number;
}

const SIZES: Record<string, Sz> = {
  "1080x1080": {
    w: 1080,
    h: 1080,
    pad: 52,
    nameFs: 50,
    hlFs: 22,
    bodyFs: 19,
    labelFs: 15,
    smallFs: 13,
    avatarR: 68,
  },
  "1080x1350": {
    w: 1080,
    h: 1350,
    pad: 60,
    nameFs: 56,
    hlFs: 24,
    bodyFs: 21,
    labelFs: 17,
    smallFs: 14,
    avatarR: 76,
  },
  "1200x628": {
    w: 1200,
    h: 628,
    pad: 44,
    nameFs: 42,
    hlFs: 19,
    bodyFs: 16,
    labelFs: 13,
    smallFs: 11,
    avatarR: 56,
  },
  "1200x675": {
    w: 1200,
    h: 675,
    pad: 44,
    nameFs: 42,
    hlFs: 19,
    bodyFs: 16,
    labelFs: 13,
    smallFs: 11,
    avatarR: 56,
  },
  "1920x1080": {
    w: 1920,
    h: 1080,
    pad: 76,
    nameFs: 66,
    hlFs: 28,
    bodyFs: 23,
    labelFs: 19,
    smallFs: 15,
    avatarR: 88,
  },
};

// ─── Data Fetching ───────────────────────────────────────────────────────────

async function fetchCardData(username: string) {
  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      profile: {
        include: {
          techStacks: {
            include: { tech: { select: { name: true, category: true } } },
            take: 20,
            orderBy: { assignedAt: "asc" },
          },
        },
      },
      // Always cap at 3 experience, 2 projects, 5 achievements
      experiences: {
        take: 3,
        orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
      },
      projects: {
        take: 2,
        orderBy: [{ isPinned: "desc" }, { displayOrder: "asc" }],
      },
      achievements: {
        take: 5,
        orderBy: [{ displayOrder: "asc" }, { date: "desc" }],
      },
      socialLinks: { orderBy: { platform: "asc" } },
      githubStats: true,
    },
  });
  if (!user || !user.profile) throw new NotFoundError("Profile");
  return user;
}

// ─── GitHub Heatmap + Stats ───────────────────────────────────────────────────

async function renderGithubSection(
  ghStats: Awaited<ReturnType<typeof fetchCardData>>["githubStats"],
  x: number,
  y: number,
  w: number,
  heatH: number,
  accentColor: string,
  labelColor: string,
  dimColor: string,
  labelFs: number,
  smallFs: number,
  profileUrl: string,
): Promise<string> {
  type ContribDay = { contributionCount: number; date: string };
  type Week = { contributionDays: ContribDay[] };

  let weeks: Week[] = [];
  if (ghStats?.contributions) {
    const raw = ghStats.contributions as { weeks?: Week[] };
    weeks = raw.weeks || [];
  }

  const shownWeeks = weeks.slice(-26);
  const daySize = Math.min(Math.floor((w - 20) / (shownWeeks.length || 1)), 20);
  const cellSize = daySize - 2;

  let heatmapSvg = "";
  if (shownWeeks.length === 0) {
    heatmapSvg = `<text x="${x + w / 2}" y="${y + heatH / 2}" font-family="sans-serif" font-size="${smallFs}" fill="${dimColor}" fill-opacity="0.4" text-anchor="middle">No contribution data</text>`;
  } else {
    const allCounts = shownWeeks.flatMap((wk) =>
      wk.contributionDays.map((d) => d.contributionCount),
    );
    const maxCount = Math.max(...allCounts, 1);
    const totalContribs = allCounts.reduce((a, b) => a + b, 0);
    const cells = shownWeeks
      .map((week, wi) =>
        week.contributionDays
          .map((day, di) => {
            const pct = day.contributionCount / maxCount;
            const opacity =
              day.contributionCount === 0 ? 0.07 : 0.18 + pct * 0.82;
            return `<rect x="${x + wi * daySize}" y="${y + 26 + di * daySize}" width="${cellSize}" height="${cellSize}" rx="2" fill="${accentColor}" fill-opacity="${opacity.toFixed(2)}"/>`;
          })
          .join(""),
      )
      .join("");

    // Label row (top-left)
    heatmapSvg = `
      <text x="${x}" y="${y + labelFs + 2}" font-family="sans-serif" font-size="${labelFs}" fill="${labelColor}" font-weight="700" letter-spacing="0.8">CONTRIBUTIONS</text>
      ${ghStats?.githubUsername ? `<text x="${x}" y="${y + labelFs + smallFs + 6}" font-family="sans-serif" font-size="${smallFs - 1}" fill="${dimColor}">@${escapeXml(ghStats.githubUsername)}</text>` : ""}
      ${cells}
      <text x="${x + w}" y="${y + labelFs + 2}" font-family="sans-serif" font-size="${smallFs - 1}" fill="${accentColor}" text-anchor="end">${totalContribs.toLocaleString()} contributions this year</text>
    `;
  }

  // GitHub Stats bar (right side, below heatmap)
  const hasStats = !!ghStats;
  const statItems: { label: string; value: string }[] = hasStats
    ? [
        { label: "Repos", value: String(ghStats!.totalRepos ?? 0) },
        { label: "Stars", value: String(ghStats!.totalStars ?? 0) },
        { label: "Forks", value: String(ghStats!.totalForks ?? 0) },
        { label: "Followers", value: String(ghStats!.followers ?? 0) },
      ]
    : [];

  const statsRowY = y + heatH + 8; // just below the heatmap cells
  const statW = Math.floor(w / Math.max(statItems.length, 1));
  const statsSvg = statItems
    .map((s, i) => {
      const sx = x + i * statW;
      return `
      <text x="${sx + statW / 2}" y="${statsRowY + labelFs + 2}" font-family="sans-serif" font-size="${labelFs}" fill="${accentColor}" font-weight="700" text-anchor="middle">${escapeXml(s.value)}</text>
      <text x="${sx + statW / 2}" y="${statsRowY + labelFs + smallFs + 4}" font-family="sans-serif" font-size="${smallFs - 1}" fill="${dimColor}" text-anchor="middle">${escapeXml(s.label)}</text>`;
    })
    .join("");

  let qrSvgStr = "";
  try {
    const qrSize = 130; // perfectly matches the 7 * 20 (140) heatmap cell grid height
    const qrCodeRaw = await QRCode.toString(profileUrl, {
      type: "svg",
      margin: 0,
      width: qrSize,
      color: { dark: accentColor, light: "#00000000" },
    });
    const viewBoxMatch = qrCodeRaw.match(/viewBox="([^"]+)"/);
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 33 33";
    const match = qrCodeRaw.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
    if (match) {
      const qrX = x + w - qrSize - 10;
      const qrY = y + 26; // aligns perfectly with the top row of heatmap cells
      qrSvgStr = `
        <svg x="${qrX}" y="${qrY}" width="${qrSize}" height="${qrSize}" viewBox="${viewBox}">
          ${match[1]}
        </svg>
        <text x="${qrX + qrSize / 2}" y="${qrY + qrSize + smallFs + 2}" font-family="sans-serif" font-size="${smallFs - 2}" fill="${dimColor}" text-anchor="middle">Scan for profile</text>
      `;
    }
  } catch (e) {}

  return heatmapSvg + statsSvg + qrSvgStr;
}

// ─── Layout guide ─────────────────────────────────────────────────────────────
//
//  ┌──────────────────────────────────────────────────────────────┐
//  │  HEADER  ( avatar · name · headline · location · email )     │
//  ├──────────────────────────────────────────────────────────────┤
//  │  Bio (2 lines)                                               │
//  ├──────────────────┬───────────────┬──────────────────────────┤
//  │  EXPERIENCE      │  SKILLS       │  ACHIEVEMENTS            │  ← row1 (3-col)
//  ├──────────────────┴───────┬───────┴──────────────────────────┤
//  │  PROJECT 1               │  PROJECT 2                        │  ← row2 (2-col)
//  ├──────────────────────────┴───────────────────────────────────┤
//  │  GitHub heatmap                                              │
//  │  ■ repos   ■ stars   ■ forks   ■ followers                  │
//  ├──────────────────────────────────────────────────────────────┤
//  │  FOOTER  socials  ·  profile URL                             │
//  └──────────────────────────────────────────────────────────────┘
//
// ─────────────────────────────────────────────────────────────────────────────

// ─── Shared layout calculation ────────────────────────────────────────────────

interface CardLayout {
  innerW: number;
  gap3: number;
  gap2: number;
  colW3: number;
  colW2: number;
  col3X: (i: number) => number;
  col2X: (i: number) => number;
  headerH: number;
  headerY: number;
  sep1Y: number;
  bioLines: string[];
  bioY: number;
  bioH: number;
  sep2Y: number;
  row1Y: number;
  row1H: number;
  sep3Y: number;
  row2Y: number;
  row2H: number;
  sep4Y: number;
  heatY: number;
  heatH: number;
  statsBarH: number;
  sep5Y: number;
  footerY: number;
  canvasH: number;
  labelOffset: number; // pixels items are pushed down from row top to clear the label
}

function calcLayout(
  user: Awaited<ReturnType<typeof fetchCardData>>,
  sz: Sz,
  bioCharFactor: number,
  gap3: number,
  gap2: number,
  innerGap3: number = 20, // top indent inside each row-1 col before items
  innerGap2: number = 24, // top indent inside each row-2 col before items
): CardLayout {
  const { w, pad, bodyFs, labelFs, smallFs, avatarR } = sz;
  const innerW = w - pad * 2;
  const colW3 = (innerW - gap3 * 2) / 3;
  const colW2 = (innerW - gap2) / 2;
  const col3X = (i: number) => pad + i * (colW3 + gap3);
  const col2X = (i: number) => pad + i * (colW2 + gap2);

  const headerH = avatarR * 2 + 32;
  const headerY = pad;
  const sep1Y = headerY + headerH + 14;

  const bioLines = wrapText(
    user.profile!.bio || "Building amazing things.",
    Math.floor(innerW / (bodyFs * bioCharFactor)),
  );
  const bioY = sep1Y + 14;
  const bioH = bioLines.length * (bodyFs + 8);
  const sep2Y = bioY + bioH + 14;

  // Label offset = how far items are pushed below the row's origin to clear the label
  const labelOffset = labelFs + 16;

  // row1 — 3 columns
  const row1Y = sep2Y + 14;
  const bulletLH = smallFs - 1 + 6;
  const calcBulletHgt = (rawBullets: unknown, cw: number) => {
    const shown = ((rawBullets as string[] | null) || []).slice(0, 3);
    if (!shown.length) return 0;
    const cpp = Math.max(Math.floor(cw / ((smallFs - 1) * 0.58)) - 2, 14);
    return shown.reduce(
      (h, b) => h + wrapText(b, cpp).length * bulletLH + 3,
      0,
    );
  };

  // Experience: label_offset + (per entry: role + company + bullets + location? + date + gap)
  const expItemH = (exp: (typeof user.experiences)[0]) => {
    const bulH = calcBulletHgt(exp.bullets, colW3);
    const locH = exp.location ? smallFs - 1 + 6 : 0;
    return bodyFs + 8 + smallFs + 8 + bulH + 6 + locH + (smallFs - 1) + 14;
  };
  const totalExpH =
    labelOffset +
    (user.experiences.length > 0
      ? user.experiences.reduce((s, e) => s + expItemH(e), 0) + 8
      : bodyFs * 4);

  // Skills: label_offset + 2-col grid
  const skillCount = Math.min(user.profile!.techStacks.length, 16);
  const totalSkillH =
    labelOffset + Math.ceil(skillCount / 2) * (smallFs + 10) + 8;

  // Achievements: label_offset + per item (title + date line)
  const achPerItemH = smallFs + 6 + (smallFs - 2) + 8; // title + date + gap
  const totalAchH =
    labelOffset + Math.min(user.achievements.length, 5) * achPerItemH + 8;

  const row1H = Math.max(totalExpH, totalSkillH, totalAchH, bodyFs * 6);
  const sep3Y = row1Y + row1H + 14;

  // row2 — 2 columns (projects)
  const row2Y = sep3Y + 14;
  const projBCPP = Math.max(Math.floor(colW2 / ((smallFs - 1) * 0.58)) - 2, 18);
  const projBuiltH = (proj: (typeof user.projects)[0]) => {
    const descLines = proj.description
      ? wrapText(proj.description, Math.floor(colW2 / (smallFs * 0.56))).slice(
          0,
          3,
        )
      : [];
    const descH =
      descLines.length * (smallFs + 5) + (descLines.length > 0 ? 6 : 0);
    const bH = ((proj.bullets as string[] | null) || [])
      .slice(0, 3)
      .reduce((h, b) => h + wrapText(b, projBCPP).length * bulletLH + 3, 0);
    const tagsH = (proj.techTags as string[] | null)?.length ? smallFs + 6 : 0;
    const urlH = proj.liveUrl || proj.repoUrl ? smallFs + 6 : 0;
    return labelOffset + bodyFs + 10 + descH + bH + tagsH + urlH + 14;
  };
  const row2H = Math.max(
    user.projects.slice(0, 2).length > 0
      ? Math.max(...user.projects.slice(0, 2).map(projBuiltH))
      : bodyFs * 5,
    bodyFs * 5,
  );
  const sep4Y = row2Y + row2H + 14;

  // Heatmap + stats bar
  const heatY = sep4Y + 14;
  const heatH = 7 * 20 + 30; // 7 days × 20px cell height + label row
  const statsBarH = labelFs + smallFs + 20; // value + label text + padding
  const sep5Y = heatY + heatH + statsBarH + 14;
  const footerY = sep5Y + 8;
  const canvasH = footerY + 110 + pad; // Added vertical padding for 3-line footer

  return {
    innerW,
    gap3,
    gap2,
    colW3,
    colW2,
    col3X,
    col2X,
    headerH,
    headerY,
    sep1Y,
    bioLines,
    bioY,
    bioH,
    sep2Y,
    row1Y,
    row1H,
    sep3Y,
    row2Y,
    row2H,
    sep4Y,
    heatY,
    heatH,
    statsBarH,
    sep5Y,
    footerY,
    canvasH,
    labelOffset,
  };
}

// ─── GLASSMORPHISM ────────────────────────────────────────────────────────────

async function buildGlass(
  user: Awaited<ReturnType<typeof fetchCardData>>,
  sz: Sz,
  profileUrl: string,
): Promise<string> {
  const { w, pad, nameFs, hlFs, bodyFs, labelFs, smallFs, avatarR } = sz;
  const profile = user.profile!;

  const blue = "#34b4ff";
  const teal = "#2de9bc";
  const textOn = "#f6f8ff";
  const textMut = "#a3aecb";
  const textDim = "#5a6485";
  const FF = "sans-serif";

  const L = calcLayout(user, sz, 0.54, 24, 28);
  const {
    innerW,
    colW3,
    colW2,
    col3X,
    col2X,
    labelOffset,
    headerY,
    sep1Y,
    bioLines,
    bioY,
    sep2Y,
    row1Y,
    sep3Y,
    row2Y,
    sep4Y,
    heatY,
    heatH,
    statsBarH,
    sep5Y,
    footerY,
    canvasH,
  } = L;

  const displayName = truncate(profile.displayName || user.fullName, 30);
  const headline = truncate(profile.headline || user.email, 50);
  const location = profile.location || "";
  const techNames = profile.techStacks.map((pt) => pt.tech.name);
  const initial = displayName.slice(0, 1).toUpperCase();

  // ── Experience column ──────────────────────────────────────────────────────
  const expContent = (() => {
    if (user.experiences.length === 0)
      return `<text y="${labelOffset + smallFs}" font-family="${FF}" font-size="${smallFs}" fill="${textDim}">No experience added yet</text>`;
    let cy = labelOffset;
    return user.experiences
      .map((exp) => {
        let cyItem = cy;
        const roleY = cyItem + bodyFs;
        cyItem += bodyFs + 8;
        const compY = cyItem + smallFs;
        cyItem += smallFs + 8;
        const bulStart = cyItem + (smallFs - 1);
        const bul = renderBullets(
          exp.bullets as string[] | null,
          bulStart,
          smallFs - 1,
          textMut,
          FF,
          colW3,
        );
        cyItem += bul.totalHeight + 6;
        const locSvg = exp.location
          ? `<text y="${cyItem + smallFs - 1}" font-family="${FF}" font-size="${smallFs - 1}" fill="${textMut}">📍 ${escapeXml(exp.location)}</text>`
          : "";
        if (exp.location) cyItem += smallFs - 1 + 6;
        const dateY = cyItem + (smallFs - 1);
        cy = cyItem + (smallFs - 1) + 14;
        return `
        <text y="${roleY}" font-family="${FF}" font-size="${bodyFs}" fill="${textOn}" font-weight="700">${escapeXml(truncate(exp.role, 30))}</text>
        <text y="${compY}" font-family="${FF}" font-size="${smallFs}" fill="${blue}">${escapeXml(truncate(exp.company, 34))}</text>
        ${bul.svg}
        ${locSvg}
        <text y="${dateY}" font-family="${FF}" font-size="${smallFs - 1}" fill="${textDim}">${escapeXml(dateRange(exp.startDate, exp.endDate, exp.isCurrent))}</text>`;
      })
      .join("\n");
  })();

  // ── Skills column ──────────────────────────────────────────────────────────
  const skillGrid = renderSkills(
    techNames.slice(0, 16),
    labelOffset + 4,
    smallFs,
    textMut,
    FF,
    colW3,
  );
  const skillContent =
    skillGrid.svg ||
    `<text y="${labelOffset + smallFs}" font-family="${FF}" font-size="${smallFs}" fill="${textDim}">No skills added yet</text>`;

  // ── Achievements column ────────────────────────────────────────────────────
  const achItemH = smallFs + 6 + (smallFs - 2) + 8;
  const achContent = (() => {
    if (user.achievements.length === 0)
      return `<text y="${labelOffset + smallFs}" font-family="${FF}" font-size="${smallFs}" fill="${textDim}">No achievements yet</text>`;
    return user.achievements
      .slice(0, 5)
      .map((ach, i) => {
        const titleY = labelOffset + 4 + i * achItemH + smallFs;
        const dateY = titleY + (smallFs - 2) + 5;
        return `
        <text y="${titleY}" font-family="${FF}" font-size="${smallFs}" fill="${teal}" font-weight="700">✦ ${escapeXml(truncate(ach.title, 30))}</text>
        ${ach.date ? `<text y="${dateY}" font-family="${FF}" font-size="${smallFs - 2}" fill="${textDim}">${escapeXml(monthYear(ach.date))}</text>` : ""}`;
      })
      .join("");
  })();

  // ── Project columns ────────────────────────────────────────────────────────
  const buildProj = (proj: (typeof user.projects)[0]) => {
    let cy = labelOffset;
    const titleSvg = `<text y="${cy + bodyFs}" font-family="${FF}" font-size="${bodyFs}" fill="${blue}" font-weight="700">${escapeXml(truncate(proj.title, 40))}</text>`;
    cy += bodyFs + 10;
    const descLines = proj.description
      ? wrapText(proj.description, Math.floor(colW2 / (smallFs * 0.56))).slice(
          0,
          3,
        )
      : [];
    const descSvg = descLines
      .map(
        (l, li) =>
          `<text y="${cy + li * (smallFs + 5) + smallFs}" font-family="${FF}" font-size="${smallFs}" fill="${textMut}">${escapeXml(l)}</text>`,
      )
      .join("");
    cy += descLines.length * (smallFs + 5) + (descLines.length ? 6 : 0);
    const bul = renderBullets(
      proj.bullets as string[] | null,
      cy + smallFs - 1,
      smallFs - 1,
      textMut,
      FF,
      colW2,
      3,
    );
    cy += bul.totalHeight + 3;
    const tags =
      (proj.techTags as string[] | null)?.slice(0, 5).join("  ·  ") || "";
    const tagSvg = tags
      ? `<text y="${cy + smallFs}" font-family="${FF}" font-size="${smallFs - 1}" fill="${teal}">${escapeXml(truncate(tags, 52))}</text>`
      : "";
    if (tags) cy += smallFs + 6;
    const url = proj.liveUrl || proj.repoUrl || "";
    const urlSvg = url
      ? `<text y="${cy + smallFs}" font-family="${FF}" font-size="${smallFs - 1}" fill="${textDim}">${escapeXml(truncate(url, 46))}</text>`
      : "";
    return titleSvg + descSvg + bul.svg + tagSvg + urlSvg;
  };

  const proj0 = user.projects[0]
    ? buildProj(user.projects[0])
    : `<text y="${labelOffset + smallFs}" font-family="${FF}" font-size="${smallFs}" fill="${textDim}">No projects added yet</text>`;
  const proj1 = user.projects[1] ? buildProj(user.projects[1]) : "";
  const renderSocials = (links: typeof user.socialLinks) =>
    links
      .map((s) => {
        const p = s.platform.replace(/_/g, " ");
        return `${p.charAt(0) + p.slice(1).toLowerCase()}: ${cleanUrl(s.url)}`;
      })
      .join("  ·  ");
  const socials1 = renderSocials(user.socialLinks.slice(0, 2));
  const socials2 = renderSocials(user.socialLinks.slice(2, 4));

  // ── GitHub section ─────────────────────────────────────────────────────────
  const ghSection = await renderGithubSection(
    user.githubStats,
    pad,
    heatY,
    innerW,
    heatH,
    blue,
    textMut,
    textDim,
    labelFs,
    smallFs,
    profileUrl,
  );

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${canvasH}" viewBox="0 0 ${w} ${canvasH}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#060913"/>
      <stop offset="60%" stop-color="#090f1d"/>
      <stop offset="100%" stop-color="#0b0820"/>
    </linearGradient>
    <linearGradient id="avGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${blue}"/>
      <stop offset="100%" stop-color="#1a8fd1"/>
    </linearGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="28" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>
  </defs>

  <rect width="${w}" height="${canvasH}" fill="url(#bg)"/>
  <circle cx="${w * 0.12}" cy="200" r="${w * 0.2}" fill="${blue}" opacity="0.04" filter="url(#glow)"/>
  <circle cx="${w * 0.9}"  cy="600" r="${w * 0.14}" fill="${teal}" opacity="0.04" filter="url(#glow)"/>

  <!-- ══ HEADER ══ -->
  <circle cx="${pad + avatarR}" cy="${headerY + avatarR}" r="${avatarR}" fill="url(#avGrad)"/>
  <circle cx="${pad + avatarR}" cy="${headerY + avatarR}" r="${avatarR + 2}" fill="none" stroke="${blue}" stroke-width="1.5" stroke-opacity="0.4"/>
  <text x="${pad + avatarR}" y="${headerY + avatarR + nameFs * 0.34}" font-family="${FF}" font-size="${nameFs * 0.66}" fill="white" text-anchor="middle" font-weight="800">${initial}</text>
  <text x="${pad + avatarR * 2 + 28}" y="${headerY + avatarR * 0.55}" font-family="${FF}" font-size="${nameFs}" fill="${textOn}" font-weight="800">${escapeXml(displayName)}</text>
  <text x="${pad + avatarR * 2 + 28}" y="${headerY + avatarR * 0.55 + nameFs + 10}" font-family="${FF}" font-size="${hlFs}" fill="${blue}">${escapeXml(headline)}</text>
  ${location ? `<text x="${pad + avatarR * 2 + 28}" y="${headerY + avatarR * 0.55 + nameFs + hlFs + 28}" font-family="${FF}" font-size="${smallFs}" fill="${textMut}">📍 ${escapeXml(location)}</text>` : ""}
  <text x="${pad + avatarR * 2 + 28}" y="${headerY + avatarR * 0.55 + nameFs + hlFs + (location ? 52 : 28)}" font-family="${FF}" font-size="${smallFs}" fill="${textDim}">${escapeXml(user.email)}</text>

  <line x1="${pad}" y1="${sep1Y}" x2="${w - pad}" y2="${sep1Y}" stroke="${blue}" stroke-opacity="0.12" stroke-width="1"/>

  <!-- ══ BIO ══ -->
  ${bioLines.map((line, i) => `<text x="${pad}" y="${bioY + bodyFs + i * (bodyFs + 8)}" font-family="${FF}" font-size="${bodyFs}" fill="${textMut}">${escapeXml(line)}</text>`).join("")}

  <line x1="${pad}" y1="${sep2Y}" x2="${w - pad}" y2="${sep2Y}" stroke="${blue}" stroke-opacity="0.12" stroke-width="1"/>

  <!-- ══ ROW 1: LABELS (Experience | Skills | Achievements) ══ -->
  <text x="${col3X(0)}" y="${row1Y + labelFs}" font-family="${FF}" font-size="${labelFs}" fill="${blue}" font-weight="700" letter-spacing="1">EXPERIENCE</text>
  <line x1="${col3X(0)}" y1="${row1Y + labelFs + 4}" x2="${col3X(0) + 80}" y2="${row1Y + labelFs + 4}" stroke="${blue}" stroke-width="1.5" stroke-opacity="0.5"/>
  <text x="${col3X(1)}" y="${row1Y + labelFs}" font-family="${FF}" font-size="${labelFs}" fill="${teal}" font-weight="700" letter-spacing="1">SKILLS</text>
  <line x1="${col3X(1)}" y1="${row1Y + labelFs + 4}" x2="${col3X(1) + 50}" y2="${row1Y + labelFs + 4}" stroke="${teal}" stroke-width="1.5" stroke-opacity="0.5"/>
  <text x="${col3X(2)}" y="${row1Y + labelFs}" font-family="${FF}" font-size="${labelFs}" fill="${teal}" font-weight="700" letter-spacing="1">ACHIEVEMENTS</text>
  <line x1="${col3X(2)}" y1="${row1Y + labelFs + 4}" x2="${col3X(2) + 100}" y2="${row1Y + labelFs + 4}" stroke="${teal}" stroke-width="1.5" stroke-opacity="0.5"/>

  <line x1="${col3X(1) - L.gap3 / 2}" y1="${row1Y}" x2="${col3X(1) - L.gap3 / 2}" y2="${sep3Y}" stroke="white" stroke-opacity="0.05" stroke-width="1"/>
  <line x1="${col3X(2) - L.gap3 / 2}" y1="${row1Y}" x2="${col3X(2) - L.gap3 / 2}" y2="${sep3Y}" stroke="white" stroke-opacity="0.05" stroke-width="1"/>

  <g transform="translate(${col3X(0)},${row1Y})">${expContent}</g>
  <g transform="translate(${col3X(1)},${row1Y})">${skillContent}</g>
  <g transform="translate(${col3X(2)},${row1Y})">${achContent}</g>

  <line x1="${pad}" y1="${sep3Y}" x2="${w - pad}" y2="${sep3Y}" stroke="${blue}" stroke-opacity="0.12" stroke-width="1"/>

  <!-- ══ ROW 2: PROJECTS ══ -->
  <text x="${col2X(0)}" y="${row2Y + labelFs}" font-family="${FF}" font-size="${labelFs}" fill="${blue}" font-weight="700" letter-spacing="1">PROJECTS</text>
  <line x1="${col2X(0)}" y1="${row2Y + labelFs + 4}" x2="${col2X(0) + 65}" y2="${row2Y + labelFs + 4}" stroke="${blue}" stroke-width="1.5" stroke-opacity="0.5"/>
  <line x1="${col2X(1) - L.gap2 / 2}" y1="${row2Y}" x2="${col2X(1) - L.gap2 / 2}" y2="${sep4Y}" stroke="white" stroke-opacity="0.05" stroke-width="1"/>

  <g transform="translate(${col2X(0)},${row2Y})">${proj0}</g>
  ${proj1 ? `<g transform="translate(${col2X(1)},${row2Y})">${proj1}</g>` : ""}

  <line x1="${pad}" y1="${sep4Y}" x2="${w - pad}" y2="${sep4Y}" stroke="${blue}" stroke-opacity="0.12" stroke-width="1"/>

  <!-- ══ GITHUB ══ -->
  ${ghSection}
  <line x1="${pad}" y1="${sep5Y}" x2="${w - pad}" y2="${sep5Y}" stroke="${blue}" stroke-opacity="0.12" stroke-width="1"/>

  <!-- ══ FOOTER ══ -->
  <text x="${w / 2}" y="${footerY + 28}" font-family="${FF}" font-size="${smallFs}" fill="${textDim}" text-anchor="middle">${escapeXml(socials1)}</text>
  ${socials2 ? `<text x="${w / 2}" y="${footerY + 52}" font-family="${FF}" font-size="${smallFs}" fill="${textDim}" text-anchor="middle">${escapeXml(socials2)}</text>` : ""}
  <text x="${w / 2}" y="${footerY + (socials2 ? 78 : 52)}" font-family="${FF}" font-size="${smallFs - 1}" fill="${blue}" text-anchor="middle" font-weight="600">${escapeXml(profileUrl)}</text>
</svg>`;
}

// ─── NEOBRUTALISM ─────────────────────────────────────────────────────────────

async function buildNeo(
  user: Awaited<ReturnType<typeof fetchCardData>>,
  sz: Sz,
  profileUrl: string,
): Promise<string> {
  const { w, pad, nameFs, hlFs, bodyFs, labelFs, smallFs, avatarR } = sz;
  const profile = user.profile!;

  // Darker color palette
  const yellow = "#ffca28";
  const black = "#050505";
  const dark = "#111111"; // was #222222 — darker
  const muted = "#333333"; // was #555555 — darker
  const text1 = "#0a0a0a";
  const FF = "Courier New, monospace";

  const L = calcLayout(user, sz, 0.58, 20, 24);
  const {
    innerW,
    colW3,
    colW2,
    col3X,
    col2X,
    labelOffset,
    headerY,
    sep1Y,
    bioLines,
    bioY,
    sep2Y,
    row1Y,
    sep3Y,
    row2Y,
    sep4Y,
    heatY,
    heatH,
    statsBarH,
    sep5Y,
    footerY,
    canvasH,
  } = L;

  const displayName = truncate(profile.displayName || user.fullName, 26);
  const headline = truncate(profile.headline || user.email, 44);
  const location = profile.location || "";
  const techNames = profile.techStacks.map((pt) => pt.tech.name);
  const initial = displayName.slice(0, 1).toUpperCase();

  // Experience
  const expContent = (() => {
    if (user.experiences.length === 0)
      return `<text y="${labelOffset + smallFs}" font-family="${FF}" font-size="${smallFs}" fill="${muted}">No experience yet</text>`;
    let cy = labelOffset;
    return user.experiences
      .map((exp) => {
        let cyItem = cy;
        const roleY = cyItem + bodyFs;
        cyItem += bodyFs + 8;
        const compY = cyItem + smallFs;
        cyItem += smallFs + 8;
        const bulStart = cyItem + (smallFs - 1);
        const bul = renderBullets(
          exp.bullets as string[] | null,
          bulStart,
          smallFs - 1,
          dark,
          FF,
          colW3,
        );
        cyItem += bul.totalHeight + 6;
        const locSvg = exp.location
          ? `<text y="${cyItem + smallFs - 1}" font-family="${FF}" font-size="${smallFs - 1}" fill="${muted}">⌖ ${escapeXml(exp.location)}</text>`
          : "";
        if (exp.location) cyItem += smallFs - 1 + 6;
        const dateY = cyItem + (smallFs - 1);
        cy = cyItem + (smallFs - 1) + 14;
        return `
        <text y="${roleY}" font-family="${FF}" font-size="${bodyFs}" fill="${black}" font-weight="900">${escapeXml(truncate(exp.role, 30))}</text>
        <text y="${compY}" font-family="${FF}" font-size="${smallFs}" fill="${dark}" font-weight="700">${escapeXml(truncate(exp.company, 34))}</text>
        ${bul.svg}
        ${locSvg}
        <text y="${dateY}" font-family="${FF}" font-size="${smallFs - 1}" fill="${muted}">${escapeXml(dateRange(exp.startDate, exp.endDate, exp.isCurrent))}</text>`;
      })
      .join("\n");
  })();

  // Skills
  const skillGrid = renderSkills(
    techNames.slice(0, 16),
    labelOffset + 4,
    smallFs,
    dark,
    FF,
    colW3,
  );
  const skillContent =
    skillGrid.svg ||
    `<text y="${labelOffset + smallFs}" font-family="${FF}" font-size="${smallFs}" fill="${muted}">No skills yet</text>`;

  // Achievements
  const achItemH = smallFs + 6 + (smallFs - 2) + 8;
  const achContent = (() => {
    if (user.achievements.length === 0)
      return `<text y="${labelOffset + smallFs}" font-family="${FF}" font-size="${smallFs}" fill="${muted}">No achievements yet</text>`;
    return user.achievements
      .slice(0, 5)
      .map((ach, i) => {
        const titleY = labelOffset + 4 + i * achItemH + smallFs;
        const dateY = titleY + (smallFs - 2) + 5;
        return `
        <text y="${titleY}" font-family="${FF}" font-size="${smallFs}" fill="${black}" font-weight="900">→ ${escapeXml(truncate(ach.title, 30))}</text>
        ${ach.date ? `<text y="${dateY}" font-family="${FF}" font-size="${smallFs - 2}" fill="${muted}">${escapeXml(monthYear(ach.date))}</text>` : ""}`;
      })
      .join("");
  })();

  // Projects
  const buildProj = (proj: (typeof user.projects)[0]) => {
    let cy = labelOffset;
    const titleSvg = `<text y="${cy + bodyFs}" font-family="${FF}" font-size="${bodyFs}" fill="${black}" font-weight="900">${escapeXml(truncate(proj.title, 40))}</text>`;
    cy += bodyFs + 10;
    const descLines = proj.description
      ? wrapText(proj.description, Math.floor(colW2 / (smallFs * 0.58))).slice(
          0,
          3,
        )
      : [];
    const descSvg = descLines
      .map(
        (l, li) =>
          `<text y="${cy + li * (smallFs + 5) + smallFs}" font-family="${FF}" font-size="${smallFs}" fill="${dark}">${escapeXml(l)}</text>`,
      )
      .join("");
    cy += descLines.length * (smallFs + 5) + (descLines.length ? 6 : 0);
    const bul = renderBullets(
      proj.bullets as string[] | null,
      cy + smallFs - 1,
      smallFs - 1,
      dark,
      FF,
      colW2,
      3,
    );
    cy += bul.totalHeight + 3;
    const tags =
      (proj.techTags as string[] | null)?.slice(0, 4).join(", ") || "";
    const tagSvg = tags
      ? `<text y="${cy + smallFs}" font-family="${FF}" font-size="${smallFs - 1}" fill="${muted}">${escapeXml(truncate(tags, 48))}</text>`
      : "";
    return titleSvg + descSvg + bul.svg + tagSvg;
  };

  const proj0 = user.projects[0]
    ? buildProj(user.projects[0])
    : `<text y="${labelOffset + smallFs}" font-family="${FF}" font-size="${smallFs}" fill="${muted}">No projects yet</text>`;
  const proj1 = user.projects[1] ? buildProj(user.projects[1]) : "";
  const renderSocials = (links: typeof user.socialLinks) =>
    links
      .map((s) => {
        const p = s.platform.replace(/_/g, " ");
        return `${p.charAt(0) + p.slice(1).toLowerCase()}: ${cleanUrl(s.url)}`;
      })
      .join(" | ");
  const socials1 = renderSocials(user.socialLinks.slice(0, 2));
  const socials2 = renderSocials(user.socialLinks.slice(2, 4));

  // GitHub — use black+dark colors
  const ghSection = await renderGithubSection(
    user.githubStats,
    pad,
    heatY,
    innerW,
    heatH,
    black,
    dark,
    muted,
    labelFs,
    smallFs,
    profileUrl,
  );

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${canvasH}" viewBox="0 0 ${w} ${canvasH}">
  <rect width="${w}" height="${canvasH}" fill="#faf8f2"/>
  <rect x="${pad - 6}" y="${pad - 6}" width="${innerW + 12}" height="${canvasH - pad * 2 + 12}" fill="${black}"/>
  <rect x="${pad}" y="${pad}" width="${innerW}" height="${canvasH - pad * 2}" fill="#fefefe" stroke="${black}" stroke-width="2.5"/>

  <!-- HEADER -->
  <rect x="${pad}" y="${pad}" width="${innerW}" height="${avatarR * 2 + 24}" fill="${yellow}" stroke="${black}" stroke-width="2.5"/>
  <circle cx="${pad + avatarR + 20}" cy="${pad + avatarR + 12}" r="${avatarR}" fill="#fff" stroke="${black}" stroke-width="3"/>
  <text x="${pad + avatarR + 20}" y="${pad + avatarR + 12 + nameFs * 0.33}" font-family="${FF}" font-size="${nameFs * 0.62}" fill="${black}" text-anchor="middle" font-weight="900">${initial}</text>
  <text x="${pad + avatarR * 2 + 44}" y="${pad + avatarR * 0.5 + 12}" font-family="${FF}" font-size="${nameFs}" fill="${black}" font-weight="900">${escapeXml(displayName)}</text>
  <text x="${pad + avatarR * 2 + 44}" y="${pad + avatarR * 0.5 + 12 + nameFs + 10}" font-family="${FF}" font-size="${hlFs}" fill="${dark}" font-weight="700">${escapeXml(headline)}</text>
  ${location ? `<text x="${pad + avatarR * 2 + 44}" y="${pad + avatarR * 0.5 + 12 + nameFs + hlFs + 26}" font-family="${FF}" font-size="${smallFs}" fill="${dark}">⌖ ${escapeXml(location)}</text>` : ""}

  <line x1="${pad}" y1="${sep1Y}" x2="${w - pad}" y2="${sep1Y}" stroke="${black}" stroke-width="2.5"/>

  <!-- BIO -->
  ${bioLines.map((line, i) => `<text x="${pad + 10}" y="${bioY + bodyFs + i * (bodyFs + 6)}" font-family="${FF}" font-size="${bodyFs}" fill="${dark}" font-weight="600">${escapeXml(line)}</text>`).join("")}

  <line x1="${pad}" y1="${sep2Y}" x2="${w - pad}" y2="${sep2Y}" stroke="${black}" stroke-width="2.5"/>

  <!-- ROW 1 LABELS -->
  ${["EXPERIENCE", "SKILLS", "ACHIEVEMENTS"]
    .map(
      (lbl, idx) => `
    <rect x="${col3X(idx)}" y="${row1Y}" width="${L.colW3}" height="${labelFs + 10}" fill="${black}"/>
    <text x="${col3X(idx) + L.colW3 / 2}" y="${row1Y + labelFs + 2}" font-family="${FF}" font-size="${labelFs}" fill="${yellow}" text-anchor="middle" font-weight="900">${lbl}</text>`,
    )
    .join("")}

  <line x1="${col3X(1) - L.gap3 / 2}" y1="${sep2Y}" x2="${col3X(1) - L.gap3 / 2}" y2="${sep3Y}" stroke="${black}" stroke-width="1.5"/>
  <line x1="${col3X(2) - L.gap3 / 2}" y1="${sep2Y}" x2="${col3X(2) - L.gap3 / 2}" y2="${sep3Y}" stroke="${black}" stroke-width="1.5"/>

  <g transform="translate(${col3X(0)},${row1Y})">${expContent}</g>
  <g transform="translate(${col3X(1)},${row1Y})">${skillContent}</g>
  <g transform="translate(${col3X(2)},${row1Y})">${achContent}</g>

  <line x1="${pad}" y1="${sep3Y}" x2="${w - pad}" y2="${sep3Y}" stroke="${black}" stroke-width="2.5"/>

  <!-- ROW 2: PROJECTS LABEL -->
  <rect x="${pad}" y="${row2Y}" width="${innerW}" height="${labelFs + 10}" fill="${black}"/>
  <text x="${pad + innerW / 2}" y="${row2Y + labelFs + 2}" font-family="${FF}" font-size="${labelFs}" fill="${yellow}" text-anchor="middle" font-weight="900">PROJECTS</text>

  <line x1="${col2X(1) - L.gap2 / 2}" y1="${row2Y}" x2="${col2X(1) - L.gap2 / 2}" y2="${sep4Y}" stroke="${black}" stroke-width="1.5"/>

  <g transform="translate(${col2X(0)},${row2Y})">${proj0}</g>
  ${proj1 ? `<g transform="translate(${col2X(1)},${row2Y})">${proj1}</g>` : ""}

  <line x1="${pad}" y1="${sep4Y}" x2="${w - pad}" y2="${sep4Y}" stroke="${black}" stroke-width="2.5"/>

  <!-- GITHUB -->
  <g transform="translate(10,0)">${ghSection}</g>

  <line x1="${pad}" y1="${sep5Y}" x2="${w - pad}" y2="${sep5Y}" stroke="${black}" stroke-width="2.5"/>

  <!-- FOOTER -->
  <rect x="${pad}" y="${footerY}" width="${innerW}" height="${socials2 ? 100 : 70}" fill="${black}"/>
  <text x="${w / 2}" y="${footerY + 28}" font-family="${FF}" font-size="${smallFs}" fill="${yellow}" font-weight="700" text-anchor="middle">${escapeXml(socials1)}</text>
  ${socials2 ? `<text x="${w / 2}" y="${footerY + 52}" font-family="${FF}" font-size="${smallFs}" fill="${yellow}" font-weight="700" text-anchor="middle">${escapeXml(socials2)}</text>` : ""}
  <text x="${w / 2}" y="${footerY + (socials2 ? 80 : 56)}" font-family="${FF}" font-size="${smallFs - 1}" fill="white" text-anchor="middle">${escapeXml(profileUrl)}</text>
</svg>`;
}

// ─── APPLE / MINIMAL ─────────────────────────────────────────────────────────

async function buildApple(
  user: Awaited<ReturnType<typeof fetchCardData>>,
  sz: Sz,
  profileUrl: string,
): Promise<string> {
  const { w, pad, nameFs, hlFs, bodyFs, labelFs, smallFs, avatarR } = sz;
  const profile = user.profile!;

  const blue = "#007aff";
  const green = "#34c759";
  const purple = "#5856d6";
  const orange = "#ff9500";
  const gray1 = "#1d1d1f";
  const gray2 = "#6e6e73";
  const gray3 = "#aeaeb2";
  const bgGray = "#f5f5f7";
  const FF = "-apple-system, sans-serif";

  const L = calcLayout(user, sz, 0.56, 28, 32);
  const {
    innerW,
    colW3,
    colW2,
    col3X,
    col2X,
    labelOffset,
    headerY,
    sep1Y,
    bioLines,
    bioY,
    sep2Y,
    row1Y,
    sep3Y,
    row2Y,
    sep4Y,
    heatY,
    heatH,
    statsBarH,
    sep5Y,
    footerY,
    canvasH,
  } = L;

  const displayName = truncate(profile.displayName || user.fullName, 30);
  const headline = truncate(profile.headline || user.email, 50);
  const location = profile.location || "";
  const techNames = profile.techStacks.map((pt) => pt.tech.name);
  const initial = displayName.slice(0, 1).toUpperCase();

  // Experience
  const expContent = (() => {
    if (user.experiences.length === 0)
      return `<text y="${labelOffset + smallFs}" font-family="${FF}" font-size="${smallFs}" fill="${gray3}">No experience added yet</text>`;
    let cy = labelOffset;
    return user.experiences
      .map((exp) => {
        let cyItem = cy;
        const roleY = cyItem + bodyFs;
        cyItem += bodyFs + 8;
        const compY = cyItem + smallFs;
        cyItem += smallFs + 8;
        const bulStart = cyItem + (smallFs - 1);
        const bul = renderBullets(
          exp.bullets as string[] | null,
          bulStart,
          smallFs - 1,
          gray2,
          FF,
          colW3,
        );
        cyItem += bul.totalHeight + 6;
        const locSvg = exp.location
          ? `<text y="${cyItem + smallFs - 1}" font-family="${FF}" font-size="${smallFs - 1}" fill="${gray2}">${escapeXml(exp.location)}</text>`
          : "";
        if (exp.location) cyItem += smallFs - 1 + 6;
        const dateY = cyItem + (smallFs - 1);
        cy = cyItem + (smallFs - 1) + 14;
        return `
        <text y="${roleY}" font-family="${FF}" font-size="${bodyFs}" fill="${gray1}" font-weight="600">${escapeXml(truncate(exp.role, 30))}</text>
        <text y="${compY}" font-family="${FF}" font-size="${smallFs}" fill="${blue}">${escapeXml(truncate(exp.company, 34))}</text>
        ${bul.svg}
        ${locSvg}
        <text y="${dateY}" font-family="${FF}" font-size="${smallFs - 1}" fill="${gray3}">${escapeXml(dateRange(exp.startDate, exp.endDate, exp.isCurrent))}</text>`;
      })
      .join("\n");
  })();

  // Skills
  const skillGrid = renderSkills(
    techNames.slice(0, 16),
    labelOffset + 4,
    smallFs,
    gray2,
    FF,
    colW3,
  );
  const skillContent =
    skillGrid.svg ||
    `<text y="${labelOffset + smallFs}" font-family="${FF}" font-size="${smallFs}" fill="${gray3}">No skills added yet</text>`;

  // Achievements
  const achItemH = smallFs + 6 + (smallFs - 2) + 8;
  const achContent = (() => {
    if (user.achievements.length === 0)
      return `<text y="${labelOffset + smallFs}" font-family="${FF}" font-size="${smallFs}" fill="${gray3}">No achievements yet</text>`;
    return user.achievements
      .slice(0, 5)
      .map((ach, i) => {
        const titleY = labelOffset + 4 + i * achItemH + smallFs;
        const dateY = titleY + (smallFs - 2) + 5;
        return `
        <text y="${titleY}" font-family="${FF}" font-size="${smallFs}" fill="${orange}">· ${escapeXml(truncate(ach.title, 30))}</text>
        ${ach.date ? `<text y="${dateY}" font-family="${FF}" font-size="${smallFs - 2}" fill="${gray3}">${escapeXml(monthYear(ach.date))}</text>` : ""}`;
      })
      .join("");
  })();

  // Projects
  const buildProj = (proj: (typeof user.projects)[0]) => {
    let cy = labelOffset;
    const titleSvg = `<text y="${cy + bodyFs}" font-family="${FF}" font-size="${bodyFs}" fill="${blue}" font-weight="600">${escapeXml(truncate(proj.title, 40))}</text>`;
    cy += bodyFs + 10;
    const descLines = proj.description
      ? wrapText(proj.description, Math.floor(colW2 / (smallFs * 0.56))).slice(
          0,
          3,
        )
      : [];
    const descSvg = descLines
      .map(
        (l, li) =>
          `<text y="${cy + li * (smallFs + 5) + smallFs}" font-family="${FF}" font-size="${smallFs}" fill="${gray2}">${escapeXml(l)}</text>`,
      )
      .join("");
    cy += descLines.length * (smallFs + 5) + (descLines.length ? 6 : 0);
    const bul = renderBullets(
      proj.bullets as string[] | null,
      cy + smallFs - 1,
      smallFs - 1,
      gray2,
      FF,
      colW2,
      3,
    );
    cy += bul.totalHeight + 3;
    const tags =
      (proj.techTags as string[] | null)?.slice(0, 5).join("  ·  ") || "";
    const tagSvg = tags
      ? `<text y="${cy + smallFs}" font-family="${FF}" font-size="${smallFs - 1}" fill="${purple}">${escapeXml(truncate(tags, 52))}</text>`
      : "";
    if (tags) cy += smallFs + 6;
    const url = proj.liveUrl || proj.repoUrl || "";
    const urlSvg = url
      ? `<text y="${cy + smallFs}" font-family="${FF}" font-size="${smallFs - 1}" fill="${gray3}">${escapeXml(truncate(url, 46))}</text>`
      : "";
    return titleSvg + descSvg + bul.svg + tagSvg + urlSvg;
  };

  const proj0 = user.projects[0]
    ? buildProj(user.projects[0])
    : `<text y="${labelOffset + smallFs}" font-family="${FF}" font-size="${smallFs}" fill="${gray3}">No projects added yet</text>`;
  const proj1 = user.projects[1] ? buildProj(user.projects[1]) : "";
  const renderSocials = (links: typeof user.socialLinks) =>
    links
      .map((s) => {
        const p = s.platform.replace(/_/g, " ");
        return `${p.charAt(0) + p.slice(1).toLowerCase()}: ${cleanUrl(s.url)}`;
      })
      .join("  ·  ");
  const socials1 = renderSocials(user.socialLinks.slice(0, 2));
  const socials2 = renderSocials(user.socialLinks.slice(2, 4));

  const ghSection = await renderGithubSection(
    user.githubStats,
    pad,
    heatY,
    innerW,
    heatH,
    blue,
    gray2,
    gray3,
    labelFs,
    smallFs,
    profileUrl,
  );

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${canvasH}" viewBox="0 0 ${w} ${canvasH}">
  <rect width="${w}" height="${canvasH}" fill="white"/>
  <rect width="${w}" height="${avatarR * 2 + pad + 28}" fill="${bgGray}"/>
  <line x1="0" y1="${avatarR * 2 + pad + 28}" x2="${w}" y2="${avatarR * 2 + pad + 28}" stroke="#d2d2d7" stroke-width="1"/>

  <!-- HEADER -->
  <circle cx="${pad + avatarR + 12}" cy="${pad + avatarR + 12}" r="${avatarR + 3}" fill="none" stroke="${blue}" stroke-width="1.5" stroke-opacity="0.3"/>
  <circle cx="${pad + avatarR + 12}" cy="${pad + avatarR + 12}" r="${avatarR}" fill="#e5e5ea"/>
  <text x="${pad + avatarR + 12}" y="${pad + avatarR + 12 + nameFs * 0.33}" font-family="${FF}" font-size="${nameFs * 0.62}" fill="${gray2}" text-anchor="middle" font-weight="300">${initial}</text>
  <text x="${pad + avatarR * 2 + 36}" y="${pad + avatarR * 0.45 + 16}" font-family="${FF}" font-size="${nameFs}" fill="${gray1}" font-weight="700">${escapeXml(displayName)}</text>
  <text x="${pad + avatarR * 2 + 36}" y="${pad + avatarR * 0.45 + 16 + nameFs + 10}" font-family="${FF}" font-size="${hlFs}" fill="${blue}">${escapeXml(headline)}</text>
  ${location ? `<text x="${pad + avatarR * 2 + 36}" y="${pad + avatarR * 0.45 + 16 + nameFs + hlFs + 28}" font-family="${FF}" font-size="${smallFs}" fill="${gray2}">${escapeXml(location)}</text>` : ""}
  <text x="${pad + avatarR * 2 + 36}" y="${pad + avatarR * 0.45 + 16 + nameFs + hlFs + (location ? 50 : 28)}" font-family="${FF}" font-size="${smallFs}" fill="${gray3}">${escapeXml(user.email)}</text>

  <line x1="${pad}" y1="${sep1Y}" x2="${w - pad}" y2="${sep1Y}" stroke="#d2d2d7" stroke-width="1"/>

  <!-- BIO -->
  ${bioLines.map((line, i) => `<text x="${pad}" y="${bioY + bodyFs + i * (bodyFs + 8)}" font-family="${FF}" font-size="${bodyFs}" fill="${gray2}">${escapeXml(line)}</text>`).join("")}

  <line x1="${pad}" y1="${sep2Y}" x2="${w - pad}" y2="${sep2Y}" stroke="#d2d2d7" stroke-width="1"/>

  <!-- ROW 1 LABELS -->
  ${[
    ["EXPERIENCE", blue],
    ["SKILLS", green],
    ["ACHIEVEMENTS", orange],
  ]
    .map(
      ([lbl, clr], idx) => `
    <text x="${col3X(idx)}" y="${row1Y + labelFs}" font-family="${FF}" font-size="${labelFs - 1}" fill="${clr}" font-weight="600" letter-spacing="0.5">${lbl}</text>
    <line x1="${col3X(idx)}" y1="${row1Y + labelFs + 5}" x2="${col3X(idx) + lbl.length * (labelFs * 0.56)}" y2="${row1Y + labelFs + 5}" stroke="${clr}" stroke-width="1.5" stroke-linecap="round" stroke-opacity="0.6"/>`,
    )
    .join("")}

  <line x1="${col3X(1) - L.gap3 / 2}" y1="${sep2Y}" x2="${col3X(1) - L.gap3 / 2}" y2="${sep3Y}" stroke="#e5e5ea" stroke-width="1"/>
  <line x1="${col3X(2) - L.gap3 / 2}" y1="${sep2Y}" x2="${col3X(2) - L.gap3 / 2}" y2="${sep3Y}" stroke="#e5e5ea" stroke-width="1"/>

  <g transform="translate(${col3X(0)},${row1Y})">${expContent}</g>
  <g transform="translate(${col3X(1)},${row1Y})">${skillContent}</g>
  <g transform="translate(${col3X(2)},${row1Y})">${achContent}</g>

  <line x1="${pad}" y1="${sep3Y}" x2="${w - pad}" y2="${sep3Y}" stroke="#d2d2d7" stroke-width="1"/>

  <!-- ROW 2: PROJECTS -->
  <text x="${col2X(0)}" y="${row2Y + labelFs}" font-family="${FF}" font-size="${labelFs - 1}" fill="${blue}" font-weight="600">PROJECTS</text>
  <line x1="${col2X(0)}" y1="${row2Y + labelFs + 5}" x2="${col2X(0) + 68}" y2="${row2Y + labelFs + 5}" stroke="${blue}" stroke-width="1.5" stroke-linecap="round" stroke-opacity="0.6"/>
  <line x1="${col2X(1) - L.gap2 / 2}" y1="${row2Y}" x2="${col2X(1) - L.gap2 / 2}" y2="${sep4Y}" stroke="#e5e5ea" stroke-width="1"/>

  <g transform="translate(${col2X(0)},${row2Y})">${proj0}</g>
  ${proj1 ? `<g transform="translate(${col2X(1)},${row2Y})">${proj1}</g>` : ""}

  <line x1="${pad}" y1="${sep4Y}" x2="${w - pad}" y2="${sep4Y}" stroke="#d2d2d7" stroke-width="1"/>

  <!-- GITHUB -->
  ${ghSection}
  <line x1="${pad}" y1="${sep5Y}" x2="${w - pad}" y2="${sep5Y}" stroke="#d2d2d7" stroke-width="1"/>

  <!-- FOOTER -->
  <rect y="${footerY}" width="${w}" height="${canvasH - footerY}" fill="${bgGray}"/>
  <text x="${w / 2}" y="${footerY + 34}" font-family="${FF}" font-size="${smallFs}" fill="${gray3}" text-anchor="middle">${escapeXml(socials1)}</text>
  ${socials2 ? `<text x="${w / 2}" y="${footerY + 58}" font-family="${FF}" font-size="${smallFs}" fill="${gray3}" text-anchor="middle">${escapeXml(socials2)}</text>` : ""}
  <text x="${w / 2}" y="${footerY + (socials2 ? 84 : 58)}" font-family="${FF}" font-size="${smallFs - 1}" fill="${blue}" text-anchor="middle">${escapeXml(profileUrl)}</text>
</svg>`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const generateProfileCard = async (
  username: string,
  size: string = "1080x1080",
  forcedTheme?: "GLASSMORPHISM" | "NEOBRUTALISM" | "APPLE",
): Promise<Buffer> => {
  const sz = SIZES[size] || SIZES["1080x1080"];
  const user = await fetchCardData(username);
  const profileUrl = `${env.FRONTEND_URL}/u/${username}`;
  const theme = forcedTheme || user.profile!.cardTheme || "GLASSMORPHISM";

  let svg: string;
  if (theme === "NEOBRUTALISM") svg = await buildNeo(user, sz, profileUrl);
  else if (theme === "APPLE") svg = await buildApple(user, sz, profileUrl);
  else svg = await buildGlass(user, sz, profileUrl);

  return sharp(Buffer.from(svg)).png().toBuffer();
};
