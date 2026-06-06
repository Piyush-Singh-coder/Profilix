"use client";

import { IdentityEditor } from "@/components/dashboard/editor/IdentityEditor";
import { ExperienceEditor } from "@/components/dashboard/editor/ExperienceEditor";
import { EducationEditor } from "@/components/dashboard/editor/EducationEditor";
import { SkillsEditor } from "@/components/dashboard/editor/SkillsEditor";
import { ProjectsEditor } from "@/components/dashboard/editor/ProjectsEditor";
import { AchievementsEditor } from "@/components/dashboard/editor/AchievementsEditor";
import { CustomSectionEditor } from "@/components/dashboard/editor/CustomSectionEditor";
import { SocialsEditor } from "@/components/dashboard/editor/SocialsEditor";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ResumeParserCard } from "@/components/dashboard/ResumeParserCard";
import { User } from "lucide-react";

export default function UnifiedProfileEditorPage() {
  return (
    <div className="animate-in pb-24">
      <DashboardHeader 
        title="Profile Editor"
        subtitle="Manage your entire professional brand from a single, unified interface. Your updates are reflected instantly across your profile card and resume."
        badge="Unified Workspace"
        icon={User}
      />

      <div className="flex flex-col gap-6">
        <ResumeParserCard />
        
        <section id="identity">
          <IdentityEditor />
        </section>
        
        <section id="experience">
          <ExperienceEditor />
        </section>

        <section id="education">
          <EducationEditor />
        </section>

        <section id="skills">
          <SkillsEditor />
        </section>

        <section id="projects">
          <ProjectsEditor />
        </section>

        <section id="achievements">
          <AchievementsEditor />
        </section>

        <section id="custom-sections">
          <CustomSectionEditor />
        </section>

        <section id="socials">
          <SocialsEditor />
        </section>
      </div>
    </div>
  );
}
