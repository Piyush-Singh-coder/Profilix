import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { AlignmentType, Document, ExternalHyperlink, Packer, Paragraph, TextRun } from "docx";
import { prisma } from "../config/database";
import { tailorBulletsToJob, batchTailorBullets } from "./ai.service";
import { BadRequestError } from "../utils/errors";

type ResumeFormat = "pdf" | "docx";
type ResumeTemplate = "ATS" | "DESIGN" | "MODERN" | "ENHANCV";

const THEME_COLOR_MAP: Record<string, string> = {
  GLASS: "#34b4ff",
  BRUTALISM: "#121212",
  CLAY: "#e66d47",
  MINIMAL: "#111111",
  NEON: "#2d8cff",
  RETRO: "#39ff14",
  AURORA: "#4fa8ff",
  SKEUOMORPHIC: "#c3a069",
};

interface ResumeConfig {
  sections: {
    summary: boolean;
    experience: boolean;
    education: boolean;
    projects: boolean;
    skills: boolean;
    achievements: boolean;
    customSections: boolean;
  };
  limits: {
    projects: number;
    experiences: number;
    achievements: number;
    educations: number;
  };
  styling: {
    fontFamily: string;
    fontSize: string;
  };
}

function parseResumeConfig(profile: any): ResumeConfig {
  const defaults: ResumeConfig = {
    sections: {
      summary: true,
      experience: true,
      education: true,
      projects: true,
      skills: true,
      achievements: true,
      customSections: true,
    },
    limits: {
      projects: 3,
      experiences: 5,
      achievements: 5,
      educations: 3,
    },
    styling: {
      fontFamily: "Arial",
      fontSize: "9.5pt",
    },
  };

  if (!profile?.resumeConfig) return defaults;
  
  try {
    const config = typeof profile.resumeConfig === "string" 
      ? JSON.parse(profile.resumeConfig) 
      : profile.resumeConfig;
      
    return {
      sections: { ...defaults.sections, ...config.sections },
      limits: { ...defaults.limits, ...config.limits },
      styling: { ...defaults.styling, ...config.styling },
    };
  } catch {
    return defaults;
  }
}

function getFontFamilyCss(fontFamily: string) {
  const serifFonts = ["Georgia", "Times New Roman", "Garamond"];
  const fallback = serifFonts.includes(fontFamily) ? "serif" : "sans-serif";
  return `font-family: "${fontFamily}", ${fallback};`;
}

function monthYear(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function range(start: Date, end: Date | null, isCurrent: boolean) {
  const startText = monthYear(start.toISOString());
  const endText = isCurrent || !end ? "Present" : monthYear(end.toISOString());
  return `${startText} — ${endText}`;
}

function cleanUrl(url: string) {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}

/** Returns the first `maxSentences` complete sentences from a block of text. */
function capToSentences(text: string, maxSentences = 2): string {
  const sentenceEnds = /(?<=[.!?])\s+/g;
  const parts: string[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = sentenceEnds.exec(text)) !== null) {
    parts.push(text.slice(last, match.index + 1).trim());
    last = match.index + match[0].length;
    if (parts.length >= maxSentences) break;
  }
  if (parts.length < maxSentences && last < text.length) {
    const remainder = text.slice(last).trim();
    if (remainder) parts.push(remainder);
  }
  return parts.join(" ");
}

export async function getResumeData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      fullName: true,
      email: true,
      username: true,
      profile: {
        include: {
          techStacks: {
            include: { tech: true },
            orderBy: { assignedAt: "asc" },
          },
        },
      },
    },
  });
  if (!user) throw new BadRequestError("User not found");

  const [projects, experiences, achievements, educations, socialLinks, profileSkills, customSections] = await Promise.all([
    prisma.project.findMany({
      where: { userId },
      orderBy: [{ isPinned: "desc" }, { displayOrder: "asc" }],
    }),
    prisma.experience.findMany({
      where: { userId },
      orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
    }),
    prisma.achievement.findMany({
      where: { userId },
      orderBy: [{ displayOrder: "asc" }, { date: "desc" }],
    }),
    prisma.education.findMany({
      where: { userId },
      orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
    }),
    prisma.socialLink.findMany({
      where: { userId },
      orderBy: [{ platform: "asc" }],
    }),
    prisma.profileSkill.findMany({
      where: { userId },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.customSection.findMany({
      where: { userId },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  return { user, projects, experiences, achievements, educations, socialLinks, profileSkills, customSections };
}

export async function maybeTailorWithAI(args: {
  jobDescription?: string;
  useAI?: boolean;
  data: Awaited<ReturnType<typeof getResumeData>>;
}) {
  const { jobDescription, useAI, data } = args;
  if (!useAI || !jobDescription?.trim()) return data;

  const items: Array<{ id: string; context: string; bullets: string[] }> = [];

  data.experiences.forEach((exp) => {
    const bullets = Array.isArray(exp.bullets) ? (exp.bullets as string[]) : [];
    if (bullets.length > 0) {
      items.push({
        id: exp.id,
        context: `${exp.role} @ ${exp.company}`,
        bullets,
      });
    }
  });

  data.projects.forEach((proj) => {
    const bullets = Array.isArray(proj.bullets) ? (proj.bullets as string[]) : [];
    if (bullets.length > 0) {
      items.push({
        id: proj.id,
        context: `Project: ${proj.title}`,
        bullets,
      });
    }
  });

  if (items.length === 0) return data;

  console.log(`[BatchAI] Tailoring ${items.length} items for job description...`);

  const results = await batchTailorBullets({
    jobDescription: jobDescription.trim(),
    items,
  });

  const nextExperiences = data.experiences.map((exp) => {
    const tailored = results[exp.id];
    return tailored ? { ...exp, bullets: tailored } : exp;
  });

  const nextProjects = data.projects.map((proj) => {
    const tailored = results[proj.id];
    return tailored ? { ...proj, bullets: tailored } : proj;
  });

  return { ...data, experiences: nextExperiences, projects: nextProjects };
}

function escapeHtml(input: string | null | undefined) {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildDesignResumeHtml(data: Awaited<ReturnType<typeof getResumeData>>, themeName: string) {
  const { user, socialLinks, experiences, projects, educations, achievements, profileSkills, customSections } = data;
  const config = parseResumeConfig(user.profile);
  const primaryColor = THEME_COLOR_MAP[themeName] || "#111111";

  // Grouped Skills (custom or legacy fallback)
  let skillsHtml = "";
  if (profileSkills && profileSkills.length > 0) {
    skillsHtml = profileSkills
      .map((ps) =>
        `<div class="s-label">${escapeHtml(ps.category)}</div><div class="s-value">${escapeHtml(ps.skills.join(", "))}</div>`
      ).join("");
  } else {
    const categoryLabels: Record<string, string> = {
      LANGUAGE: "Languages",
      FRONTEND: "Frontend",
      BACKEND: "Backend",
      DATABASE: "Database",
      DEVOPS: "Tools",
      TOOL: "Tools",
      CLOUD: "Cloud",
      CS_CORE: "CS Core",
      OTHER: "Other"
    };
    const groupedSkills: Record<string, string[]> = {};
    (user.profile?.techStacks || []).forEach((ps) => {
      const label = categoryLabels[ps.tech.category] || categoryLabels.OTHER;
      if (!groupedSkills[label]) groupedSkills[label] = [];
      groupedSkills[label].push(ps.tech.name);
    });
    skillsHtml = Object.entries(groupedSkills)
      .map(([label, names]) =>
        `<div class="s-label">${escapeHtml(label)}</div><div class="s-value">${escapeHtml(names.join(", "))}</div>`
      ).join("");
  }

  const socialHtml = socialLinks.map(s => {
    const platform = s.platform.replace(/_/g, " ");
    const label = platform.charAt(0) + platform.slice(1).toLowerCase();
    return `<div class="s-label">${escapeHtml(label)}</div><a href="${s.url}" class="s-link">${escapeHtml(cleanUrl(s.url))}</a>`;
  }).join("");

  // Slice list based on limits config
  const experiencesToShow = experiences.slice(0, config.limits.experiences);
  const projectsToShow = projects.slice(0, config.limits.projects);
  const educationsToShow = educations.slice(0, config.limits.educations);
  const achievementsToShow = achievements.slice(0, config.limits.achievements);

  const expHtml = experiencesToShow.map(exp => {
    const bullets = Array.isArray(exp.bullets) ? (exp.bullets as string[]) : [];
    return `
      <div class="m-item">
        <div class="m-row">
          <div class="m-left"><div class="m-title">${escapeHtml(exp.role)}</div><div class="m-subtitle">${escapeHtml(exp.company)}</div></div>
          <div class="m-right">${escapeHtml(range(exp.startDate, exp.endDate, exp.isCurrent))}</div>
        </div>
        ${bullets.length ? `<ul>${bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
      </div>
    `;
  }).join("");

  const projHtml = projectsToShow.map(p => {
    const bullets = Array.isArray(p.bullets) ? (p.bullets as string[]) : [];
    const linkParts: string[] = [];
    if (p.liveUrl) linkParts.push(`<strong>Live:</strong> <a href="${p.liveUrl}" style="color: inherit; text-decoration: none;">${escapeHtml(cleanUrl(p.liveUrl))}</a>`);
    if (p.repoUrl) linkParts.push(`<strong>GitHub:</strong> <a href="${p.repoUrl}" style="color: inherit; text-decoration: none;">${escapeHtml(cleanUrl(p.repoUrl))}</a>`);
    const links = linkParts.join(" · ");
    return `
      <div class="m-item">
        <div class="m-row">
          <div class="m-left"><div class="m-title">${escapeHtml(p.title)}</div>${links ? `<div class="m-subtitle">${links}</div>` : ""}</div>
        </div>
        ${bullets.length ? `<ul>${bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
      </div>
    `;
  }).join("");

  const eduHtml = educationsToShow.map(edu => {
    const degree = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ");
    const scoreHtml = edu.score ? `<div class="s-value" style="font-size: 8pt; color: #94a3b8; margin-top: 2px;">${escapeHtml(edu.scoreType || "CGPA")}: ${escapeHtml(edu.score)}</div>` : "";
    return `<div class="s-label">${escapeHtml(edu.school)}</div>${degree ? `<div class="s-value">${escapeHtml(degree)}</div>` : ""}${scoreHtml}<div class="s-date">${escapeHtml(range(edu.startDate, edu.endDate, edu.isCurrent))}</div>`;
  }).join("");

  const achHtml = achievementsToShow.length ? `<ul>${achievementsToShow.map(a => {
    const parts = [a.title, a.provider].filter(Boolean);
    const dateHtml = a.date ? `<span style="float: right;">${escapeHtml(monthYear(a.date.toISOString()))}</span>` : "";
    return `<li style="margin-bottom: 4px;">${dateHtml}${escapeHtml(parts.join(" | "))}</li>`;
  }).join("")}</ul>` : "";

  const customSecsHtml = customSections && customSections.length > 0
    ? customSections.map(cs => `
      <div class="m-section">${escapeHtml(cs.title)}</div>
      <div class="m-item">
        <ul>${cs.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>
      </div>
    `).join("")
    : "";

  const summaryText = user.profile?.bio || "";

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @page { size: 8.5in 11in; margin: 0; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        ${getFontFamilyCss(config.styling.fontFamily)}
        font-size: ${config.styling.fontSize};
        color: #1e293b;
      }
      table.layout { width: 100%; border-collapse: collapse; min-height: 11in; }
      td.sidebar {
        width: 260px;
        min-width: 260px;
        max-width: 260px;
        background-color: #0f172a;
        color: #e2e8f0;
        vertical-align: top;
        padding: 40px 22px;
      }
      td.main {
        background-color: #ffffff;
        vertical-align: top;
        padding: 45px 48px;
      }
      /* ---- Sidebar ---- */
      .s-name {
        font-size: 18pt;
        font-weight: 900;
        line-height: 1.1;
        color: #ffffff;
        margin-bottom: 6px;
        letter-spacing: -0.5px;
      }
      .s-headline {
        font-size: 8.5pt;
        color: #38bdf8;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 28px;
        padding-bottom: 16px;
        border-bottom: 1px solid #1e3a5f;
      }
      .s-section {
        font-size: 8pt;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #64748b;
        margin: 22px 0 10px 0;
      }
      .s-label { font-size: 8pt; color: #94a3b8; font-weight: 600; margin-bottom: 2px; }
      .s-value { font-size: 8.5pt; color: #e2e8f0; margin-bottom: 10px; }
      .s-link { font-size: 8.5pt; color: #38bdf8; text-decoration: none; word-break: break-all; display: block; margin-bottom: 10px; }
      .s-date { font-size: 7.5pt; color: #475569; font-style: italic; margin-top: 1px; }
      /* ---- Main ---- */
      .m-name {
        font-size: 24pt;
        font-weight: 900;
        color: #0f172a;
        line-height: 1.05;
        letter-spacing: -0.03em;
        margin-bottom: 5px;
      }
      .m-headline {
        font-size: 10pt;
        color: ${primaryColor};
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin-bottom: 14px;
      }
      .m-bio {
        font-size: 9pt;
        color: #475569;
        line-height: 1.5;
        margin-bottom: 14px;
        padding-bottom: 8px;
        border-bottom: 2px solid #f1f5f9;
      }
      .m-section {
        font-size: 10.5pt;
        font-weight: 900;
        color: #0f172a;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        margin: 12px 0 10px 0;
        padding-bottom: 5px;
        border-bottom: 2px solid ${primaryColor};
      }
      .m-item { margin-bottom: 14px; }
      .m-row { display: table; width: 100%; }
      .m-left { display: table-cell; }
      .m-right { display: table-cell; text-align: right; white-space: nowrap; font-size: 8.5pt; color: #64748b; vertical-align: top; }
      .m-title { font-size: 10.5pt; font-weight: 700; color: #0f172a; }
      .m-subtitle { font-size: 9pt; color: ${primaryColor}; font-weight: 600; margin-top: 1px; }
      .m-desc { font-size: 8.5pt; color: #475569; margin-top: 4px; line-height: 1.4; }
      ul { margin: 5px 0 0 0; padding-left: 16px; }
      li { font-size: 8.5pt; color: #475569; margin-bottom: 2px; line-height: 1.4; }
    </style>
  </head>
  <body>
    <table class="layout" cellspacing="0" cellpadding="0">
      <tr>
        <td class="sidebar">
          <div class="s-name">${escapeHtml(user.profile?.displayName || user.fullName)}</div>
          <div class="s-headline">${escapeHtml(user.profile?.headline || "Software Engineer")}</div>

          <div class="s-section">Contact</div>
          <div class="s-label">Email</div>
          <a href="mailto:${user.email}" class="s-link">${escapeHtml(user.email)}</a>
          ${user.profile?.phoneNumber ? `<div class="s-label" style="margin-top: 10px;">Phone</div><div class="s-value" style="margin-bottom: 10px;">${escapeHtml(user.profile.phoneNumber)}</div>` : ""}
          ${socialHtml}

          ${config.sections.education && eduHtml ? `<div class="s-section">Education</div>${eduHtml}` : ""}
          ${config.sections.skills && skillsHtml ? `<div class="s-section">Skills</div>${skillsHtml}` : ""}
        </td>
        <td class="main">
          ${config.sections.summary && summaryText ? `<div class="m-bio">${escapeHtml(summaryText)}</div>` : ""}
          ${config.sections.experience && experiencesToShow.length ? `<div class="m-section">Experience</div>${expHtml}` : ""}
          ${config.sections.projects && projectsToShow.length ? `<div class="m-section">Projects</div>${projHtml}` : ""}
          ${config.sections.achievements && achievementsToShow.length ? `<div class="m-section">Achievements</div>${achHtml}` : ""}
          ${config.sections.customSections && customSecsHtml ? customSecsHtml : ""}
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildResumeHtml(data: Awaited<ReturnType<typeof getResumeData>>) {
  const { user, socialLinks, experiences, projects, educations, achievements, profileSkills, customSections } = data;
  const config = parseResumeConfig(user.profile);

  const formattedSocials = socialLinks
    .map((s) => {
      const platform = s.platform.replace(/_/g, " ");
      const label = platform.charAt(0) + platform.slice(1).toLowerCase();
      return `<span style="white-space: nowrap;"><strong>${escapeHtml(platform === "OTHER" ? label : platform)}:</strong> <a href="${s.url}" style="color: #3b82f6; text-decoration: none;">${escapeHtml(cleanUrl(s.url))}</a></span>`;
    });

  const headerLinks = [
    `<span style="white-space: nowrap;"><a href="mailto:${user.email}" style="color: #3b82f6; text-decoration: none;">${escapeHtml(user.email)}</a></span>`,
    user.profile?.phoneNumber ? `<span style="white-space: nowrap;">${escapeHtml(user.profile.phoneNumber)}</span>` : "",
    ...formattedSocials
  ]
    .filter(Boolean)
    .join(" | ");

  // Custom skills or fallback
  let skillsHtml = "";
  if (profileSkills && profileSkills.length > 0) {
    skillsHtml = profileSkills
      .map((ps) => `
        <div class="skill-row">
          <strong>${escapeHtml(ps.category)}:</strong> ${escapeHtml(ps.skills.join(", "))}
        </div>
      `)
      .join("");
  } else {
    const categoryLabels: Record<string, string> = {
      LANGUAGE: "Programming Languages",
      FRONTEND: "Frontend",
      BACKEND: "Backend",
      DATABASE: "Database",
      DEVOPS: "Tools & Technologies",
      TOOL: "Tools & Technologies",
      CLOUD: "Tools & Technologies",
      CS_CORE: "CS Core",
      OTHER: "Other"
    };
    const groupedSkills: Record<string, string[]> = {};
    (user.profile?.techStacks || []).forEach((ps) => {
      const cat = ps.tech.category;
      const label = categoryLabels[cat] || categoryLabels.OTHER;
      if (!groupedSkills[label]) groupedSkills[label] = [];
      groupedSkills[label].push(ps.tech.name);
    });
    skillsHtml = Object.entries(groupedSkills)
      .map(([label, names]) => `
        <div class="skill-row">
          <strong>${escapeHtml(label)}:</strong> ${escapeHtml(names.join(", "))}
        </div>
      `)
      .join("");
  }

  const section = (title: string, body: string) => `
    <div class="section">
      <div class="section-title">${escapeHtml(title)}</div>
      <div class="section-body">${body}</div>
    </div>
  `;

  // Apply limits from config
  const experiencesToShow = experiences.slice(0, config.limits.experiences);
  const projectsToShow = projects.slice(0, config.limits.projects);
  const educationsToShow = educations.slice(0, config.limits.educations);
  const achievementsToShow = achievements.slice(0, config.limits.achievements);

  const expHtml = experiencesToShow
    .map((exp) => {
      const bullets = Array.isArray(exp.bullets) ? (exp.bullets as string[]) : [];
      return `
        <div class="item">
          <div class="row">
            <div class="left">
              <div class="item-title">${escapeHtml(exp.role)}</div>
              <div class="item-subtitle">${escapeHtml(exp.company)}${exp.location ? ` • ${escapeHtml(exp.location)}` : ""}</div>
            </div>
            <div class="right">${escapeHtml(range(exp.startDate, exp.endDate, exp.isCurrent))}</div>
          </div>
          ${bullets.length ? `<ul>${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
        </div>
      `;
    })
    .join("");

  const eduHtml = educationsToShow
    .map((edu) => {
      const subtitleParts = [[edu.degree, edu.fieldOfStudy].filter(Boolean).join(", ")];
      if (edu.score) {
        subtitleParts.push(`${edu.scoreType || "CGPA"}: ${edu.score}`);
      }
      const subtitle = subtitleParts.filter(Boolean).join(" | ");
      return `
        <div class="item">
          <div class="row">
            <div class="left">
              <div class="item-title">${escapeHtml(edu.school)}</div>
              ${subtitle ? `<div class="item-subtitle">${escapeHtml(subtitle)}</div>` : ""}
            </div>
            <div class="right">${escapeHtml(range(edu.startDate, edu.endDate, edu.isCurrent))}</div>
          </div>
        </div>
      `;
    })
    .join("");

  const projHtml = projectsToShow
    .map((p) => {
      const bullets = Array.isArray(p.bullets) ? (p.bullets as string[]) : [];
      const links = [];
      if (p.liveUrl) links.push(`<strong>Live Demo:</strong> <a href="${p.liveUrl}" style="color: #3b82f6; text-decoration: none;">${escapeHtml(cleanUrl(p.liveUrl))}</a>`);
      if (p.repoUrl) links.push(`<strong>GitHub:</strong> <a href="${p.repoUrl}" style="color: #3b82f6; text-decoration: none;">${escapeHtml(cleanUrl(p.repoUrl))}</a>`);
      return `
        <div class="item">
          <div class="row">
            <div class="left">
              <div class="item-title">${escapeHtml(p.title)}</div>
              ${links.length ? `<div class="item-subtitle">${links.join(" | ")}</div>` : ""}
            </div>
          </div>
          ${bullets.length ? `<ul>${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
        </div>
      `;
    })
    .join("");

  const achHtml = achievementsToShow.length ? `<ul>${achievementsToShow.map((a) => {
    const parts = [a.title, a.provider].filter(Boolean);
    const dateHtml = a.date ? `<span style="float: right;">${escapeHtml(monthYear(a.date.toISOString()))}</span>` : "";
    return `<li style="margin-bottom: 4px;">${dateHtml}${escapeHtml(parts.join(" | "))}</li>`;
  }).join("")}</ul>` : "";

  const customSecsHtml = customSections && customSections.length > 0
    ? customSections.map(cs => section(cs.title, `<ul>${cs.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`)).join("")
    : "";

  const summaryText = user.profile?.bio || "";

  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <style>
        @page { size: Letter; margin: 0.4in 0.5in; }
        * { box-sizing: border-box; }
        body {
          ${getFontFamilyCss(config.styling.fontFamily)}
          font-size: ${config.styling.fontSize};
          line-height: 1.25;
          color: #111;
          margin: 0;
        }
        .name {
          font-size: 19.5pt;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin: 0;
          text-align: center;
        }
        .contact { 
          margin-top: 4px; 
          color: #333; 
          font-size: 9.5pt; 
          text-align: center;
        }
        .divider { height: 1.5px; background: #222; margin: 6px 0 8px; }
        .section { margin-bottom: 6.5pt; }
        .section-title {
          font-size: 10.5pt;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          border-bottom: 1px solid #888;
          padding-bottom: 2px;
          margin-bottom: 5px;
        }
        .item { margin-bottom: 4pt; }
        .row { display: flex; justify-content: space-between; gap: 10px; }
        .left { flex: 1; min-width: 0; }
        .right { white-space: nowrap; color: #444; font-size: 9.5pt; }
        .item-title { font-weight: 700; font-size: 10.2pt; }
        .item-subtitle { color: #222; margin-top: 1px; font-size: 9.5pt; font-weight: 500; }
        .skill-row { margin-bottom: 2px; }
        .muted { color: #444; margin-top: 1px; font-size: 9.5pt; }
        ul { margin: 6px 0 0 0; padding-left: 15px; }
        li { margin: 1px 0; }
      </style>
    </head>
    <body>
      <h1 class="name">${escapeHtml(user.profile?.displayName || user.fullName)}</h1>
      <div class="contact">${headerLinks}</div>
      <div class="divider"></div>
      
      ${config.sections.summary && summaryText ? section("Professional Summary", `<div class="muted">${escapeHtml(summaryText)}</div>`) : ""}
      ${config.sections.experience && experiencesToShow.length ? section("Experience", expHtml) : ""}
      ${config.sections.education && educationsToShow.length ? section("Education", eduHtml) : ""}
      ${config.sections.projects && projectsToShow.length ? section("Projects", projHtml) : ""}
      ${config.sections.skills && skillsHtml ? section("Technical Skills", skillsHtml) : ""}
      ${config.sections.achievements && achievementsToShow.length ? section("Achievements", achHtml) : ""}
      ${config.sections.customSections && customSecsHtml ? customSecsHtml : ""}
    </body>
  </html>
  `;
}

function buildModernResumeHtml(data: Awaited<ReturnType<typeof getResumeData>>) {
  const { user, socialLinks, experiences, projects, educations, achievements, profileSkills, customSections } = data;
  const config = parseResumeConfig(user.profile);

  // Grouped Skills
  let skillsHtml = "";
  if (profileSkills && profileSkills.length > 0) {
    skillsHtml = profileSkills
      .map((ps) => `<div class="skill-row"><span class="skill-label">${escapeHtml(ps.category)}:</span> ${escapeHtml(ps.skills.join(", "))}</div>`)
      .join("");
  } else {
    const categoryLabels: Record<string, string> = {
      LANGUAGE: "Programming Languages",
      FRONTEND: "Frontend",
      BACKEND: "Backend",
      DATABASE: "Databases",
      DEVOPS: "Cloud & DevOps",
      TOOL: "Developer Tools",
      CLOUD: "Cloud & DevOps",
      CS_CORE: "Computer Science Fundamentals",
      OTHER: "Other",
    };
    const groupedSkills: Record<string, string[]> = {};
    (user.profile?.techStacks || []).forEach((ps) => {
      const label = categoryLabels[ps.tech.category] || "Other";
      if (!groupedSkills[label]) groupedSkills[label] = [];
      if (!groupedSkills[label].includes(ps.tech.name)) groupedSkills[label].push(ps.tech.name);
    });
    skillsHtml = Object.entries(groupedSkills)
      .map(([label, names]) => `<div class="skill-row"><span class="skill-label">${escapeHtml(label)}:</span> ${escapeHtml(names.join(", "))}</div>`)
      .join("");
  }

  const socialParts = socialLinks.map((s) => {
    const platform = s.platform.replace(/_/g, " ");
    const label = platform.charAt(0) + platform.slice(1).toLowerCase();
    return `<a href="${s.url}" class="hlink">${escapeHtml(label)}: ${escapeHtml(cleanUrl(s.url))}</a>`;
  });
  const headerLinks = [
    `<a href="mailto:${user.email}" class="hlink">${escapeHtml(user.email)}</a>`,
    user.profile?.phoneNumber ? `<span class="hlink">${escapeHtml(user.profile.phoneNumber)}</span>` : "",
    ...socialParts,
  ].filter(Boolean).join(" &nbsp;|&nbsp; ");

  const sec = (title: string, body: string) =>
    `<div class="sec"><div class="sec-title">${escapeHtml(title)}</div><div class="sec-body">${body}</div></div>`;

  // Apply limits from config
  const experiencesToShow = experiences.slice(0, config.limits.experiences);
  const projectsToShow = projects.slice(0, config.limits.projects);
  const educationsToShow = educations.slice(0, config.limits.educations);
  const achievementsToShow = achievements.slice(0, config.limits.achievements);

  const expHtml = experiencesToShow.map((exp) => {
    const bullets = Array.isArray(exp.bullets) ? (exp.bullets as string[]) : [];
    return `
      <div class="item">
        <div class="item-header">
          <span class="item-company">${escapeHtml(exp.company)}</span>
          <span class="item-date">${escapeHtml(range(exp.startDate, exp.endDate, exp.isCurrent))}</span>
        </div>
        <div class="item-role">${escapeHtml(exp.role)}${exp.location ? ` &middot; <span class="item-loc">${escapeHtml(exp.location)}</span>` : ""}</div>
        ${bullets.length ? `<ul>${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
      </div>`;
  }).join("");

  const eduHtml = educationsToShow.map((edu) => {
    const subtitleParts = [[edu.degree, edu.fieldOfStudy].filter(Boolean).join(", ")];
    if (edu.score) {
      subtitleParts.push(`${edu.scoreType || "CGPA"}: ${edu.score}`);
    }
    const subtitle = subtitleParts.filter(Boolean).join(" | ");
    return `
      <div class="item">
        <div class="item-header">
          <span class="item-company">${escapeHtml(edu.school)}</span>
          <span class="item-date">${escapeHtml(range(edu.startDate, edu.endDate, edu.isCurrent))}</span>
        </div>
        ${subtitle ? `<div class="item-role">${escapeHtml(subtitle)}</div>` : ""}
      </div>`;
  }).join("");

  const projHtml = projectsToShow.map((p) => {
    const bullets = Array.isArray(p.bullets) ? (p.bullets as string[]) : [];
    const linkParts: string[] = [];
    if (p.liveUrl) linkParts.push(`Live: <a href="${p.liveUrl}" class="inline-link">${escapeHtml(cleanUrl(p.liveUrl))}</a>`);
    if (p.repoUrl) linkParts.push(`GitHub: <a href="${p.repoUrl}" class="inline-link">${escapeHtml(cleanUrl(p.repoUrl))}</a>`);
    return `
      <div class="item">
        <div class="item-header">
          <span class="item-company">${escapeHtml(p.title)}</span>
        </div>
        ${linkParts.length ? `<div class="item-links">${linkParts.join(" &nbsp;|&nbsp; ")}</div>` : ""}
        ${bullets.length ? `<ul>${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
      </div>`;
  }).join("");

  const achHtml = achievementsToShow.length
    ? `<ul>${achievementsToShow.map((a) => {
        const parts = [a.title, a.provider].filter(Boolean);
        const dateStr = a.date ? monthYear(a.date.toISOString()) : "";
        return `<li><span class="ach-title">${escapeHtml(parts.join(" — "))}</span>${dateStr ? ` <span class="ach-date">(${escapeHtml(dateStr)})</span>` : ""}</li>`;
      }).join("")}</ul>`
    : "";

  const customSecsHtml = customSections && customSections.length > 0
    ? customSections.map(cs => sec(cs.title, `<ul>${cs.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`)).join("")
    : "";

  const summaryText = user.profile?.bio || "";

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    @page { size: Letter; margin: 0.3in 0.45in; }
    * { box-sizing: border-box; }
    body {
      ${getFontFamilyCss(config.styling.fontFamily)}
      font-size: ${config.styling.fontSize};
      color: #1a1a1a;
      margin: 0;
      line-height: 1.3;
    }
    .name { font-size: 22.5pt; font-weight: 700; letter-spacing: -0.5px; margin: 0 0 2px 0; text-align: center; font-family: Arial, Helvetica, sans-serif; }
    .contact-bar { text-align: center; font-size: 8.7pt; color: #444; margin-bottom: 12px; font-family: Arial, sans-serif; }
    .hlink { color: #3b82f6; text-decoration: none; }
    .top-rule { border: none; border-top: 2px solid #1a1a1a; margin: 0 0 9pt 0; }
    .sec { margin-bottom: 8.5pt; }
    .sec-title { font-family: Arial, sans-serif; font-size: 10.2pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; border-bottom: 1px solid #aaa; padding-bottom: 1px; margin-bottom: 6px; }
    .item { margin-bottom: 6px; }
    .item-header { display: flex; justify-content: space-between; align-items: baseline; }
    .item-company { font-family: Arial, sans-serif; font-size: 10.2pt; font-weight: 700; }
    .item-date { font-family: Arial, sans-serif; font-size: 8.7pt; color: #555; white-space: nowrap; margin-left: 8px; }
    .item-role { font-style: italic; font-size: 9.2pt; color: #333; margin-top: 0px; }
    .item-loc { font-style: normal; color: #666; }
    .item-links { font-family: Arial, sans-serif; font-size: 8.2pt; color: #444; margin-top: 1px; }
    ul { margin: 3px 0 0 0; padding-left: 15px; }
    li { margin-bottom: 1px; font-size: 9.2pt; line-height: 1.3; }
    .skill-row { margin-bottom: 2px; font-size: 9.2pt; font-family: Arial, sans-serif; line-height: 1.3; }
    .skill-label { font-weight: 700; }
    .inline-link { color: #3b82f6; text-decoration: none; }
    .ach-title { font-weight: 600; font-size: 8.5pt; font-family: Arial, sans-serif; }
    .ach-date { color: #666; font-size: 8pt; }
    .summary-text { font-size: 8.5pt; color: #333; line-height: 1.4; }
  </style>
</head>
<body>
  <div class="name">${escapeHtml(user.profile?.displayName || user.fullName)}</div>
  <div class="contact-bar">${headerLinks}</div>
  <hr class="top-rule"/>
  ${config.sections.summary && summaryText ? sec("Professional Summary", `<div class="summary-text">${escapeHtml(summaryText)}</div>`) : ""}
  ${config.sections.experience && experiencesToShow.length ? sec("Experience", expHtml) : ""}
  ${config.sections.education && educationsToShow.length ? sec("Education", eduHtml) : ""}
  ${config.sections.projects && projectsToShow.length ? sec("Projects", projHtml) : ""}
  ${config.sections.skills && skillsHtml ? sec("Technical Skills", skillsHtml) : ""}
  ${config.sections.achievements && achievementsToShow.length ? sec("Achievements", achHtml) : ""}
  ${config.sections.customSections && customSecsHtml ? customSecsHtml : ""}
</body>
</html>`;
}

function buildEnhancvResumeHtml(data: Awaited<ReturnType<typeof getResumeData>>, themeName: string) {
  const { user, socialLinks, experiences, projects, educations, achievements, profileSkills, customSections } = data;
  const config = parseResumeConfig(user.profile);
  const accentColor = THEME_COLOR_MAP[themeName] || "#2563EB";

  // Grouped Skills
  let skillsHtml = "";
  if (profileSkills && profileSkills.length > 0) {
    skillsHtml = profileSkills.map(ps => `
      <div class="r-skill-group">
        <div class="r-skill-cat">${escapeHtml(ps.category)}</div>
        <div class="r-chips">${ps.skills.map(n => `<span class="r-chip">${escapeHtml(n)}</span>`).join("")}</div>
      </div>`).join("");
  } else {
    const categoryLabels: Record<string, string> = {
      LANGUAGE: "Languages",
      FRONTEND: "Frontend",
      BACKEND: "Backend",
      DATABASE: "Database",
      DEVOPS: "DevOps & Tools",
      TOOL: "Tools",
      CLOUD: "Cloud",
      CS_CORE: "CS Core",
      OTHER: "Other",
    };
    const groupedSkills: Record<string, string[]> = {};
    (user.profile?.techStacks || []).forEach((ps) => {
      const label = categoryLabels[ps.tech.category] || "Other";
      if (!groupedSkills[label]) groupedSkills[label] = [];
      groupedSkills[label].push(ps.tech.name);
    });
    skillsHtml = Object.entries(groupedSkills).map(([label, names]) => `
      <div class="r-skill-group">
        <div class="r-skill-cat">${escapeHtml(label)}</div>
        <div class="r-chips">${names.map(n => `<span class="r-chip">${escapeHtml(n)}</span>`).join("")}</div>
      </div>`).join("");
  }

  const contactHtml = [
    `<div class="r-contact-item"><span class="r-contact-icon">✉</span><span>${escapeHtml(user.email)}</span></div>`,
    user.profile?.phoneNumber ? `<div class="r-contact-item"><span class="r-contact-icon">📞</span><span>${escapeHtml(user.profile.phoneNumber)}</span></div>` : "",
    ...socialLinks.map(s => {
      const platform = s.platform.replace(/_/g, " ");
      const label = platform.charAt(0) + platform.slice(1).toLowerCase();
      return `<div class="r-contact-item"><span class="r-contact-icon">↗</span><span>${escapeHtml(label)}: ${escapeHtml(cleanUrl(s.url))}</span></div>`;
    })
  ].filter(Boolean).join("");

  // Apply limits from config
  const experiencesToShow = experiences.slice(0, config.limits.experiences);
  const projectsToShow = projects.slice(0, config.limits.projects);
  const educationsToShow = educations.slice(0, config.limits.educations);
  const achievementsToShow = achievements.slice(0, config.limits.achievements);

  const eduRightHtml = educationsToShow.map(edu => {
    const degreeParts = [[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")];
    if (edu.score) {
      degreeParts.push(`${edu.scoreType || "CGPA"}: ${edu.score}`);
    }
    const degree = degreeParts.filter(Boolean).join(" | ");
    return `<div class="r-edu-item">
      <div class="r-edu-school">${escapeHtml(edu.school)}</div>
      ${degree ? `<div class="r-edu-degree">${escapeHtml(degree)}</div>` : ""}
      <div class="r-edu-date">${escapeHtml(range(edu.startDate, edu.endDate, edu.isCurrent))}</div>
    </div>`;
  }).join("");

  const achRightHtml = achievementsToShow.length ? achievementsToShow.map(a => {
    const parts = [a.title, a.provider].filter(Boolean);
    const dateStr = a.date ? monthYear(a.date.toISOString()) : "";
    return `<div class="r-ach-item">
      <div class="r-ach-icon" style="color:${accentColor}">★</div>
      <div>
        <div class="r-ach-title">${escapeHtml(parts.join(" — "))}</div>
        ${dateStr ? `<div class="r-ach-date">${escapeHtml(dateStr)}</div>` : ""}
      </div>
    </div>`;
  }).join("") : "";

  const expHtml = experiencesToShow.map(exp => {
    const bullets = Array.isArray(exp.bullets) ? (exp.bullets as string[]) : [];
    return `<div class="l-item">
      <div class="l-item-header">
        <div>
          <div class="l-item-role">${escapeHtml(exp.role)}</div>
          <div class="l-item-company" style="color:${accentColor}">${escapeHtml(exp.company)}${exp.location ? ` &middot; ${escapeHtml(exp.location)}` : ""}</div>
        </div>
        <div class="l-item-date">${escapeHtml(range(exp.startDate, exp.endDate, exp.isCurrent))}</div>
      </div>
      ${bullets.length ? `<ul class="l-bullets">${bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
    </div>`;
  }).join("");

  const projHtml = projectsToShow.map(p => {
    const bullets = Array.isArray(p.bullets) ? (p.bullets as string[]) : [];
    const linkParts: string[] = [];
    if (p.liveUrl) linkParts.push(`<a href="${p.liveUrl}" style="color:${accentColor};text-decoration:none;">Live: ${escapeHtml(cleanUrl(p.liveUrl))}</a>`);
    if (p.repoUrl) linkParts.push(`<a href="${p.repoUrl}" style="color:${accentColor};text-decoration:none;">GitHub: ${escapeHtml(cleanUrl(p.repoUrl))}</a>`);
    return `<div class="l-item">
      <div class="l-item-role">${escapeHtml(p.title)}</div>
      ${linkParts.length ? `<div style="font-size:7.5pt;color:#64748b;margin-top:1px;">${linkParts.join(" &nbsp;·&nbsp; ")}</div>` : ""}
      ${bullets.length ? `<ul class="l-bullets">${bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
    </div>`;
  }).join("");

  const customSecsHtml = customSections && customSections.length > 0
    ? customSections.map(cs => `
      <div class="l-section">
        <div class="l-section-title">${escapeHtml(cs.title)}</div>
        <div class="l-item">
          <ul class="l-bullets">
            ${cs.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
          </ul>
        </div>
      </div>
    `).join("")
    : "";

  const summaryText = user.profile?.bio || "";

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    @page { size: Letter; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      ${getFontFamilyCss(config.styling.fontFamily)}
      font-size: ${config.styling.fontSize};
      color: #1a1a1a;
    }

    /* ── Layout ── */
    .wrapper { display: table; width: 100%; min-height: 11in; border-collapse: collapse; }
    .left-col { display: table-cell; width: 62%; vertical-align: top; padding: 40px 36px 40px 44px; background: #fff; border-right: 1px solid #e5e7eb; }
    .right-col { display: table-cell; width: 38%; vertical-align: top; padding: 40px 28px 40px 28px; background: #f9fafb; }

    /* ── Name / Header ── */
    .l-name { font-size: 22pt; font-weight: 900; letter-spacing: -0.5px; line-height: 1.05; color: #0f172a; }
    .l-headline { font-size: 9.5pt; color: ${accentColor}; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 3px; margin-bottom: 4px; }
    .l-name-underline { height: 3px; width: 100%; background: linear-gradient(to right, ${accentColor}, transparent); border: none; margin-bottom: 14px; }

    /* ── Left sections ── */
    .l-section { margin-bottom: 16px; }
    .l-section-title { font-size: 9pt; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; border-bottom: 2px solid ${accentColor}; padding-bottom: 3px; margin-bottom: 10px; }
    .l-summary { font-size: 8.5pt; color: #475569; line-height: 1.5; }
    .l-item { margin-bottom: 12px; }
    .l-item-header { display: table; width: 100%; }
    .l-item-role { font-size: 10pt; font-weight: 700; color: #0f172a; }
    .l-item-company { font-size: 8.5pt; font-weight: 600; margin-top: 1px; }
    .l-item-date { display: table-cell; text-align: right; font-size: 8pt; color: #64748b; white-space: nowrap; vertical-align: top; padding-left: 8px; }
    .l-bullets { margin: 5px 0 0 0; padding-left: 15px; }
    .l-bullets li { font-size: 8.5pt; color: #374151; margin-bottom: 2px; line-height: 1.4; }

    /* ── Right sections ── */
    .r-section { margin-bottom: 18px; }
    .r-section-title { font-size: 9pt; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; border-bottom: 2px solid ${accentColor}; padding-bottom: 3px; margin-bottom: 10px; }

    /* Contact */
    .r-contact-item { display: flex; align-items: flex-start; gap: 6px; margin-bottom: 5px; font-size: 8pt; color: #374151; word-break: break-all; }
    .r-contact-icon { color: ${accentColor}; font-size: 9pt; flex-shrink: 0; margin-top: 1px; }

    /* Skills */
    .r-skill-group { margin-bottom: 8px; }
    .r-skill-cat { font-size: 7.5pt; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
    .r-chips { display: flex; flex-wrap: wrap; gap: 3px; }
    .r-chip { background: #e0e7ff; color: #1e3a8a; font-size: 7.5pt; font-weight: 600; padding: 1px 6px; border-radius: 3px; }

    /* Education */
    .r-edu-item { margin-bottom: 10px; }
    .r-edu-school { font-size: 9pt; font-weight: 700; color: #0f172a; }
    .r-edu-degree { font-size: 8pt; color: #374151; margin-top: 1px; }
    .r-edu-date { font-size: 7.5pt; color: #64748b; margin-top: 1px; font-style: italic; }

    /* Achievements */
    .r-ach-item { display: flex; gap: 6px; align-items: flex-start; margin-bottom: 8px; }
    .r-ach-icon { font-size: 11pt; flex-shrink: 0; line-height: 1; }
    .r-ach-title { font-size: 8.5pt; font-weight: 600; color: #0f172a; line-height: 1.3; }
    .r-ach-date { font-size: 7.5pt; color: #64748b; margin-top: 1px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <!-- LEFT COLUMN -->
    <div class="left-col">
      <div class="l-name">${escapeHtml(user.profile?.displayName || user.fullName)}</div>
      ${user.profile?.headline ? `<div class="l-headline">${escapeHtml(user.profile.headline)}</div>` : ""}
      <hr class="l-name-underline"/>

      ${config.sections.summary && summaryText ? `<div class="l-section"><div class="l-section-title">Summary</div><div class="l-summary">${escapeHtml(summaryText)}</div></div>` : ""}
      ${config.sections.experience && experiencesToShow.length ? `<div class="l-section"><div class="l-section-title">Experience</div>${expHtml}</div>` : ""}
      ${config.sections.projects && projectsToShow.length ? `<div class="l-section"><div class="l-section-title">Projects</div>${projHtml}</div>` : ""}
      ${config.sections.customSections && customSecsHtml ? customSecsHtml : ""}
    </div>

    <!-- RIGHT COLUMN -->
    <div class="right-col">
      ${contactHtml ? `<div class="r-section"><div class="r-section-title">Contact</div>${contactHtml}</div>` : ""}
      ${config.sections.skills && skillsHtml ? `<div class="r-section"><div class="r-section-title">Skills</div>${skillsHtml}</div>` : ""}
      ${config.sections.education && educationsToShow.length ? `<div class="r-section"><div class="r-section-title">Education</div>${eduRightHtml}</div>` : ""}
      ${config.sections.achievements && achievementsToShow.length ? `<div class="r-section"><div class="r-section-title">Achievements</div>${achRightHtml}</div>` : ""}
    </div>
  </div>
</body>
</html>`;
}

async function renderPdfFromHtml(html: string) {
  const isLocal = process.env.NODE_ENV !== "production";
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: null,
    executablePath: isLocal
      ? (process.env.CHROME_EXECUTABLE_PATH ?? await chromium.executablePath())
      : await chromium.executablePath(),
    headless: true,
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 816, height: 1056 });
    await page.setContent(html, { waitUntil: "networkidle2" });
    const pdf = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
    });
    return pdf;
  } finally {
    await browser.close();
  }
}

async function renderDocx(data: Awaited<ReturnType<typeof getResumeData>>) {
  const { user, socialLinks, experiences, projects, educations, achievements, profileSkills, customSections } = data;
  const config = parseResumeConfig(user.profile);
  const fontFamily = config.styling.fontFamily;
  const fontSize = config.styling.fontSize;

  const sizePt = parseFloat(fontSize) || 9.5;
  const baseSize = Math.round(sizePt * 2);
  const nameSize = Math.round((sizePt + 8.5) * 2);
  const sectionHeadingSize = Math.round((sizePt + 1) * 2);
  const subTitleSize = Math.round((sizePt - 0.5) * 2);

  const children: Paragraph[] = [];

  // Name (centered)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: user.profile?.displayName || user.fullName, bold: true, size: nameSize, font: fontFamily })],
    })
  );

  // Header Links
  const headerNodes: (TextRun | ExternalHyperlink)[] = [];
  
  // Email
  headerNodes.push(
    new ExternalHyperlink({
      children: [new TextRun({ text: user.email, size: baseSize, color: "3B82F6", font: fontFamily })],
      link: `mailto:${user.email}`,
    })
  );

  // Phone
  if (user.profile?.phoneNumber) {
    headerNodes.push(new TextRun({ text: " | ", size: baseSize, font: fontFamily }));
    headerNodes.push(new TextRun({ text: user.profile.phoneNumber, size: baseSize, font: fontFamily }));
  }

  socialLinks.forEach((s) => {
    headerNodes.push(new TextRun({ text: " | ", size: baseSize, font: fontFamily }));
    const platform = s.platform.replace(/_/g, " ");
    const label = platform.charAt(0) + platform.slice(1).toLowerCase();
    headerNodes.push(new TextRun({ text: `${platform === "OTHER" ? label : platform}: `, size: baseSize, font: fontFamily }));
    headerNodes.push(
      new ExternalHyperlink({
        children: [new TextRun({ text: cleanUrl(s.url), size: baseSize, color: "3B82F6", font: fontFamily })],
        link: s.url,
      })
    );
  });

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: headerNodes,
    })
  );

  const addHeading = (text: string) => {
    children.push(
      new Paragraph({
        spacing: { before: 120, after: 60 },
        border: { bottom: { color: "auto", space: 1, style: "single", size: 6 } },
        children: [new TextRun({ text, bold: true, size: sectionHeadingSize, font: fontFamily })],
      })
    );
  };

  // Slice list based on limits config
  const experiencesToShow = experiences.slice(0, config.limits.experiences);
  const projectsToShow = projects.slice(0, config.limits.projects);
  const educationsToShow = educations.slice(0, config.limits.educations);
  const achievementsToShow = achievements.slice(0, config.limits.achievements);

  // 0. Professional Summary
  const docRawBio = user.profile?.bio || "";
  if (config.sections.summary && docRawBio) {
    addHeading("PROFESSIONAL SUMMARY");
    children.push(new Paragraph({ children: [new TextRun({ text: docRawBio, size: baseSize, font: fontFamily })], spacing: { after: 60 } }));
  }

  // 1. Experience
  if (config.sections.experience && experiencesToShow.length) {
    addHeading("EXPERIENCE");
    experiencesToShow.forEach((exp) => {
      const subtitle = `${exp.company}${exp.location ? ` • ${exp.location}` : ""}`;
      const bullets = Array.isArray(exp.bullets) ? (exp.bullets as string[]) : [];
      
      children.push(
        new Paragraph({
          spacing: { before: 80 },
          children: [
            new TextRun({ text: exp.role, bold: true, size: sectionHeadingSize, font: fontFamily }),
            new TextRun({ text: `\t${range(exp.startDate, exp.endDate, exp.isCurrent)}`, font: fontFamily, size: baseSize }),
          ],
          tabStops: [{ type: "right", position: 9000 }],
        })
      );
      children.push(
        new Paragraph({
          children: [new TextRun({ text: subtitle, size: subTitleSize, bold: true, font: fontFamily })],
        })
      );
      bullets.forEach((b) => {
        children.push(new Paragraph({ text: b, bullet: { level: 0 }, spacing: { before: 20 }, children: [new TextRun({ text: b, size: baseSize, font: fontFamily })] }));
      });
    });
  }

  // 2. Education
  if (config.sections.education && educationsToShow.length) {
    addHeading("EDUCATION");
    educationsToShow.forEach((edu) => {
      const subtitleParts = [[edu.degree, edu.fieldOfStudy].filter(Boolean).join(", ")];
      if (edu.score) {
        subtitleParts.push(`${edu.scoreType || "CGPA"}: ${edu.score}`);
      }
      const subtitle = subtitleParts.filter(Boolean).join(" | ");
      
      children.push(
        new Paragraph({
          spacing: { before: 80 },
          children: [
            new TextRun({ text: edu.school, bold: true, size: sectionHeadingSize, font: fontFamily }),
            new TextRun({ text: `\t${range(edu.startDate, edu.endDate, edu.isCurrent)}`, font: fontFamily, size: baseSize }),
          ],
          tabStops: [{ type: "right", position: 9000 }],
        })
      );
      if (subtitle) {
        children.push(new Paragraph({ children: [new TextRun({ text: subtitle, size: subTitleSize, bold: true, font: fontFamily })] }));
      }
    });
  }

  // 3. Projects
  if (config.sections.projects && projectsToShow.length) {
    addHeading("PROJECTS");
    projectsToShow.forEach((p) => {
      const bullets = Array.isArray(p.bullets) ? (p.bullets as string[]) : [];
      
      children.push(
        new Paragraph({
          spacing: { before: 80 },
          children: [new TextRun({ text: p.title, bold: true, size: sectionHeadingSize, font: fontFamily })],
        })
      );

      const linkNodes: (TextRun | ExternalHyperlink)[] = [];
      if (p.liveUrl) {
        linkNodes.push(new TextRun({ text: "Live Demo: ", size: subTitleSize, bold: true, font: fontFamily }));
        linkNodes.push(new ExternalHyperlink({
          children: [new TextRun({ text: cleanUrl(p.liveUrl), size: subTitleSize, color: "3B82F6", font: fontFamily })],
          link: p.liveUrl,
        }));
      }
      if (p.liveUrl && p.repoUrl) linkNodes.push(new TextRun({ text: " | ", size: subTitleSize, font: fontFamily }));
      if (p.repoUrl) {
        linkNodes.push(new TextRun({ text: "GitHub: ", size: subTitleSize, bold: true, font: fontFamily }));
        linkNodes.push(new ExternalHyperlink({
          children: [new TextRun({ text: cleanUrl(p.repoUrl), size: subTitleSize, color: "3B82F6", font: fontFamily })],
          link: p.repoUrl,
        }));
      }

      if (linkNodes.length) {
        children.push(new Paragraph({ children: linkNodes }));
      }
      bullets.forEach((b) => {
        children.push(new Paragraph({ text: b, bullet: { level: 0 }, spacing: { before: 20 }, children: [new TextRun({ text: b, size: baseSize, font: fontFamily })] }));
      });
    });
  }

  // 4. Skills
  if (config.sections.skills) {
    if (profileSkills && profileSkills.length > 0) {
      addHeading("TECHNICAL SKILLS");
      profileSkills.forEach((ps) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${ps.category}: `, bold: true, size: baseSize, font: fontFamily }),
              new TextRun({ text: ps.skills.join(", "), size: baseSize, font: fontFamily }),
            ],
          })
        );
      });
    } else {
      const categoryLabels: Record<string, string> = {
        LANGUAGE: "Programming Languages",
        FRONTEND: "Frontend",
        BACKEND: "Backend",
        DATABASE: "Database",
        DEVOPS: "Tools & Technologies",
        TOOL: "Tools & Technologies",
        CLOUD: "Tools & Technologies",
        CS_CORE: "CS Core",
        OTHER: "Other"
      };
      const groupedSkills: Record<string, string[]> = {};
      (user.profile?.techStacks || []).forEach((ps) => {
        const cat = ps.tech.category;
        const label = categoryLabels[cat] || categoryLabels.OTHER;
        if (!groupedSkills[label]) groupedSkills[label] = [];
        groupedSkills[label].push(ps.tech.name);
      });

      if (Object.keys(groupedSkills).length > 0) {
        addHeading("TECHNICAL SKILLS");
        Object.entries(groupedSkills).forEach(([label, names]) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${label}: `, bold: true, size: baseSize, font: fontFamily }),
                new TextRun({ text: names.join(", "), size: baseSize, font: fontFamily }),
              ],
            })
          );
        });
      }
    }
  }

  // 5. Achievements
  if (config.sections.achievements && achievementsToShow.length) {
    addHeading("ACHIEVEMENTS");
    achievementsToShow.forEach((a) => {
      const parts = [a.title, a.provider].filter(Boolean);
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: parts.join(" | "), font: fontFamily, size: baseSize }),
            new TextRun({ text: `\t${a.date ? monthYear(a.date.toISOString()) : ""}`, font: fontFamily, size: baseSize }),
          ],
          bullet: { level: 0 },
          spacing: { before: 20 },
          tabStops: [{ type: "right", position: 9000 }],
        })
      );
    });
  }

  // 6. Custom Sections
  if (config.sections.customSections && customSections && customSections.length > 0) {
    customSections.forEach((cs) => {
      addHeading(cs.title.toUpperCase());
      cs.bullets.forEach((b) => {
        children.push(new Paragraph({ text: b, bullet: { level: 0 }, spacing: { before: 20 }, children: [new TextRun({ text: b, size: baseSize, font: fontFamily })] }));
      });
    });
  }

  const doc = new Document({
    sections: [{ 
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
        }
      }, 
      children 
    }],
  });

  return await Packer.toBuffer(doc);
}

export async function generateResumeFile(args: {
  userId: string;
  format: ResumeFormat;
  templateType: ResumeTemplate;
  activeTheme?: string;
  jobDescription?: string;
  useAI?: boolean;
}) {
  console.log(`[ResumeGenerator] Generating ${args.format} with template: ${args.templateType}, theme: ${args.activeTheme}`);
  
  const baseData = await getResumeData(args.userId);
  const data = await maybeTailorWithAI({
    data: baseData,
    jobDescription: args.jobDescription,
    useAI: args.useAI,
  });

  if (args.format === "pdf") {
    const template = String(args.templateType).toUpperCase();
    let html: string;
    let filename: string;

    switch (template) {
      case "DESIGN":
        html = buildDesignResumeHtml(data, args.activeTheme || "SKEUOMORPHIC");
        filename = "design-resume.pdf";
        break;
      case "MODERN":
        html = buildModernResumeHtml(data);
        filename = "modern-resume.pdf";
        break;
      case "ENHANCV":
        html = buildEnhancvResumeHtml(data, args.activeTheme || "GLASS");
        filename = "premium-resume.pdf";
        break;
      case "ATS":
      default:
        html = buildResumeHtml(data);
        filename = "resume.pdf";
        break;
    }

    const buffer = await renderPdfFromHtml(html);
    return { buffer, filename, contentType: "application/pdf" };
  }

  const buffer = await renderDocx(data);
  return {
    buffer,
    filename: "resume.docx",
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
}
