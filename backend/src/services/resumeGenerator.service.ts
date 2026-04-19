import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { AlignmentType, Document, ExternalHyperlink, Packer, Paragraph, TextRun } from "docx";
import { prisma } from "../config/database";
import { tailorBulletsToJob, batchTailorBullets } from "./ai.service";
import { BadRequestError } from "../utils/errors";

type ResumeFormat = "pdf" | "docx";
type ResumeTemplate = "ATS" | "DESIGN";

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

  const [projects, experiences, achievements, educations, socialLinks] = await Promise.all([
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
  ]);

  return { user, projects, experiences, achievements, educations, socialLinks };
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

  // Call batch AI service
  const results = await batchTailorBullets({
    jobDescription: jobDescription.trim(),
    items,
  });

  // Map results back
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
  const { user, socialLinks, experiences, projects, educations, achievements } = data;
  const primaryColor = THEME_COLOR_MAP[themeName] || "#111111";

  // Category Labels
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

  // Grouped Skills
  const techStacks = user.profile?.techStacks || [];
  const groupedSkills: Record<string, string[]> = {};
  techStacks.forEach((ps) => {
    const label = categoryLabels[ps.tech.category] || categoryLabels.OTHER;
    if (!groupedSkills[label]) groupedSkills[label] = [];
    groupedSkills[label].push(ps.tech.name);
  });

  const skillsHtml = Object.entries(groupedSkills)
    .map(([label, names]) =>
      `<div class="s-label">${escapeHtml(label)}</div><div class="s-value">${escapeHtml(names.join(", "))}</div>`
    ).join("");

  const socialHtml = socialLinks.map(s => {
    const platform = s.platform.replace(/_/g, " ");
    const label = platform.charAt(0) + platform.slice(1).toLowerCase();
    return `<div class="s-label">${escapeHtml(label)}</div><a href="${s.url}" class="s-link">${escapeHtml(cleanUrl(s.url))}</a>`;
  }).join("");

  const expHtml = experiences.map(exp => {
    const bullets = Array.isArray(exp.bullets) ? (exp.bullets as string[]) : [];
    return `
      <div class="m-item">
        <div class="m-row">
          <div class="m-left"><div class="m-title">${escapeHtml(exp.role)}</div><div class="m-subtitle">${escapeHtml(exp.company)}</div></div>
          <div class="m-right">${escapeHtml(range(exp.startDate, exp.endDate, exp.isCurrent))}</div>
        </div>
        ${exp.description ? `<div class="m-desc">${escapeHtml(exp.description)}</div>` : ""}
        ${bullets.length ? `<ul>${bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
      </div>
    `;
  }).join("");

  const projectLimit = experiences.length > 0 ? 2 : 3;
  const projectsToShow = projects.slice(0, projectLimit);
  const projHtml = projectsToShow.map(p => {
    const bullets = Array.isArray(p.bullets) ? (p.bullets as string[]) : [];
    const links = [p.liveUrl ? `Live: ${cleanUrl(p.liveUrl)}` : "", p.repoUrl ? `GitHub: ${cleanUrl(p.repoUrl)}` : ""].filter(Boolean).join(" · ");
    return `
      <div class="m-item">
        <div class="m-row">
          <div class="m-left"><div class="m-title">${escapeHtml(p.title)}</div>${links ? `<div class="m-subtitle">${escapeHtml(links)}</div>` : ""}</div>
        </div>
        ${p.description ? `<div class="m-desc">${escapeHtml(p.description)}</div>` : ""}
        ${bullets.length ? `<ul>${bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
      </div>
    `;
  }).join("");

  const eduHtml = educations.map(edu => {
    const degree = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ");
    return `<div class="s-label">${escapeHtml(edu.school)}</div>${degree ? `<div class="s-value">${escapeHtml(degree)}</div>` : ""}<div class="s-date">${escapeHtml(range(edu.startDate, edu.endDate, edu.isCurrent))}</div>`;
  }).join("");

  const achHtml = achievements.map(a => `
    <div class="m-item">
      <div class="m-row">
        <div class="m-left"><div class="m-title">${escapeHtml(a.title)}</div>${a.description ? `<div class="m-desc">${escapeHtml(a.description)}</div>` : ""}</div>
        <div class="m-right">${a.date ? monthYear(a.date.toISOString()) : ""}</div>
      </div>
    </div>
  `).join("");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @page { size: 8.5in 11in; margin: 0; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: Arial, Helvetica, sans-serif; font-size: 9.5pt; color: #1e293b; }
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
        color: ${primaryColor};
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
      .s-link { font-size: 8.5pt; color: ${primaryColor}; text-decoration: none; word-break: break-all; display: block; margin-bottom: 10px; }
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
          <div class="s-name">${escapeHtml(user.fullName)}</div>
          <div class="s-headline">${escapeHtml(user.profile?.headline || "Software Engineer")}</div>

          <div class="s-section">Contact</div>
          <div class="s-label">Email</div>
          <a href="mailto:${user.email}" class="s-link">${escapeHtml(user.email)}</a>
          ${socialHtml}

          ${eduHtml ? `<div class="s-section">Education</div>${eduHtml}` : ""}
          ${skillsHtml ? `<div class="s-section">Skills</div>${skillsHtml}` : ""}
        </td>
        <td class="main">
          ${user.profile?.bio ? `<div class="m-bio">${escapeHtml(user.profile.bio)}</div>` : ""}
          ${experiences.length ? `<div class="m-section">Experience</div>${expHtml}` : ""}
          ${projectsToShow.length ? `<div class="m-section">Projects</div>${projHtml}` : ""}
          ${achievements.length ? `<div class="m-section">Achievements</div>${achHtml}` : ""}
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildResumeHtml(data: Awaited<ReturnType<typeof getResumeData>>) {
  const { user, socialLinks, experiences, projects, educations, achievements } = data;
  const profile = user.profile;

  // Clean and format social links with clickable anchors
  const formattedSocials = socialLinks
    .map((s) => {
      const platform = s.platform.replace(/_/g, " ");
      const label = platform.charAt(0) + platform.slice(1).toLowerCase();
      return `${label}: <a href="${s.url}" style="color: inherit; text-decoration: none;">${escapeHtml(cleanUrl(s.url))}</a>`;
    });

  // Header links: Email | Socials | Portfolio (if any)
  const headerLinks = [
    `<a href="mailto:${user.email}" style="color: inherit; text-decoration: none;">${escapeHtml(user.email)}</a>`,
    ...formattedSocials
  ]
    .filter(Boolean)
    .join(" | ");

  // Technical Skills Category Mapping
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

  // Group tech stacks
  const techStacks = profile?.techStacks || [];
  const groupedSkills: Record<string, string[]> = {};
  techStacks.forEach((ps) => {
    const cat = ps.tech.category;
    const label = categoryLabels[cat] || categoryLabels.OTHER;
    if (!groupedSkills[label]) groupedSkills[label] = [];
    groupedSkills[label].push(ps.tech.name);
  });

  const skillsHtml = Object.entries(groupedSkills)
    .map(([label, names]) => `
      <div class="skill-row">
        <strong>${escapeHtml(label)}:</strong> ${escapeHtml(names.join(", "))}
      </div>
    `)
    .join("");

  const section = (title: string, body: string) => `
    <div class="section">
      <div class="section-title">${escapeHtml(title)}</div>
      <div class="section-body">${body}</div>
    </div>
  `;

  const expHtml = experiences
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
          ${exp.description ? `<div class="muted">${escapeHtml(exp.description)}</div>` : ""}
          ${bullets.length ? `<ul>${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
        </div>
      `;
    })
    .join("");

  const eduHtml = educations
    .map((edu) => {
      const subtitle = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(", ");
      const bullets = Array.isArray(edu.bullets) ? (edu.bullets as string[]) : [];
      return `
        <div class="item">
          <div class="row">
            <div class="left">
              <div class="item-title">${escapeHtml(edu.school)}</div>
              ${subtitle ? `<div class="item-subtitle">${escapeHtml(subtitle)}</div>` : ""}
            </div>
            <div class="right">${escapeHtml(range(edu.startDate, edu.endDate, edu.isCurrent))}</div>
          </div>
          ${edu.description ? `<div class="muted">${escapeHtml(edu.description)}</div>` : ""}
          ${bullets.length ? `<ul>${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
        </div>
      `;
    })
    .join("");

  // Projects logic: 2 if experience exists, else 3
  const projectLimit = experiences.length > 0 ? 2 : 3;
  const projectsToShow = projects.slice(0, projectLimit);
  
  const projHtml = projectsToShow
    .map((p) => {
      const bullets = Array.isArray(p.bullets) ? (p.bullets as string[]) : [];
      const links = [];
      if (p.liveUrl) links.push(`Live Demo: <a href="${p.liveUrl}" style="color: inherit; text-decoration: none;">${escapeHtml(cleanUrl(p.liveUrl))}</a>`);
      if (p.repoUrl) links.push(`GitHub: <a href="${p.repoUrl}" style="color: inherit; text-decoration: none;">${escapeHtml(cleanUrl(p.repoUrl))}</a>`);
      
      return `
        <div class="item">
          <div class="row">
            <div class="left">
              <div class="item-title">${escapeHtml(p.title)}</div>
              ${links.length ? `<div class="item-subtitle">${links.join(" | ")}</div>` : ""}
            </div>
          </div>
          ${p.description ? `<div class="muted">${escapeHtml(p.description)}</div>` : ""}
          ${bullets.length ? `<ul>${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
        </div>
      `;
    })
    .join("");

  const achHtml = achievements
    .map((a) => {
      const dateText = a.date ? monthYear(a.date.toISOString()) : "";
      const left = [a.title, a.provider].filter(Boolean).join(" • ");
      return `
        <div class="item">
          <div class="row">
            <div class="left">
              <div class="item-title">${escapeHtml(left)}</div>
              ${a.description ? `<div class="muted">${escapeHtml(a.description)}</div>` : ""}
            </div>
            <div class="right">${escapeHtml(dateText)}</div>
          </div>
        </div>
      `;
    })
    .join("");

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
          font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
          font-size: 9.5pt;
          line-height: 1.25;
          color: #111;
          margin: 0;
        }
        .name {
          font-size: 18pt;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin: 0;
          text-align: center;
        }
        .contact { 
          margin-top: 4px; 
          color: #333; 
          font-size: 9pt; 
          text-align: center;
        }
        .divider { height: 1px; background: #ddd; margin: 8px 0 10px; }
        .section { margin-bottom: 10px; }
        .section-title {
          font-size: 10pt;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          border-bottom: 1px solid #eee;
          padding-bottom: 2px;
          margin-bottom: 5px;
        }
        .item { margin-bottom: 6px; }
        .row { display: flex; justify-content: space-between; gap: 10px; }
        .left { flex: 1; min-width: 0; }
        .right { white-space: nowrap; color: #444; font-size: 9pt; }
        .item-title { font-weight: 700; font-size: 9.8pt; }
        .item-subtitle { color: #222; margin-top: 1px; font-size: 9pt; font-weight: 500; }
        .skill-row { margin-bottom: 2px; }
        .muted { color: #444; margin-top: 1px; font-size: 9pt; }
        ul { margin: 6px 0 0 0; padding-left: 15px; }
        li { margin: 1px 0; }
      </style>
    </head>
    <body>
      <h1 class="name">${escapeHtml(user.fullName)}</h1>
      <div class="contact">${headerLinks}</div>
      <div class="divider"></div>
      
      ${experiences.length ? section("Experience", expHtml) : ""}
      ${educations.length ? section("Education", eduHtml) : ""}
      ${projectsToShow.length ? section("Projects", projHtml) : ""}
      ${Object.keys(groupedSkills).length ? section("Technical Skills", skillsHtml) : ""}
      ${achievements.length ? section("Achievements", achHtml) : ""}
    </body>
  </html>
  `;
}

async function renderPdfFromHtml(html: string) {
  // On Render/production: use sparticuz/chromium (low RAM, no system deps needed)
  // On local Windows dev: falls back to system Chrome if CHROME_EXECUTABLE_PATH is set
  const isLocal = process.env.NODE_ENV !== "production";

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: null,               // chromium.defaultViewport resolves to null
    executablePath: isLocal
      ? (process.env.CHROME_EXECUTABLE_PATH ?? await chromium.executablePath())
      : await chromium.executablePath(),
    headless: true,                      // chromium.headless resolves to true in production
  });
  try {
    const page = await browser.newPage();
    // Set viewport to US Letter width at 96dpi (8.5in * 96 = 816px)
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
  const { user, socialLinks, experiences, projects, educations, achievements } = data;
  const profile = user.profile;

  const children: Paragraph[] = [];

  // Name (centered)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: user.fullName, bold: true, size: 36 })], // 18pt
    })
  );

  // Header Links with Hyperlinks
  const headerNodes: (TextRun | ExternalHyperlink)[] = [];
  
  // Email
  headerNodes.push(
    new ExternalHyperlink({
      children: [new TextRun({ text: user.email, size: 18, color: "000000" })],
      link: `mailto:${user.email}`,
    })
  );

  socialLinks.forEach((s) => {
    headerNodes.push(new TextRun({ text: " | ", size: 18 }));
    const platform = s.platform.replace(/_/g, " ");
    const label = platform.charAt(0) + platform.slice(1).toLowerCase();
    headerNodes.push(new TextRun({ text: `${label}: `, size: 18 }));
    headerNodes.push(
      new ExternalHyperlink({
        children: [new TextRun({ text: cleanUrl(s.url), size: 18, color: "000000" })],
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
        children: [new TextRun({ text, bold: true, size: 20 })], // 10pt
      })
    );
  };

  // Sections in specific order: Experience, Education, Projects, Skills, Achievements

  // 1. Experience
  if (experiences.length) {
    addHeading("EXPERIENCE");
    experiences.forEach((exp) => {
      const subtitle = `${exp.company}${exp.location ? ` • ${exp.location}` : ""}`;
      const bullets = Array.isArray(exp.bullets) ? (exp.bullets as string[]) : [];
      
      children.push(
        new Paragraph({
          spacing: { before: 80 },
          children: [
            new TextRun({ text: exp.role, bold: true, size: 20 }),
            new TextRun({ text: `\t${range(exp.startDate, exp.endDate, exp.isCurrent)}` }),
          ],
          tabStops: [{ type: "right", position: 9000 }],
        })
      );
      children.push(
        new Paragraph({
          children: [new TextRun({ text: subtitle, size: 18, bold: true })],
        })
      );
      bullets.forEach((b) => {
        children.push(new Paragraph({ text: b, bullet: { level: 0 }, spacing: { before: 20 } }));
      });
    });
  }

  // 2. Education
  if (educations.length) {
    addHeading("EDUCATION");
    educations.forEach((edu) => {
      const subtitle = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(", ");
      const bullets = Array.isArray(edu.bullets) ? (edu.bullets as string[]) : [];
      
      children.push(
        new Paragraph({
          spacing: { before: 80 },
          children: [
            new TextRun({ text: edu.school, bold: true, size: 20 }),
            new TextRun({ text: `\t${range(edu.startDate, edu.endDate, edu.isCurrent)}` }),
          ],
          tabStops: [{ type: "right", position: 9000 }],
        })
      );
      if (subtitle) {
        children.push(new Paragraph({ children: [new TextRun({ text: subtitle, size: 18, bold: true })] }));
      }
      bullets.forEach((b) => {
        children.push(new Paragraph({ text: b, bullet: { level: 0 }, spacing: { before: 20 } }));
      });
    });
  }

  // 3. Projects (Logic: 2 if Exp exists, else 3)
  const projectLimit = experiences.length > 0 ? 2 : 3;
  const projectsToShow = projects.slice(0, projectLimit);
  if (projectsToShow.length) {
    addHeading("PROJECTS");
    projectsToShow.forEach((p) => {
      const bullets = Array.isArray(p.bullets) ? (p.bullets as string[]) : [];
      
      children.push(
        new Paragraph({
          spacing: { before: 80 },
          children: [new TextRun({ text: p.title, bold: true, size: 20 })],
        })
      );

      const linkNodes: (TextRun | ExternalHyperlink)[] = [];
      if (p.liveUrl) {
        linkNodes.push(new TextRun({ text: "Live Demo: ", size: 18, bold: true }));
        linkNodes.push(new ExternalHyperlink({
          children: [new TextRun({ text: cleanUrl(p.liveUrl), size: 18, color: "000000" })],
          link: p.liveUrl,
        }));
      }
      if (p.liveUrl && p.repoUrl) linkNodes.push(new TextRun({ text: " | ", size: 18 }));
      if (p.repoUrl) {
        linkNodes.push(new TextRun({ text: "GitHub: ", size: 18, bold: true }));
        linkNodes.push(new ExternalHyperlink({
          children: [new TextRun({ text: cleanUrl(p.repoUrl), size: 18, color: "000000" })],
          link: p.repoUrl,
        }));
      }

      if (linkNodes.length) {
        children.push(new Paragraph({ children: linkNodes }));
      }

      bullets.forEach((b) => {
        children.push(new Paragraph({ text: b, bullet: { level: 0 }, spacing: { before: 20 } }));
      });
    });
  }

  // 4. Skills
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

  const techStacks = profile?.techStacks || [];
  const groupedSkills: Record<string, string[]> = {};
  techStacks.forEach((ps) => {
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
            new TextRun({ text: `${label}: `, bold: true, size: 19 }),
            new TextRun({ text: names.join(", "), size: 19 }),
          ],
        })
      );
    });
  }

  // 5. Achievements
  if (achievements.length) {
    addHeading("ACHIEVEMENTS");
    achievements.forEach((a) => {
      const subtitle = [a.provider, a.type].filter(Boolean).join(" • ");
      children.push(
        new Paragraph({
          spacing: { before: 80 },
          children: [
            new TextRun({ text: a.title, bold: true, size: 20 }),
            new TextRun({ text: `\t${a.date ? monthYear(a.date.toISOString()) : ""}` }),
          ],
          tabStops: [{ type: "right", position: 9000 }],
        })
      );
      if (subtitle) {
        children.push(new Paragraph({ children: [new TextRun({ text: subtitle, size: 18 })] }));
      }
    });
  }

  const doc = new Document({
    sections: [{ 
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 }, // 0.5 inch (1440 twips = 1 inch)
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
    const isDesign = String(args.templateType).toUpperCase() === "DESIGN";
    const html = isDesign 
      ? buildDesignResumeHtml(data, args.activeTheme || "SKEUOMORPHIC")
      : buildResumeHtml(data);
    const buffer = await renderPdfFromHtml(html);
    return { buffer, filename: isDesign ? "design-resume.pdf" : "resume.pdf", contentType: "application/pdf" };
  }

  const buffer = await renderDocx(data);
  return {
    buffer,
    filename: "resume.docx",
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
}

