import pdfParse from "pdf-parse";
import { nimChat } from "./ai.service";
import { prisma } from "../config/database";
import { BadRequestError } from "../utils/errors";
import { SocialPlatform, AchievementType } from "@prisma/client";

interface ParsedResume {
  profile: {
    displayName: string;
    phoneNumber?: string;
    bio: string;
  };
  socials: Array<{
    platform: SocialPlatform;
    url: string;
  }>;
  experiences: Array<{
    company: string;
    role: string;
    location?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    bullets: string[];
  }>;
  educations: Array<{
    school: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    score?: string;
    scoreType?: string;
  }>;
  projects: Array<{
    title: string;
    description?: string;
    repoUrl?: string;
    liveUrl?: string;
    bullets: string[];
    techTags: string[];
  }>;
  achievements: Array<{
    title: string;
    provider?: string;
    date?: string;
    type: AchievementType;
  }>;
  skills: Array<{
    category: string;
    skills: string[];
  }>;
}

function parseSafeDate(dateStr: string | undefined | null): Date {
  if (!dateStr) return new Date();
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
}

function parseSafeNullableDate(dateStr: string | undefined | null): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function cleanJson(str: string): string {
  return str.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
}

/**
 * Extracts raw text from a PDF buffer.
 */
export async function parseResumeText(fileBuffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(fileBuffer);
    return data.text || "";
  } catch (error: any) {
    throw new BadRequestError(`Failed to parse PDF text: ${error?.message || error}`);
  }
}

/**
 * Uses LLM to extract structured resume details from raw text.
 */
export async function extractStructuredDetails(text: string): Promise<ParsedResume> {
  const systemPrompt = `You are a world-class CV/resume parser.
Your task is to extract all professional information from the raw resume text provided and return it in a structured JSON format.

Strict Rules:
1. Return ONLY valid JSON matching the schema below. Do not wrap it in markdown code blocks.
2. For dates, parse and convert them to "YYYY-MM-DD" format (e.g. "May 2021" becomes "2021-05-01", "2018" becomes "2018-01-01").
3. If a date is "Present" or represents the current job/studies, set "isCurrent" to true and "endDate" to null.
4. Keep the profile bio / professional summary concise (under 200 words).
5. For achievements, map the type to one of: "HACKATHON", "COMPETITION", "CERTIFICATE", "AWARD", "OTHER".
6. For social links, map the platform to one of: "GITHUB", "LINKEDIN", "TWITTER", "LEETCODE", "HACKERRANK", "PERSONAL_WEBSITE", "OTHER".

JSON Schema:
{
  "profile": {
    "displayName": "Full Name",
    "phoneNumber": "Phone number or empty string",
    "bio": "Concise summary (max 200 words)"
  },
  "socials": [
    { "platform": "GITHUB | LINKEDIN | TWITTER | LEETCODE | HACKERRANK | PERSONAL_WEBSITE | OTHER", "url": "URL" }
  ],
  "experiences": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "location": "City, State or Country or empty",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD or null",
      "isCurrent": true,
      "bullets": ["Bullet 1", "Bullet 2"]
    }
  ],
  "educations": [
    {
      "school": "Institution Name",
      "degree": "Degree or empty",
      "fieldOfStudy": "Major/Field or empty",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD or null",
      "isCurrent": false,
      "score": "GPA or score or empty",
      "scoreType": "GPA | CGPA | Percentage | empty"
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "Short summary",
      "repoUrl": "Repo link or empty",
      "liveUrl": "Live link or empty",
      "bullets": ["Key highlight 1", "Key highlight 2"],
      "techTags": ["React", "TypeScript"]
    }
  ],
  "achievements": [
    {
      "title": "Award/Certificate Name",
      "provider": "Issuer or empty",
      "date": "YYYY-MM-DD or null",
      "type": "HACKATHON | COMPETITION | CERTIFICATE | AWARD | OTHER"
    }
  ],
  "skills": [
    {
      "category": "Heading (e.g. Languages)",
      "skills": ["JavaScript", "Python"]
    }
  ]
}`;

  const responseContent = await nimChat([
    { role: "system", content: systemPrompt },
    { role: "user", content: `Please parse this resume text:\n\n${text}` }
  ], { 
    maxTokens: 4096, 
    temperature: 0.2, 
    jsonMode: true 
  });

  try {
    const cleaned = cleanJson(responseContent);
    return JSON.parse(cleaned) as ParsedResume;
  } catch (err: any) {
    throw new BadRequestError(`LLM returned invalid JSON schema: ${err?.message || err}`);
  }
}

/**
 * Updates the user's database portfolio atomically inside a transaction.
 */
export async function autoFillUserProfile(userId: string, data: ParsedResume): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // 1. Update Profile info
    if (data.profile) {
      // Ensure bio is capped/sanitized if needed (word limit is 200 words)
      const bioWords = (data.profile.bio || "").trim().split(/\s+/).filter(Boolean);
      const bio = bioWords.length > 200 ? bioWords.slice(0, 200).join(" ") : data.profile.bio;

      await tx.profile.upsert({
        where: { userId },
        create: {
          userId,
          displayName: data.profile.displayName || "",
          phoneNumber: data.profile.phoneNumber || "",
          bio,
        },
        update: {
          displayName: data.profile.displayName || "",
          phoneNumber: data.profile.phoneNumber || "",
          bio,
        },
      });
    }

    // 2. Clear and seed SocialLinks
    await tx.socialLink.deleteMany({ where: { userId } });
    if (Array.isArray(data.socials)) {
      const validSocials = Object.values(SocialPlatform);
      const socialsToCreate = data.socials
        .filter((social) => validSocials.includes(social.platform))
        .map((social) => ({
          userId,
          platform: social.platform,
          url: social.url,
        }));
      if (socialsToCreate.length > 0) {
        await tx.socialLink.createMany({ data: socialsToCreate });
      }
    }

    // 3. Clear and seed Experience
    await tx.experience.deleteMany({ where: { userId } });
    if (Array.isArray(data.experiences)) {
      const experiencesToCreate = data.experiences.map((exp, i) => ({
        userId,
        company: exp.company || "",
        role: exp.role || "",
        location: exp.location || null,
        startDate: parseSafeDate(exp.startDate),
        endDate: parseSafeNullableDate(exp.endDate),
        isCurrent: exp.isCurrent || false,
        bullets: (Array.isArray(exp.bullets) ? exp.bullets : []) as any,
        displayOrder: i,
      }));
      if (experiencesToCreate.length > 0) {
        await tx.experience.createMany({ data: experiencesToCreate });
      }
    }

    // 4. Clear and seed Education
    await tx.education.deleteMany({ where: { userId } });
    if (Array.isArray(data.educations)) {
      const educationsToCreate = data.educations.map((edu, i) => ({
        userId,
        school: edu.school || "",
        degree: edu.degree || null,
        fieldOfStudy: edu.fieldOfStudy || null,
        startDate: parseSafeDate(edu.startDate),
        endDate: parseSafeNullableDate(edu.endDate),
        isCurrent: edu.isCurrent || false,
        scoreType: edu.scoreType || null,
        score: edu.score || null,
        displayOrder: i,
      }));
      if (educationsToCreate.length > 0) {
        await tx.education.createMany({ data: educationsToCreate });
      }
    }

    // 5. Clear and seed Projects
    await tx.project.deleteMany({ where: { userId } });
    if (Array.isArray(data.projects)) {
      const projectsToCreate = data.projects.map((proj, i) => ({
        userId,
        title: proj.title || "",
        description: null,
        repoUrl: proj.repoUrl || null,
        liveUrl: proj.liveUrl || null,
        bullets: (() => {
          const b = Array.isArray(proj.bullets) ? [...proj.bullets] : [];
          const desc = proj.description?.trim();
          if (desc) {
            const lowerDesc = desc.toLowerCase();
            const alreadyExists = b.some((bullet) => {
              const cleaned = bullet.trim().toLowerCase();
              if (lowerDesc.length > 8) {
                return cleaned === lowerDesc || cleaned.startsWith(lowerDesc) || lowerDesc.startsWith(cleaned);
              }
              return cleaned === lowerDesc;
            });
            if (!alreadyExists) {
              b.unshift(desc);
            }
          }
          return b;
        })() as any,
        techTags: (Array.isArray(proj.techTags) ? proj.techTags : []) as any,
        displayOrder: i,
      }));
      if (projectsToCreate.length > 0) {
        await tx.project.createMany({ data: projectsToCreate });
      }
    }

    // 6. Clear and seed Achievements
    await tx.achievement.deleteMany({ where: { userId } });
    if (Array.isArray(data.achievements)) {
      const validTypes = Object.values(AchievementType);
      const achievementsToCreate = data.achievements.map((ach, i) => {
        const type = validTypes.includes(ach.type) ? ach.type : AchievementType.OTHER;
        return {
          userId,
          title: ach.title || "",
          provider: ach.provider || null,
          type,
          date: parseSafeNullableDate(ach.date),
          displayOrder: i,
        };
      });
      if (achievementsToCreate.length > 0) {
        await tx.achievement.createMany({ data: achievementsToCreate });
      }
    }

    // 7. Clear and seed Skills (ProfileSkill)
    await tx.profileSkill.deleteMany({ where: { userId } });
    if (Array.isArray(data.skills)) {
      const skillsToCreate = data.skills.map((group, i) => ({
        userId,
        category: group.category || "",
        skills: Array.isArray(group.skills) ? group.skills : [],
        displayOrder: i,
      }));
      if (skillsToCreate.length > 0) {
        await tx.profileSkill.createMany({ data: skillsToCreate });
      }
    }
  });
}
