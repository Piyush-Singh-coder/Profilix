"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Download, FileText, Loader2, Layout, BookOpen, Columns, PenTool, Edit3, Settings, Eye, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import { useResumeStore } from "@/store/useResumeStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useExperienceStore } from "@/store/useExperienceStore";
import { useEducationStore } from "@/store/useEducationStore";
import { cn } from "@/lib/utils";
import { ResumeLivePreview } from "@/components/dashboard/ResumeLivePreview";

type WizardStep = "TEMPLATE" | "CUSTOMIZE" | "DOWNLOAD";

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

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function ResumePage() {
  const { isGenerating, generateResume } = useResumeStore();
  const { user } = useAuthStore();
  const { profile, fetchProfile, updateProfile } = useProfileStore();
  const { experiences, fetchExperiences } = useExperienceStore();
  const { educations, fetchEducations } = useEducationStore();
  
  const [activeStep, setActiveStep] = useState<WizardStep>("TEMPLATE");
  const [jobDescription, setJobDescription] = useState("");
  const [useAI, setUseAI] = useState(false);
  const [format, setFormat] = useState<"pdf" | "docx">("pdf");
  const [templateType, setTemplateType] = useState<"ATS" | "DESIGN" | "MODERN" | "ENHANCV">("ATS");
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  
  const [localConfig, setLocalConfig] = useState<ResumeConfig | null>(null);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Ref to the preview wrapper — used to compute exact CSS scale for the A4 sheet
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.41);

  // Whenever the modal opens, measure the real container width and derive scale
  useEffect(() => {
    if (mobilePreviewOpen && previewWrapperRef.current) {
      const w = previewWrapperRef.current.offsetWidth;
      setPreviewScale(w / 794);
    }
  }, [mobilePreviewOpen]);

  useEffect(() => {
    fetchProfile();
    fetchExperiences();
    fetchEducations();
  }, [fetchProfile, fetchExperiences, fetchEducations]);

  useEffect(() => {
    if (profile) {
      setLocalConfig(parseResumeConfig(profile));
    }
  }, [profile]);

  const updateLocalConfig = (updater: (prev: ResumeConfig) => ResumeConfig) => {
    const current = localConfig || parseResumeConfig(profile);
    const next = updater(current);
    setLocalConfig(next);

    // Sync to useProfileStore state to update preview instantly
    useProfileStore.setState((storeState) => {
      if (!storeState.profile) return storeState;
      return {
        profile: {
          ...storeState.profile,
          resumeConfig: next,
        },
      };
    });
  };

  const handleSaveConfig = async () => {
    if (!localConfig) return;
    try {
      setIsSavingConfig(true);
      await updateProfile({
        resumeConfig: localConfig
      });
      toast.success("Resume styling and layout saved");
    } catch {
      toast.error("Failed to save configuration");
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleGenerate = async () => {
    try {
      await generateResume({
        format,
        templateType,
        activeTheme: user?.selectedTheme,
        jobDescription: jobDescription.trim() || undefined,
        useAI: useAI && Boolean(jobDescription.trim()),
      });
      toast.success(`Generated ${format.toUpperCase()}`);
    } catch {
      toast.error("Failed to generate resume");
    }
  };

  return (
    <div className="animate-in pb-24">
      <DashboardHeader 
        title="Resume Builder"
        subtitle="Live preview and generate your tailored professional resume. Use AI to optimize your bullet points for specific job descriptions."
        badge="Smart Export"
        icon={FileText}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] xl:grid-cols-[500px_1fr] gap-8 items-start">
        {/* Left Column: Wizard Controls */}
        <div className="space-y-6">
          {/* Wizard Steps Navigation */}
          <div className="flex items-center justify-between bg-surface-low border border-border p-2 rounded-xl">
            <button
              onClick={() => setActiveStep("TEMPLATE")}
              className={cn("flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-colors", activeStep === "TEMPLATE" ? "bg-primary text-white shadow-md" : "text-text-secondary hover:bg-surface-high")}
            >
              <Layout className="h-4 w-4" /> Template
            </button>
            <button
              onClick={() => setActiveStep("CUSTOMIZE")}
              className={cn("flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-colors", activeStep === "CUSTOMIZE" ? "bg-primary text-white shadow-md" : "text-text-secondary hover:bg-surface-high")}
            >
              <Settings className="h-4 w-4" /> Customise
            </button>
            <button
              onClick={() => setActiveStep("DOWNLOAD")}
              className={cn("flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-colors", activeStep === "DOWNLOAD" ? "bg-primary text-white shadow-md" : "text-text-secondary hover:bg-surface-high")}
            >
              <Download className="h-4 w-4" /> Download
            </button>
          </div>

          {/* Step 1: Template */}
          {activeStep === "TEMPLATE" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <Card variant="glass" className="border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader>
                  <CardTitle className="text-xl">Resume Templates</CardTitle>
                  <CardDescription>Select a layout and file format for your resume.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-3">
                    {/* ATS */}
                    <button
                      type="button"
                      onClick={() => setTemplateType("ATS")}
                      className={cn(
                        "relative flex flex-col items-center gap-2 rounded-xl border-2 py-5 px-3 text-center transition-all",
                        templateType === "ATS"
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border bg-surface-low hover:border-primary/40"
                      )}
                    >
                      <div className="rounded-lg bg-surface-high p-3 text-text-primary shadow-sm">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary text-sm">ATS Friendly</h3>
                        <p className="mt-0.5 text-xs text-text-secondary">Clean single-column</p>
                      </div>
                      {templateType === "ATS" && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />}
                    </button>

                    {/* DESIGN – dark sidebar */}
                    <button
                      type="button"
                      onClick={() => { if (format === "pdf") setTemplateType("DESIGN"); }}
                      disabled={format === "docx"}
                      className={cn(
                        "relative flex flex-col items-center gap-2 rounded-xl border-2 py-5 px-3 text-center transition-all",
                        templateType === "DESIGN" ? "border-primary bg-primary/5 shadow-md" : "border-border bg-surface-low hover:border-primary/40",
                        format === "docx" && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="rounded-lg bg-surface-high p-3 text-text-primary shadow-sm">
                        <Layout className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary text-sm">Premium Dark</h3>
                        <p className="mt-0.5 text-xs text-text-secondary">Dark sidebar design</p>
                      </div>
                      {templateType === "DESIGN" && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />}
                    </button>

                    {/* MODERN – serif classic */}
                    <button
                      type="button"
                      onClick={() => setTemplateType("MODERN")}
                      className={cn(
                        "relative flex flex-col items-center gap-2 rounded-xl border-2 py-5 px-3 text-center transition-all",
                        templateType === "MODERN" ? "border-primary bg-primary/5 shadow-md" : "border-border bg-surface-low hover:border-primary/40"
                      )}
                    >
                      <div className="rounded-lg bg-surface-high p-3 text-text-primary shadow-sm">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary text-sm">Modern Classic</h3>
                        <p className="mt-0.5 text-xs text-text-secondary">Serif · PDF & DOCX</p>
                      </div>
                      {templateType === "MODERN" && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />}
                    </button>

                    {/* ENHANCV – two-col colored */}
                    <button
                      type="button"
                      onClick={() => { if (format === "pdf") setTemplateType("ENHANCV"); }}
                      disabled={format === "docx"}
                      className={cn(
                        "relative flex flex-col items-center gap-2 rounded-xl border-2 py-5 px-3 text-center transition-all",
                        templateType === "ENHANCV" ? "border-primary bg-primary/5 shadow-md" : "border-border bg-surface-low hover:border-primary/40",
                        format === "docx" && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="rounded-lg bg-surface-high p-3 text-text-primary shadow-sm">
                        <Columns className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary text-sm">Premium Two-Col</h3>
                        <p className="mt-0.5 text-xs text-text-secondary">Accent · chip skills</p>
                      </div>
                      {templateType === "ENHANCV" && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />}
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-text-primary">File Format</label>
                    <Select
                      value={format}
                      onChange={(value) => {
                        const nextFormat = value as "pdf" | "docx";
                        setFormat(nextFormat);
                        // DESIGN and ENHANCV are PDF-only; reset to ATS if switching to docx
                        if (nextFormat === "docx" && (templateType === "DESIGN" || templateType === "ENHANCV")) {
                          setTemplateType("ATS");
                        }
                      }}
                      options={[
                        { value: "pdf", label: "PDF Document (.pdf)" },
                        { value: "docx", label: "Word Document (.docx)" },
                      ]}
                    />
                    {format === "docx" && (
                      <p className="text-xs text-danger">Premium Dark and Two-Col templates are PDF only.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={() => setActiveStep("CUSTOMIZE")} className="shadow-lg shadow-primary/20">
                  Next: Customise Layout
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Customise */}
          {activeStep === "CUSTOMIZE" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              {/* Section Visibility Switches */}
              <Card variant="glass" className="border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader>
                  <CardTitle className="text-xl">Layout Sections</CardTitle>
                  <CardDescription>Configure which sections to display on your resume.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <Switch
                      label="Show Professional Summary"
                      checked={localConfig?.sections.summary ?? true}
                      onCheckedChange={(val) => updateLocalConfig(prev => ({
                        ...prev,
                        sections: { ...prev.sections, summary: val }
                      }))}
                    />
                    <Switch
                      label="Show Work Experience"
                      checked={localConfig?.sections.experience ?? true}
                      onCheckedChange={(val) => updateLocalConfig(prev => ({
                        ...prev,
                        sections: { ...prev.sections, experience: val }
                      }))}
                    />
                    <Switch
                      label="Show Education History"
                      checked={localConfig?.sections.education ?? true}
                      onCheckedChange={(val) => updateLocalConfig(prev => ({
                        ...prev,
                        sections: { ...prev.sections, education: val }
                      }))}
                    />
                    <Switch
                      label="Show Technical Skills"
                      checked={localConfig?.sections.skills ?? true}
                      onCheckedChange={(val) => updateLocalConfig(prev => ({
                        ...prev,
                        sections: { ...prev.sections, skills: val }
                      }))}
                    />
                    <Switch
                      label="Show Projects"
                      checked={localConfig?.sections.projects ?? true}
                      onCheckedChange={(val) => updateLocalConfig(prev => ({
                        ...prev,
                        sections: { ...prev.sections, projects: val }
                      }))}
                    />
                    <Switch
                      label="Show Achievements"
                      checked={localConfig?.sections.achievements ?? true}
                      onCheckedChange={(val) => updateLocalConfig(prev => ({
                        ...prev,
                        sections: { ...prev.sections, achievements: val }
                      }))}
                    />
                    <Switch
                      label="Show Custom Sections"
                      checked={localConfig?.sections.customSections ?? true}
                      onCheckedChange={(val) => updateLocalConfig(prev => ({
                        ...prev,
                        sections: { ...prev.sections, customSections: val }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Rendering Limits */}
              <Card variant="surface" className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Content Limits</CardTitle>
                  <CardDescription>Control the maximum number of items shown for each section.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <Select
                    label="Max Experiences"
                    value={String(localConfig?.limits.experiences ?? 5)}
                    onChange={(val) => updateLocalConfig(prev => ({
                      ...prev,
                      limits: { ...prev.limits, experiences: Number(val) }
                    }))}
                    options={[
                      { value: "1", label: "1 Item" },
                      { value: "2", label: "2 Items" },
                      { value: "3", label: "3 Items" },
                      { value: "4", label: "4 Items" },
                      { value: "5", label: "5 Items" },
                      { value: "10", label: "10 Items (All)" },
                    ]}
                  />
                  <Select
                    label="Max Educations"
                    value={String(localConfig?.limits.educations ?? 3)}
                    onChange={(val) => updateLocalConfig(prev => ({
                      ...prev,
                      limits: { ...prev.limits, educations: Number(val) }
                    }))}
                    options={[
                      { value: "1", label: "1 Item" },
                      { value: "2", label: "2 Items" },
                      { value: "3", label: "3 Items" },
                      { value: "4", label: "4 Items" },
                      { value: "5", label: "5 Items" },
                    ]}
                  />
                  <Select
                    label="Max Projects"
                    value={String(localConfig?.limits.projects ?? 3)}
                    onChange={(val) => updateLocalConfig(prev => ({
                      ...prev,
                      limits: { ...prev.limits, projects: Number(val) }
                    }))}
                    options={[
                      { value: "1", label: "1 Item" },
                      { value: "2", label: "2 Items" },
                      { value: "3", label: "3 Items" },
                      { value: "4", label: "4 Items" },
                      { value: "5", label: "5 Items" },
                    ]}
                  />
                  <Select
                    label="Max Achievements"
                    value={String(localConfig?.limits.achievements ?? 5)}
                    onChange={(val) => updateLocalConfig(prev => ({
                      ...prev,
                      limits: { ...prev.limits, achievements: Number(val) }
                    }))}
                    options={[
                      { value: "1", label: "1 Item" },
                      { value: "2", label: "2 Items" },
                      { value: "3", label: "3 Items" },
                      { value: "4", label: "4 Items" },
                      { value: "5", label: "5 Items" },
                      { value: "10", label: "10 Items" },
                    ]}
                  />
                </CardContent>
              </Card>

              {/* Styling Selectors */}
              <Card variant="glass" className="border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader>
                  <CardTitle className="text-xl">Typography & Styling</CardTitle>
                  <CardDescription>Select typography settings for the final generated output.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <Select
                    label="Font Family"
                    value={localConfig?.styling.fontFamily || "Arial"}
                    onChange={(val) => updateLocalConfig(prev => ({
                      ...prev,
                      styling: { ...prev.styling, fontFamily: val }
                    }))}
                    options={[
                      { value: "Arial", label: "Arial (Sans-serif)" },
                      { value: "Helvetica", label: "Helvetica (Sans-serif)" },
                      { value: "Calibri", label: "Calibri (Sans-serif)" },
                      { value: "Times New Roman", label: "Times New Roman (Serif)" },
                      { value: "Georgia", label: "Georgia (Serif)" },
                      { value: "Inter", label: "Inter (Premium)" },
                      { value: "Roboto", label: "Roboto (Classic)" },
                      { value: "Outfit", label: "Outfit (Modern)" },
                    ]}
                  />
                  <Select
                    label="Font Size"
                    value={localConfig?.styling.fontSize || "9.5pt"}
                    onChange={(val) => updateLocalConfig(prev => ({
                      ...prev,
                      styling: { ...prev.styling, fontSize: val }
                    }))}
                    options={[
                      { value: "9pt", label: "9pt (Compact)" },
                      { value: "9.5pt", label: "9.5pt (Standard)" },
                      { value: "10pt", label: "10pt (Clean)" },
                      { value: "11pt", label: "11pt (Readable)" },
                      { value: "12pt", label: "12pt (Large)" },
                    ]}
                  />
                </CardContent>
              </Card>

              {/* Save layout changes */}
              <div className="flex items-center justify-between gap-3">
                <Button variant="outline" onClick={() => setActiveStep("TEMPLATE")}>
                  Back: Templates
                </Button>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleSaveConfig}
                    isLoading={isSavingConfig}
                    variant="outline"
                  >
                    Save Styling
                  </Button>
                  <Button onClick={() => setActiveStep("DOWNLOAD")} className="shadow-lg shadow-primary/20">
                    Next: Download
                  </Button>
                </div>
              </div>
            </div>
          ) }

          {/* Step 3: Download (Includes AI Tailoring) */}
          {activeStep === "DOWNLOAD" && (
            <Card variant="glass" className="border-primary/20 shadow-lg shadow-primary/5">
              <CardHeader>
                <CardTitle className="text-xl">Export Options</CardTitle>
                <CardDescription>Tailor for a specific job before downloading.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-xl border border-border bg-surface-low p-4">
                  <div className="mb-4">
                    <Switch 
                      checked={useAI} 
                      onCheckedChange={setUseAI} 
                      label="Enable AI Tailoring" 
                    />
                    <p className="text-xs text-text-secondary mt-2 pl-12">
                      Automatically re-write your bullet points to match the job description.
                    </p>
                  </div>
                  
                  {useAI && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                      <Textarea
                        label="Job Description"
                        value={jobDescription}
                        onChange={(event) => setJobDescription(event.target.value)}
                        rows={6}
                        placeholder="Paste the target job description here..."
                      />
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleGenerate} 
                  isLoading={isGenerating} 
                  className="w-full min-h-[3.5rem] py-3 text-lg shadow-xl shadow-primary/20"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download {templateType === "ATS" ? "ATS" : templateType === "DESIGN" ? "Premium Dark" : templateType === "MODERN" ? "Modern" : "Premium Two-Col"} Resume
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Live Preview — desktop only */}
        <div className="hidden lg:block sticky top-8">
          <div className="rounded-2xl border border-border bg-surface-low p-6 shadow-xl relative">
            <div className="absolute top-0 right-0 p-3 flex gap-2 z-10">
              <span className="flex h-6 items-center rounded-full bg-primary/20 px-2.5 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                Live Preview
              </span>
            </div>
            <ResumeLivePreview templateType={templateType} />
            <p className="text-center text-xs text-text-secondary mt-6">
              This preview illustrates the layout and content hierarchy. The final export is dynamically optimized to fit a standard one-page format for maximum recruiter impact.
            </p>
          </div>
        </div>
      </div>

      {/* ── Mobile: inline preview button (below wizard, no overlap) ── */}
      <div className="mt-4 lg:hidden">
        <button
          onClick={() => setMobilePreviewOpen(true)}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-5 py-3 text-sm font-bold text-primary hover:bg-primary/20 active:scale-[0.98] transition-all"
        >
          <Eye className="h-4 w-4" />
          Preview Resume
        </button>
      </div>

      {/* ── Mobile: Full-screen preview bottom-sheet ── */}
      {mobilePreviewOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-background lg:hidden">
          {/* Header bar */}
          <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 shrink-0">
            <div>
              <p className="font-bold text-text-primary text-sm">Resume Preview</p>
              <p className="text-[10px] text-text-secondary">
                {templateType === "ATS" ? "ATS Friendly" : templateType === "DESIGN" ? "Premium Dark" : templateType === "MODERN" ? "Modern Classic" : "Premium Two-Col"} &middot; {format.toUpperCase()}
              </p>
            </div>
            <button
              onClick={() => setMobilePreviewOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-high border border-border text-text-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Scrollable preview area — perfectly centered */}
          <div className="flex-1 overflow-y-auto bg-zinc-100 dark:bg-zinc-950">
            <div className="min-h-full flex flex-col items-center justify-center p-6 sm:p-10">
              {/* Preview Card */}
              <div ref={previewWrapperRef} className="w-full max-w-[500px]">
                <div
                  className="overflow-hidden rounded-xl shadow-2xl border border-black/10 bg-white mx-auto"
                  style={{ width: '100%', height: `${Math.round(1123 * previewScale)}px` }}
                >
                  <div style={{
                    width: '794px',
                    height: '1123px',
                    transformOrigin: 'top left',
                    transform: `scale(${previewScale})`,
                  }}>
                    <ResumeLivePreview templateType={templateType} />
                  </div>
                </div>
              </div>
              
              {/* Note Section */}
              <div className="mt-8 text-center space-y-3 max-w-[420px]">
                <p className="text-[12px] font-semibold text-text-primary px-2">
                  💡 Masterful Arrangement: This preview illustrates the layout and content hierarchy. 
                  The final export is dynamically optimized to fit a standard one-page format for maximum recruiter impact.
                </p>
                <p className="text-[10px] text-text-secondary opacity-80">
                  Premium styles, full sidebars, and high-fidelity colors are automatically applied during export.
                </p>
              </div>
            </div>
          </div>

          {/* Download button */}
          <div className="shrink-0 border-t border-border bg-surface p-4">
            <Button
              onClick={async () => { await handleGenerate(); setMobilePreviewOpen(false); }}
              isLoading={isGenerating}
              className="w-full min-h-[3.5rem] py-3 text-base shadow-xl shadow-primary/20"
            >
              <Download className="mr-2 h-5 w-5" />
              Download {templateType === "ATS" ? "ATS" : templateType === "DESIGN" ? "Premium Dark" : templateType === "MODERN" ? "Modern" : "Two-Col"} Resume
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
