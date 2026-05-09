"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";
import { useExperienceStore } from "@/store/useExperienceStore";
import { useEducationStore } from "@/store/useEducationStore";
import { useSocialStore } from "@/store/useSocialStore";
import { useAuthStore } from "@/store/useAuthStore";

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

export function ResumeLivePreview({ templateType }: ResumeLivePreviewProps) {
  const { profile, isLoading: isProfileLoading } = useProfileStore();
  const { experiences, fetchExperiences, isLoading: isExpLoading } = useExperienceStore();
  const { educations, fetchEducations, isLoading: isEduLoading } = useEducationStore();
  const { links, fetchLinks, isLoading: isSocialsLoading } = useSocialStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchExperiences();
    fetchEducations();
    fetchLinks();
  }, [fetchExperiences, fetchEducations, fetchLinks]);

  const isLoading = isProfileLoading || isExpLoading || isEduLoading || isSocialsLoading;

  if (isLoading && (!profile || experiences.length === 0)) {
    return (
      <div className="flex items-center justify-center bg-white border shadow-sm mx-auto" style={{ width: '100%', maxWidth: '794px', aspectRatio: '8.5 / 11' }}>
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const sortedExperiences = [...experiences].sort((a, b) => a.displayOrder - b.displayOrder);
  const sortedEducations = [...educations].sort((a, b) => a.displayOrder - b.displayOrder);
  const techStacks = profile?.techStacks || [];
  const primaryColor = THEME_COLOR_MAP[user?.selectedTheme || "MINIMAL"] || "#111111";

  // Shared formatting functions
  const cleanUrl = (url: string) => url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
  const range = (start: Date | string, end: Date | string | null, isCurrent: boolean) => {
    const startText = new Date(start).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    const endText = isCurrent || !end ? "Present" : new Date(end).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    return `${startText} - ${endText}`;
  };

  // Grouped Skills for both templates
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
  techStacks.forEach((ps) => {
    const label = categoryLabels[ps.tech.category] || categoryLabels.OTHER;
    if (!groupedSkills[label]) groupedSkills[label] = [];
    groupedSkills[label].push(ps.tech.name);
  });

  return (
    <div className="resume-preview-container overflow-hidden rounded-xl border shadow-2xl bg-white mx-auto relative" style={{ width: '100%', maxWidth: '794px', aspectRatio: '8.5 / 11' }}>
      
      {/* -------------------- DESIGN TEMPLATE (2-COLUMN) -------------------- */}
      {templateType === "DESIGN" && (
        <div className="absolute inset-0 flex text-black bg-white overflow-hidden" style={{ fontSize: '10px', fontFamily: 'Arial, sans-serif' }}>
          
          {/* Sidebar */}
          <div className="flex-none bg-[#0f172a] text-[#e2e8f0] p-6" style={{ width: '32%' }}>
            <h1 className="text-xl font-black text-white leading-tight tracking-tight mb-1">{profile?.displayName || user?.fullName || "Your Name"}</h1>
            <div className="text-[9px] font-bold uppercase tracking-wider mb-6 pb-4 border-b border-[#1e3a5f] text-[#38bdf8]">
              {profile?.headline || "Professional Title"}
            </div>

            <div className="text-[9px] font-bold uppercase tracking-widest text-[#64748b] mt-4 mb-2">Contact</div>
            <div className="text-[9px] font-semibold text-[#94a3b8] mb-0.5">Email</div>
            <div className="text-[9px] mb-3 truncate text-[#38bdf8]">{user?.email}</div>
            
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

            {sortedEducations.length > 0 && (
              <>
                <div className="text-[9px] font-bold uppercase tracking-widest text-[#64748b] mt-5 mb-2">Education</div>
                {sortedEducations.map(edu => (
                  <div key={edu.id} className="mb-3">
                    <div className="text-[9px] font-semibold text-[#94a3b8] mb-0.5">{edu.school}</div>
                    <div className="text-[9.5px] text-[#e2e8f0] mb-1">{[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}</div>
                    <div className="text-[8.5px] italic text-[#475569]">{range(edu.startDate, edu.endDate, edu.isCurrent)}</div>
                  </div>
                ))}
              </>
            )}

            {Object.keys(groupedSkills).length > 0 && (
              <>
                <div className="text-[9px] font-bold uppercase tracking-widest text-[#64748b] mt-5 mb-2">Skills</div>
                {Object.entries(groupedSkills).map(([label, names]) => (
                  <div key={label} className="mb-3">
                    <div className="text-[9px] font-semibold text-[#94a3b8] mb-0.5">{label}</div>
                    <div className="text-[9.5px] text-[#e2e8f0]">{names.join(", ")}</div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Main Area */}
          <div className="flex-1 p-8 bg-white overflow-y-auto custom-scrollbar">
            {sortedExperiences.length === 0 && profile?.bio && (
              <div className="text-[9.5px] text-[#475569] leading-relaxed mb-4 pb-3 border-b-2 border-[#f1f5f9]">
                {profile.bio}
              </div>
            )}

            {sortedExperiences.length > 0 && (
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
            
            {/* Note: Projects & Achievements omitted for brevity in preview, but would follow the exact same structure */}
            <div className="mt-6 text-center text-gray-400 italic text-[9px] border-t pt-4">
              (Projects & Achievements not fully rendered in this miniature preview)
            </div>
          </div>
        </div>
      )}

      {/* -------------------- ATS TEMPLATE (1-COLUMN) -------------------- */}
      {templateType === "ATS" && (
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col gap-3 text-[#111] bg-white overflow-y-auto custom-scrollbar" style={{ fontSize: '10px', fontFamily: 'Arial, sans-serif' }}>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight mb-1">{profile?.displayName || user?.fullName || "Your Name"}</h1>
            <div className="text-[10px] text-[#333] flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
              <span>{user?.email}</span>
              {links.filter(l => l.visibleInDefault).map(link => (
                <span key={link.id}> | {link.platform.replace(/_/g, " ")}: {cleanUrl(link.url)}</span>
              ))}
            </div>
          </div>
          
          <div className="h-[1px] bg-[#ddd] my-1"></div>

          {sortedExperiences.length === 0 && profile?.bio && (
            <div className="mb-2">
              <div className="text-[11px] font-bold uppercase tracking-wide border-b border-[#eee] pb-0.5 mb-1.5">Professional Summary</div>
              <div className="text-[10px] text-[#444] leading-relaxed">{profile.bio}</div>
            </div>
          )}

          {sortedExperiences.length > 0 && (
            <div className="mb-2">
              <div className="text-[11px] font-bold uppercase tracking-wide border-b border-[#eee] pb-0.5 mb-2">Experience</div>
              {sortedExperiences.map((exp) => (
                <div key={exp.id} className="mb-2">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <div className="text-[11px] font-bold">{exp.role}</div>
                    <div className="text-[10px] text-[#444]">{range(exp.startDate, exp.endDate, exp.isCurrent)}</div>
                  </div>
                  <div className="text-[10px] font-medium text-[#222] mb-1">
                    {exp.company}{exp.location ? ` • ${exp.location}` : ""}
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-[#444] leading-relaxed">
                      {exp.bullets.map((bullet, i) => <li key={i}>{bullet}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {sortedEducations.length > 0 && (
            <div className="mb-2">
              <div className="text-[11px] font-bold uppercase tracking-wide border-b border-[#eee] pb-0.5 mb-2">Education</div>
              {sortedEducations.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <div className="text-[11px] font-bold">{edu.school}</div>
                    <div className="text-[10px] text-[#444]">{range(edu.startDate, edu.endDate, edu.isCurrent)}</div>
                  </div>
                  <div className="text-[10px] font-medium text-[#222]">
                    {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(", ")}
                  </div>
                </div>
              ))}
            </div>
          )}

          {Object.keys(groupedSkills).length > 0 && (
            <div className="mb-2">
              <div className="text-[11px] font-bold uppercase tracking-wide border-b border-[#eee] pb-0.5 mb-1.5">Technical Skills</div>
              {Object.entries(groupedSkills).map(([label, names]) => (
                <div key={label} className="text-[10px] mb-0.5">
                  <strong className="text-[#111]">{label}:</strong> <span className="text-[#444]">{names.join(", ")}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-2 text-center text-gray-400 italic text-[9px] border-t pt-2">
            (Projects & Achievements not fully rendered in this miniature preview)
          </div>

        </div>
      )}
      {/* -------------------- MODERN TEMPLATE (serif, clean) -------------------- */}
      {templateType === "MODERN" && (
        <div className="absolute inset-0 p-8 md:p-10 flex flex-col gap-5 text-[#1a1a1a] bg-white overflow-y-auto custom-scrollbar" style={{ fontSize: '10px', fontFamily: 'Georgia, serif' }}>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>{profile?.displayName || user?.fullName || "Your Name"}</h1>
            <div className="text-[9px] text-[#444] flex flex-wrap justify-center items-center gap-x-2">
              <span>{user?.email}</span>
              {links.filter(l => l.visibleInDefault).map(link => (
                <span key={link.id}>| {link.platform.replace(/_/g, " ")}: {cleanUrl(link.url)}</span>
              ))}
            </div>
          </div>
          <div className="border-t-2 border-[#1a1a1a] mb-2" />

          {sortedExperiences.length > 0 && (
            <div className="mb-4">
              <div className="text-[11px] font-bold uppercase tracking-wider border-b border-[#aaa] pb-0.5 mb-3" style={{ fontFamily: 'Arial, sans-serif' }}>Experience</div>
              {sortedExperiences.map(exp => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] font-bold" style={{ fontFamily: 'Arial, sans-serif' }}>{exp.company}</span>
                    <span className="text-[9px] text-[#555]" style={{ fontFamily: 'Arial, sans-serif' }}>{range(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                  </div>
                  <div className="text-[10px] italic text-[#333]">{exp.role}{exp.location ? ` · ${exp.location}` : ""}</div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[9.5px] text-[#333] leading-relaxed">
                      {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {sortedEducations.length > 0 && (
            <div className="mb-4">
              <div className="text-[11px] font-bold uppercase tracking-wider border-b border-[#aaa] pb-0.5 mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>Education</div>
              {sortedEducations.map(edu => (
                <div key={edu.id} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] font-bold" style={{ fontFamily: 'Arial, sans-serif' }}>{edu.school}</span>
                    <span className="text-[9px] text-[#555]">{range(edu.startDate, edu.endDate, edu.isCurrent)}</span>
                  </div>
                  <div className="text-[10px] italic text-[#444]">{[edu.degree, edu.fieldOfStudy].filter(Boolean).join(", ")}</div>
                </div>
              ))}
            </div>
          )}

          {Object.keys(groupedSkills).length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider border-b border-[#aaa] pb-0.5 mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>Technical Skills</div>
              {Object.entries(groupedSkills).map(([label, names]) => (
                <div key={label} className="text-[10px] mb-0.5">
                  <strong style={{ fontFamily: 'Arial, sans-serif' }}>{label}:</strong> <span className="text-[#444]">{names.join(", ")}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* -------------------- ENHANCV TEMPLATE (two-column colored) -------------------- */}
      {templateType === "ENHANCV" && (
        <div className="absolute inset-0 flex text-black bg-white overflow-hidden" style={{ fontSize: '10px', fontFamily: 'Arial, sans-serif' }}>
          {/* Left */}
          <div className="flex-none bg-white p-6 border-r border-[#e5e7eb]" style={{ width: '62%' }}>
            <h1 className="text-2xl font-black text-[#0f172a] leading-tight tracking-tight">{profile?.displayName || user?.fullName || "Your Name"}</h1>
            {profile?.headline && <div className="text-[9.5px] font-bold uppercase tracking-wider mt-1 mb-2" style={{ color: primaryColor }}>{profile.headline}</div>}
            <div className="h-[3px] w-full mb-3 rounded" style={{ background: `linear-gradient(to right, ${primaryColor}, transparent)` }} />

            {profile?.bio && (
              <div className="mb-3">
                <div className="text-[9px] font-black uppercase tracking-wide text-[#0f172a] border-b-2 pb-1 mb-2" style={{ borderColor: primaryColor }}>Summary</div>
                <div className="text-[9px] text-[#475569] leading-relaxed">{profile.bio.slice(0, 200)}...</div>
              </div>
            )}

            {sortedExperiences.length > 0 && (
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
          </div>

          {/* Right */}
          <div className="flex-1 bg-[#f9fafb] p-5">
            <div className="mb-3">
              <div className="text-[9px] font-black uppercase tracking-wide text-[#0f172a] border-b-2 pb-1 mb-2" style={{ borderColor: primaryColor }}>Contact</div>
              <div className="text-[8.5px] text-[#374151] mb-1">✉ {user?.email}</div>
              {links.filter(l => l.visibleInDefault).map(link => (
                <div key={link.id} className="text-[8.5px] text-[#374151] mb-1">
                  ↗ {link.platform.replace(/_/g, " ")}: {cleanUrl(link.url)}
                </div>
              ))}
            </div>

            {Object.keys(groupedSkills).length > 0 && (
              <div className="mb-3">
                <div className="text-[9px] font-black uppercase tracking-wide text-[#0f172a] border-b-2 pb-1 mb-2" style={{ borderColor: primaryColor }}>Skills</div>
                {Object.entries(groupedSkills).map(([label, names]) => (
                  <div key={label} className="mb-2">
                    <div className="text-[7.5px] font-bold text-[#64748b] uppercase mb-1">{label}</div>
                    <div className="flex flex-wrap gap-1">
                      {names.map(n => <span key={n} className="text-[7.5px] font-semibold bg-[#e0e7ff] text-[#1e3a8a] px-1.5 py-0.5 rounded">{n}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sortedEducations.length > 0 && (
              <div>
                <div className="text-[9px] font-black uppercase tracking-wide text-[#0f172a] border-b-2 pb-1 mb-2" style={{ borderColor: primaryColor }}>Education</div>
                {sortedEducations.map(edu => (
                  <div key={edu.id} className="mb-2">
                    <div className="text-[9px] font-bold text-[#0f172a]">{edu.school}</div>
                    <div className="text-[8px] text-[#374151]">{[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}</div>
                    <div className="text-[7.5px] italic text-[#64748b]">{range(edu.startDate, edu.endDate, edu.isCurrent)}</div>
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
