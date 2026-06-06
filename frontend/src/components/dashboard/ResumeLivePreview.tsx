"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";
import { useExperienceStore } from "@/store/useExperienceStore";
import { useEducationStore } from "@/store/useEducationStore";
import { useSocialStore } from "@/store/useSocialStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useProjectStore } from "@/store/useProjectStore";
import { useAchievementStore } from "@/store/useAchievementStore";
import { useProfileSkillStore } from "@/store/useProfileSkillStore";
import { useCustomSectionStore } from "@/store/useCustomSectionStore";

type ResumeTemplate = "ATS" | "DESIGN" | "MODERN" | "ENHANCV";

interface ResumeLivePreviewProps {
  templateType: ResumeTemplate;
}

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
      sections: {
        summary: config.sections?.summary !== undefined ? config.sections.summary : defaults.sections.summary,
        experience: config.sections?.experience !== undefined ? config.sections.experience : defaults.sections.experience,
        education: config.sections?.education !== undefined ? config.sections.education : defaults.sections.education,
        projects: config.sections?.projects !== undefined ? config.sections.projects : defaults.sections.projects,
        skills: config.sections?.skills !== undefined ? config.sections.skills : defaults.sections.skills,
        achievements: config.sections?.achievements !== undefined ? config.sections.achievements : defaults.sections.achievements,
        customSections: config.sections?.customSections !== undefined ? config.sections.customSections : defaults.sections.customSections,
      },
      limits: {
        projects: Number(config.limits?.projects ?? defaults.limits.projects),
        experiences: Number(config.limits?.experiences ?? defaults.limits.experiences),
        achievements: Number(config.limits?.achievements ?? defaults.limits.achievements),
        educations: Number(config.limits?.educations ?? defaults.limits.educations),
      },
      styling: {
        fontFamily: config.styling?.fontFamily ?? defaults.styling.fontFamily,
        fontSize: config.styling?.fontSize ?? defaults.styling.fontSize,
      },
    };
  } catch {
    return defaults;
  }
}

export function ResumeLivePreview({ templateType }: ResumeLivePreviewProps) {
  const { profile, isLoading: isProfileLoading } = useProfileStore();
  const { experiences, fetchExperiences, isLoading: isExpLoading } = useExperienceStore();
  const { educations, fetchEducations, isLoading: isEduLoading } = useEducationStore();
  const { links, fetchLinks, isLoading: isSocialsLoading } = useSocialStore();
  const { projects, fetchProjects, isLoading: isProjectsLoading } = useProjectStore();
  const { achievements, fetchAchievements, isLoading: isAchievementsLoading } = useAchievementStore();
  const { profileSkills, fetchProfileSkills, isLoading: isSkillsLoading } = useProfileSkillStore();
  const { customSections, fetchCustomSections, isLoading: isCSLoading } = useCustomSectionStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchExperiences();
    fetchEducations();
    fetchLinks();
    fetchProjects();
    fetchAchievements();
    fetchProfileSkills();
    fetchCustomSections();
  }, [fetchExperiences, fetchEducations, fetchLinks, fetchProjects, fetchAchievements, fetchProfileSkills, fetchCustomSections]);

  const isLoading = isProfileLoading || isExpLoading || isEduLoading || isSocialsLoading || isProjectsLoading || isAchievementsLoading || isSkillsLoading || isCSLoading;

  if (isLoading && (!profile || (experiences.length === 0 && educations.length === 0))) {
    return (
      <div className="flex items-center justify-center bg-white border shadow-sm mx-auto" style={{ width: '100%', maxWidth: '794px', aspectRatio: '8.5 / 11' }}>
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  // Parse custom resume settings configuration
  const config = parseResumeConfig(profile);

  // Apply limits and visibility rules
  const sortedExperiences = [...experiences]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, config.limits.experiences);
  const sortedEducations = [...educations]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, config.limits.educations);
  const sortedProjects = [...projects]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, config.limits.projects);
  const sortedAchievements = [...achievements]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, config.limits.achievements);
  const sortedCustomSections = [...customSections]
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const primaryColor = THEME_COLOR_MAP[user?.selectedTheme || "MINIMAL"] || "#111111";

  // Shared formatting functions
  const cleanUrl = (url: string) => url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
  const range = (start: Date | string, end: Date | string | null, isCurrent: boolean) => {
    const startText = new Date(start).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    const endText = isCurrent || !end ? "Present" : new Date(end).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    return `${startText} - ${endText}`;
  };

  // Typography Settings
  const stylingMap: React.CSSProperties = {
    fontFamily: config.styling.fontFamily,
    fontSize: config.styling.fontSize,
  };

  return (
    <div className="resume-preview-container overflow-hidden rounded-xl border shadow-2xl bg-white mx-auto relative" style={{ width: '100%', maxWidth: '794px', aspectRatio: '8.5 / 11' }}>
      
      {/* -------------------- DESIGN TEMPLATE (2-COLUMN) -------------------- */}
      {templateType === "DESIGN" && (
        <div className="absolute inset-0 flex text-black bg-white overflow-y-auto custom-scrollbar" style={stylingMap}>
          
          {/* Sidebar */}
          <div className="flex-none bg-[#0f172a] text-[#e2e8f0] p-6" style={{ width: '32%' }}>
            <h1 className="text-2xl font-black text-white leading-tight tracking-tight mb-1">{profile?.displayName || user?.fullName || "Your Name"}</h1>
            
            <div className="text-[9px] font-bold uppercase tracking-widest text-[#64748b] mt-4 mb-2">Contact</div>
            <div className="text-[9px] font-semibold text-[#94a3b8] mb-0.5">Email</div>
            <div className="text-[9px] mb-3 truncate text-[#38bdf8]">{user?.email}</div>
            {profile?.phoneNumber && (
              <>
                <div className="text-[9px] font-semibold text-[#94a3b8] mb-0.5">Phone</div>
                <div className="text-[9px] mb-3 truncate text-[#38bdf8]">{profile.phoneNumber}</div>
              </>
            )}
            
            {links.filter(l => l.visibleInDefault).map(link => {
              const platform = link.platform.replace(/_/g, " ");
              const label = platform.charAt(0) + platform.slice(1).toLowerCase();
              return (
                <div key={link.id} className="mb-3">
                  <div className="text-[9px] font-semibold text-[#94a3b8] mb-0.5">{label}</div>
                  <div className="text-[9px] truncate text-[#38bdf8]">{cleanUrl(link.url)}</div>
                </div>
              );
            })}

            {config.sections.education && sortedEducations.length > 0 && (
              <>
                <div className="text-[9px] font-bold uppercase tracking-widest text-[#64748b] mt-5 mb-2">Education</div>
                {sortedEducations.map(edu => (
                  <div key={edu.id} className="mb-3">
                    <div className="text-[9px] font-semibold text-[#94a3b8] mb-0.5">{edu.school}</div>
                    <div className="text-[9.5px] text-[#e2e8f0] mb-1">{[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}</div>
                    <div className="text-[8.5px] italic text-[#475569]">{range(edu.startDate, edu.endDate, edu.isCurrent)}</div>
                    {edu.score && (
                      <div className="text-[8.5px] font-semibold text-[#94a3b8] mt-0.5">
                        {edu.scoreType || "CGPA"}: {edu.score}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}

            {config.sections.skills && profileSkills.length > 0 && (
              <>
                <div className="text-[9px] font-bold uppercase tracking-widest text-[#64748b] mt-5 mb-2">Skills</div>
                {profileSkills.map(group => (
                  <div key={group.id} className="mb-3">
                    <div className="text-[9px] font-semibold text-[#94a3b8] mb-0.5">{group.category}</div>
                    <div className="text-[9.5px] text-[#e2e8f0]">{group.skills.join(", ")}</div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Main Area */}
          <div className="flex-1 p-8 bg-white overflow-y-auto custom-scrollbar">
            {config.sections.summary && profile?.bio && (
              <div className="text-[9.5px] text-[#475569] leading-relaxed mb-4 pb-3 border-b-2 border-[#f1f5f9]">
                {profile.bio}
              </div>
            )}

            {config.sections.experience && sortedExperiences.length > 0 && (
              <>
                <div className="text-[11.5px] font-black uppercase tracking-wide text-[#0f172a] mt-3 mb-3 pb-1 border-b-2" style={{ borderColor: primaryColor }}>Experience</div>
                {sortedExperiences.map(exp => (
                  <div key={exp.id} className="mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[11.5px] font-bold text-[#0f172a]">{exp.role}</div>
                        <div className="text-[10px] font-semibold mt-0.5" style={{ color: primaryColor }}>{exp.company}</div>
                      </div>
                      <div className="text-[9.5px] text-[#64748b] whitespace-nowrap pt-0.5">{range(exp.startDate, exp.endDate, exp.isCurrent)}</div>
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[9.5px] text-[#475569] leading-relaxed">
                        {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </>
            )}
            
            {config.sections.projects && sortedProjects.length > 0 && (
              <>
                <div className="text-[11.5px] font-black uppercase tracking-wide text-[#0f172a] mt-3 mb-3 pb-1 border-b-2" style={{ borderColor: primaryColor }}>Projects</div>
                {sortedProjects.map(proj => (
                  <div key={proj.id} className="mb-4">
                    <div className="flex justify-between items-start">
                      <div className="text-[11px] font-bold text-[#0f172a]">{proj.title}</div>
                      {proj.techTags && proj.techTags.length > 0 && (
                        <div className="text-[8.5px] text-[#64748b] text-right">{proj.techTags.slice(0, 3).join(" · ")}</div>
                      )}
                    </div>
                    {proj.bullets && proj.bullets.length > 0 && (
                      <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[9px] text-[#475569] leading-relaxed">
                        {proj.bullets.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </>
            )}

            {config.sections.achievements && sortedAchievements.length > 0 && (
              <>
                <div className="text-[11.5px] font-black uppercase tracking-wide text-[#0f172a] mt-3 mb-2 pb-1 border-b-2" style={{ borderColor: primaryColor }}>Achievements</div>
                {sortedAchievements.map(ach => (
                  <div key={ach.id} className="mb-2 flex justify-between items-start">
                    <div>
                      <div className="text-[10px] font-bold text-[#0f172a]">{ach.title}</div>
                      {ach.provider && <div className="text-[9px] text-[#475569]">{ach.provider}</div>}
                    </div>
                    <div className="text-[8.5px] text-[#64748b] whitespace-nowrap">{ach.date ? new Date(ach.date).getFullYear() : ach.type.replace(/_/g, " ")}</div>
                  </div>
                ))}
              </>
            )}

            {config.sections.customSections && sortedCustomSections.length > 0 && (
              <>
                {sortedCustomSections.map(section => (
                  <div key={section.id} className="mt-4">
                    <div className="text-[11.5px] font-black uppercase tracking-wide text-[#0f172a] mt-3 mb-2 pb-1 border-b-2" style={{ borderColor: primaryColor }}>{section.title}</div>
                    <ul className="list-disc pl-4 space-y-0.5 text-[9.5px] text-[#475569] leading-relaxed">
                      {section.bullets.map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* -------------------- ATS TEMPLATE (1-COLUMN) -------------------- */}
      {templateType === "ATS" && (
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col gap-3 text-[#111] bg-white overflow-y-auto custom-scrollbar" style={stylingMap}>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-1">{profile?.displayName || user?.fullName || "Your Name"}</h1>
            <div className="text-[13px] text-[#333] flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
              <span><a href={`mailto:${user?.email}`} className="text-[#3b82f6] break-all" style={{ textDecoration: 'none' }}>{user?.email}</a></span>
              {profile?.phoneNumber && <span className="shrink-0"> | Phone: {profile.phoneNumber}</span>}
              {links.filter(l => l.visibleInDefault).map(link => (
                <span key={link.id} className="break-all"> | {link.platform.replace(/_/g, " ")}: <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] break-all" style={{ textDecoration: 'none' }}>{cleanUrl(link.url)}</a></span>
              ))}
            </div>
          </div>
          
          <div className="h-[1.5px] bg-[#222] my-1"></div>

          {config.sections.summary && profile?.bio && (
            <div className="mb-2">
              <div className="text-[12px] font-bold uppercase tracking-wide border-b border-[#888] pb-0.5 mb-1.5">Professional Summary</div>
              <div className="text-[11px] text-[#444] leading-relaxed">{profile.bio}</div>
            </div>
          )}

          {config.sections.experience && sortedExperiences.length > 0 && (
            <div className="mb-2">
              <div className="text-[12px] font-bold uppercase tracking-wide border-b border-[#888] pb-0.5 mb-2">Experience</div>
              {sortedExperiences.map((exp) => (
                <div key={exp.id} className="mb-2">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <div className="text-[12px] font-bold">{exp.role}</div>
                    <div className="text-[11px] text-[#444]">{range(exp.startDate, exp.endDate, exp.isCurrent)}</div>
                  </div>
                  <div className="text-[11px] font-medium text-[#222] mb-1">
                    {exp.company}{exp.location ? ` • ${exp.location}` : ""}
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-[#444] leading-relaxed">
                      {exp.bullets.map((bullet, i) => <li key={i}>{bullet}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {config.sections.education && sortedEducations.length > 0 && (
            <div className="mb-2">
              <div className="text-[12px] font-bold uppercase tracking-wide border-b border-[#888] pb-0.5 mb-2">Education</div>
              {sortedEducations.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <div className="text-[12px] font-bold">{edu.school}</div>
                    <div className="text-[11px] text-[#444]">{range(edu.startDate, edu.endDate, edu.isCurrent)}</div>
                  </div>
                  <div className="text-[11px] font-medium text-[#222]">
                    {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(", ")}
                    {edu.score && ` (${edu.scoreType || "CGPA"}: ${edu.score})`}
                  </div>
                </div>
              ))}
            </div>
          )}

          {config.sections.skills && profileSkills.length > 0 && (
            <div className="mb-2">
              <div className="text-[12px] font-bold uppercase tracking-wide border-b border-[#888] pb-0.5 mb-1.5">Technical Skills</div>
              {profileSkills.map(group => (
                <div key={group.id} className="text-[11px] mb-0.5">
                  <strong className="text-[#111]">{group.category}:</strong> <span className="text-[#444]">{group.skills.join(", ")}</span>
                </div>
              ))}
            </div>
          )}
          
          {config.sections.projects && sortedProjects.length > 0 && (
            <div className="mb-2">
              <div className="text-[12px] font-bold uppercase tracking-wide border-b border-[#888] pb-0.5 mb-2">Projects</div>
              {sortedProjects.map(proj => (
                <div key={proj.id} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <div className="text-[12px] font-bold">{proj.title}</div>
                    {proj.techTags && <div className="text-[10px] text-[#555]">{proj.techTags.slice(0, 3).join(" · ")}</div>}
                  </div>
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-[#444] leading-relaxed">
                      {proj.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {config.sections.achievements && sortedAchievements.length > 0 && (
            <div className="mb-2">
              <div className="text-[12px] font-bold uppercase tracking-wide border-b border-[#888] pb-0.5 mb-2">Achievements</div>
              {sortedAchievements.map(ach => (
                <div key={ach.id} className="flex justify-between items-baseline mb-1">
                  <div>
                    <span className="text-[11px] font-bold">{ach.title}</span>
                    {ach.provider && <span className="text-[10px] text-[#444]"> · {ach.provider}</span>}
                  </div>
                  <div className="text-[10px] text-[#555] whitespace-nowrap">{ach.date ? new Date(ach.date).getFullYear() : ""}</div>
                </div>
              ))}
            </div>
          )}

          {config.sections.customSections && sortedCustomSections.length > 0 && (
            <div className="mb-2">
              {sortedCustomSections.map(section => (
                <div key={section.id} className="mb-3">
                  <div className="text-[12px] font-bold uppercase tracking-wide border-b border-[#888] pb-0.5 mb-2">{section.title}</div>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-[#444] leading-relaxed">
                    {section.bullets.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* -------------------- MODERN TEMPLATE (serif, clean) -------------------- */}
      {templateType === "MODERN" && (
        <div className="absolute inset-0 p-8 md:p-10 flex flex-col gap-2.5 text-[#1a1a1a] bg-white overflow-y-auto custom-scrollbar" style={{ ...stylingMap, fontFamily: stylingMap.fontFamily || 'Georgia, serif' }}>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>{profile?.displayName || user?.fullName || "Your Name"}</h1>
            <div className="text-[12px] text-[#444] flex flex-wrap justify-center items-center gap-x-2">
              <span><a href={`mailto:${user?.email}`} className="text-[#3b82f6] break-all" style={{ textDecoration: 'none' }}>{user?.email}</a></span>
              {profile?.phoneNumber && <span className="shrink-0">| {profile.phoneNumber}</span>}
              {links.filter(l => l.visibleInDefault).map(link => (
                <span key={link.id} className="break-all">| {link.platform.replace(/_/g, " ")}: <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] break-all" style={{ textDecoration: 'none' }}>{cleanUrl(link.url)}</a></span>
              ))}
            </div>
          </div>
          <div className="border-t-2 border-[#1a1a1a] mb-1.5" />

          {config.sections.summary && profile?.bio && (
            <div className="mb-2 text-[11px] text-[#333] leading-relaxed">
              <div className="text-[12px] font-bold uppercase tracking-wider border-b border-[#aaa] pb-0.5 mb-1.5" style={{ fontFamily: 'Arial, sans-serif' }}>Summary</div>
              {profile.bio}
            </div>
          )}

          {config.sections.experience && sortedExperiences.length > 0 && (
            <div className="mb-2">
              <div className="text-[12px] font-bold uppercase tracking-wider border-b border-[#aaa] pb-0.5 mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>Experience</div>
              {sortedExperiences.map(exp => (
                <div key={exp.id} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[12px] font-bold" style={{ fontFamily: 'Arial, sans-serif' }}>{exp.company}</span>
                    <span className="text-[10px] text-[#555]" style={{ fontFamily: 'Arial, sans-serif' }}>{range(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                  </div>
                  <div className="text-[11px] italic text-[#333]">{exp.role}{exp.location ? ` · ${exp.location}` : ""}</div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[10.5px] text-[#333] leading-relaxed">
                      {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {config.sections.education && sortedEducations.length > 0 && (
            <div className="mb-2">
              <div className="text-[12px] font-bold uppercase tracking-wider border-b border-[#aaa] pb-0.5 mb-2.5" style={{ fontFamily: 'Arial, sans-serif' }}>Education</div>
              {sortedEducations.map(edu => (
                <div key={edu.id} className="mb-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[12px] font-bold" style={{ fontFamily: 'Arial, sans-serif' }}>{edu.school}</span>
                    <span className="text-[10px] text-[#555]">{range(edu.startDate, edu.endDate, edu.isCurrent)}</span>
                  </div>
                  <div className="text-[11px] italic text-[#444]">
                    {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(", ")}
                    {edu.score && ` (${edu.scoreType || "CGPA"}: ${edu.score})`}
                  </div>
                </div>
              ))}
            </div>
          )}

          {config.sections.skills && profileSkills.length > 0 && (
            <div className="mb-2">
              <div className="text-[12px] font-bold uppercase tracking-wider border-b border-[#aaa] pb-0.5 mb-1.5" style={{ fontFamily: 'Arial, sans-serif' }}>Technical Skills</div>
              {profileSkills.map(group => (
                <div key={group.id} className="text-[11px] mb-0.5">
                  <strong style={{ fontFamily: 'Arial, sans-serif' }}>{group.category}:</strong> <span className="text-[#444]">{group.skills.join(", ")}</span>
                </div>
              ))}
            </div>
          )}

          {config.sections.projects && sortedProjects.length > 0 && (
            <div className="mb-2">
              <div className="text-[12px] font-bold uppercase tracking-wider border-b border-[#aaa] pb-0.5 mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>Projects</div>
              {sortedProjects.map(proj => (
                <div key={proj.id} className="mb-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[12px] font-bold" style={{ fontFamily: 'Arial, sans-serif' }}>{proj.title}</span>
                    {proj.techTags && <span className="text-[10px] text-[#555]" style={{ fontFamily: 'Arial, sans-serif' }}>{proj.techTags.slice(0, 3).join(" · ")}</span>}
                  </div>
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[10.5px] text-[#333] leading-relaxed">
                      {proj.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {config.sections.achievements && sortedAchievements.length > 0 && (
            <div className="mb-2">
              <div className="text-[12px] font-bold uppercase tracking-wider border-b border-[#aaa] pb-0.5 mb-1.5" style={{ fontFamily: 'Arial, sans-serif' }}>Achievements</div>
              {sortedAchievements.map(ach => (
                <div key={ach.id} className="flex justify-between items-baseline mb-1">
                  <span className="text-[11px] font-bold" style={{ fontFamily: 'Arial, sans-serif' }}>{ach.title}{ach.provider ? ` · ${ach.provider}` : ""}</span>
                  <span className="text-[10px] text-[#555]">{ach.date ? new Date(ach.date).getFullYear() : ""}</span>
                </div>
              ))}
            </div>
          )}

          {config.sections.customSections && sortedCustomSections.length > 0 && (
            <div className="mb-2">
              {sortedCustomSections.map(section => (
                <div key={section.id} className="mb-3">
                  <div className="text-[12px] font-bold uppercase tracking-wider border-b border-[#aaa] pb-0.5 mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>{section.title}</div>
                  <ul className="list-disc pl-4 space-y-0.5 text-[10.5px] text-[#333] leading-relaxed">
                    {section.bullets.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* -------------------- ENHANCV TEMPLATE (two-column colored) -------------------- */}
      {templateType === "ENHANCV" && (
        <div className="absolute inset-0 flex text-black bg-white overflow-y-auto custom-scrollbar" style={stylingMap}>
          {/* Left */}
          <div className="flex-none bg-white p-6 border-r border-[#e5e7eb]" style={{ width: '62%' }}>
            <h1 className="text-3xl font-black text-[#0f172a] leading-tight tracking-tight">{profile?.displayName || user?.fullName || "Your Name"}</h1>
            <div className="h-[3px] w-full mb-3 rounded" style={{ background: `linear-gradient(to right, ${primaryColor}, transparent)` }} />

            {config.sections.summary && profile?.bio && (
              <div className="mb-3">
                <div className="text-[9px] font-black uppercase tracking-wide text-[#0f172a] border-b-2 pb-1 mb-2" style={{ borderColor: primaryColor }}>Summary</div>
                <div className="text-[9px] text-[#475569] leading-relaxed">{profile.bio}</div>
              </div>
            )}

            {config.sections.experience && sortedExperiences.length > 0 && (
              <div className="mb-3">
                <div className="text-[9px] font-black uppercase tracking-wide text-[#0f172a] border-b-2 pb-1 mb-2" style={{ borderColor: primaryColor }}>Experience</div>
                {sortedExperiences.map(exp => (
                  <div key={exp.id} className="mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[10.5px] font-bold text-[#0f172a]">{exp.role}</div>
                        <div className="text-[9px] font-semibold mt-0.5" style={{ color: primaryColor }}>{exp.company}</div>
                      </div>
                      <div className="text-[8.5px] text-[#64748b] whitespace-nowrap">{range(exp.startDate, exp.endDate, exp.isCurrent)}</div>
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc pl-3 mt-1 space-y-0.5 text-[9px] text-[#374151]">
                        {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {config.sections.projects && sortedProjects.length > 0 && (
              <div className="mb-3">
                <div className="text-[9px] font-black uppercase tracking-wide text-[#0f172a] border-b-2 pb-1 mb-2" style={{ borderColor: primaryColor }}>Projects</div>
                {sortedProjects.map(proj => (
                  <div key={proj.id} className="mb-3">
                    <div className="text-[10.5px] font-bold text-[#0f172a]">{proj.title}</div>
                    {proj.techTags && proj.techTags.length > 0 && (
                      <div className="text-[8.5px] font-semibold mt-0.5" style={{ color: primaryColor }}>{proj.techTags.slice(0, 3).join(" · ")}</div>
                    )}
                    {proj.bullets && proj.bullets.length > 0 && (
                      <ul className="list-disc pl-3 mt-1 space-y-0.5 text-[8.5px] text-[#374151]">
                        {proj.bullets.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right */}
          <div className="flex-1 bg-[#f9fafb] p-5">
            <div className="mb-3">
              <div className="text-[9px] font-black uppercase tracking-wide text-[#0f172a] border-b-2 pb-1 mb-2" style={{ borderColor: primaryColor }}>Contact</div>
              <div className="text-[8.5px] text-[#374151] mb-1 break-all">✉ {user?.email}</div>
              {profile?.phoneNumber && <div className="text-[8.5px] text-[#374151] mb-1">📞 {profile.phoneNumber}</div>}
              {links.filter(l => l.visibleInDefault).map(link => (
                <div key={link.id} className="text-[8.5px] text-[#374151] mb-1 break-all">
                  ↗ {link.platform.replace(/_/g, " ")}: {cleanUrl(link.url)}
                </div>
              ))}
            </div>

            {config.sections.skills && profileSkills.length > 0 && (
              <div className="mb-3">
                <div className="text-[9px] font-black uppercase tracking-wide text-[#0f172a] border-b-2 pb-1 mb-2" style={{ borderColor: primaryColor }}>Skills</div>
                {profileSkills.map(group => (
                  <div key={group.id} className="mb-2">
                    <div className="text-[7.5px] font-bold text-[#64748b] uppercase mb-1">{group.category}</div>
                    <div className="flex flex-wrap gap-1">
                      {group.skills.map(n => <span key={n} className="text-[7.5px] font-semibold bg-[#e0e7ff] text-[#1e3a8a] px-1.5 py-0.5 rounded">{n}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {config.sections.education && sortedEducations.length > 0 && (
              <div className="mb-3">
                <div className="text-[9px] font-black uppercase tracking-wide text-[#0f172a] border-b-2 pb-1 mb-2" style={{ borderColor: primaryColor }}>Education</div>
                {sortedEducations.map(edu => (
                  <div key={edu.id} className="mb-2">
                    <div className="text-[9px] font-bold text-[#0f172a]">{edu.school}</div>
                    <div className="text-[8px] text-[#374151]">{[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}</div>
                    <div className="text-[7.5px] italic text-[#64748b]">{range(edu.startDate, edu.endDate, edu.isCurrent)}</div>
                    {edu.score && (
                      <div className="text-[8px] text-[#374151] font-semibold">
                        {edu.scoreType || "CGPA"}: {edu.score}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {config.sections.achievements && sortedAchievements.length > 0 && (
              <div className="mb-3">
                <div className="text-[9px] font-black uppercase tracking-wide text-[#0f172a] border-b-2 pb-1 mb-2" style={{ borderColor: primaryColor }}>Achievements</div>
                {sortedAchievements.map(ach => (
                  <div key={ach.id} className="mb-1.5">
                    <div className="text-[9px] font-bold text-[#0f172a]">{ach.title}</div>
                    {ach.provider && <div className="text-[8px] text-[#374151]">{ach.provider}</div>}
                    {ach.date && <div className="text-[7.5px] italic text-[#64748b]">{new Date(ach.date).getFullYear()}</div>}
                  </div>
                ))}
              </div>
            )}

            {config.sections.customSections && sortedCustomSections.length > 0 && (
              <div>
                {sortedCustomSections.map(section => (
                  <div key={section.id} className="mb-3">
                    <div className="text-[9px] font-black uppercase tracking-wide text-[#0f172a] border-b-2 pb-1 mb-2" style={{ borderColor: primaryColor }}>{section.title}</div>
                    <ul className="list-disc pl-3 space-y-0.5 text-[8px] text-[#374151]">
                      {section.bullets.map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
