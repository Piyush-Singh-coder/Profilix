"use client";

import { useEffect, useState } from "react";
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

type WizardStep = "CONTENT" | "CUSTOMIZE" | "DOWNLOAD";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function ResumePage() {
  const { isGenerating, generateResume } = useResumeStore();
  const { user } = useAuthStore();
  const { profile, fetchProfile } = useProfileStore();
  const { experiences, fetchExperiences } = useExperienceStore();
  const { educations, fetchEducations } = useEducationStore();
  
  const [activeStep, setActiveStep] = useState<WizardStep>("CONTENT");
  const [jobDescription, setJobDescription] = useState("");
  const [useAI, setUseAI] = useState(false);
  const [format, setFormat] = useState<"pdf" | "docx">("pdf");
  const [templateType, setTemplateType] = useState<"ATS" | "DESIGN" | "MODERN" | "ENHANCV">("ATS");
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchExperiences();
    fetchEducations();
  }, [fetchProfile, fetchExperiences, fetchEducations]);

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
              onClick={() => setActiveStep("CONTENT")}
              className={cn("flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-colors", activeStep === "CONTENT" ? "bg-primary text-white shadow-md" : "text-text-secondary hover:bg-surface-high")}
            >
              <PenTool className="h-4 w-4" /> Content
            </button>
            <button
              onClick={() => setActiveStep("CUSTOMIZE")}
              className={cn("flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-colors", activeStep === "CUSTOMIZE" ? "bg-primary text-white shadow-md" : "text-text-secondary hover:bg-surface-high")}
            >
              <Settings className="h-4 w-4" /> Customize
            </button>
            <button
              onClick={() => setActiveStep("DOWNLOAD")}
              className={cn("flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-colors", activeStep === "DOWNLOAD" ? "bg-primary text-white shadow-md" : "text-text-secondary hover:bg-surface-high")}
            >
              <Download className="h-4 w-4" /> Download
            </button>
          </div>

          {/* Step 1: Content */}
          {activeStep === "CONTENT" && (
            <Card variant="glass" className="border-primary/20 shadow-lg shadow-primary/5">
              <CardHeader>
                <CardTitle className="text-xl">Profile Content</CardTitle>
                <CardDescription>Your resume data is linked to your central Profile Editor.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-border bg-surface-low p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-text-primary">Data Sync is Active</p>
                      <p className="text-xs text-text-secondary mt-1">Changes made in the dashboard apply here.</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Edit3 className="h-5 w-5" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                      <span className="text-text-secondary">Identity & Bio</span>
                      <span className={profile?.displayName ? "text-success font-semibold" : "text-danger"}>{profile?.displayName ? "Added" : "Missing"}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                      <span className="text-text-secondary">Experiences</span>
                      <span className="font-semibold text-text-primary">{experiences.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                      <span className="text-text-secondary">Education</span>
                      <span className="font-semibold text-text-primary">{educations.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-secondary">Skills</span>
                      <span className="font-semibold text-text-primary">{profile?.techStacks?.length || 0}</span>
                    </div>
                  </div>

                  <Link href="/dashboard" className="mt-6 block">
                    <Button variant="outline" className="w-full">
                      Edit Data in Profile Editor
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Customize */}
          {activeStep === "CUSTOMIZE" && (
            <Card variant="glass" className="border-primary/20 shadow-lg shadow-primary/5">
              <CardHeader>
                <CardTitle className="text-xl">Template & Format</CardTitle>
                <CardDescription>Choose how your resume is presented.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  {/* ATS */}
                  <button
                    type="button"
                    onClick={() => setTemplateType("ATS")}
                    className={cn(
                      "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all",
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
                      "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all",
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
                      "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all",
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
                      "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all",
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
          )}

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
                  className="w-full h-12 text-lg shadow-xl shadow-primary/20"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download {templateType === "ATS" ? "ATS" : templateType === "DESIGN" ? "Premium Dark" : templateType === "MODERN" ? "Modern" : "Premium Two-Col"} Resume
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Live Preview Sticky Container — desktop only */}
        <div className="hidden lg:block sticky top-8">
          <div className="rounded-2xl border border-border bg-surface-low p-6 shadow-xl relative">
            <div className="absolute top-0 right-0 p-3 flex gap-2 z-10">
              <span className="flex h-6 items-center rounded-full bg-primary/20 px-2.5 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                Live Preview
              </span>
            </div>
            <ResumeLivePreview templateType={templateType} />
            <p className="text-center text-xs text-text-secondary mt-6">
              Preview matches ATS output. Premium template adds sidebars and colors on export.
            </p>
          </div>
        </div>
      </div>

      {/* ── Mobile: floating preview button ── */}
      <div className="fixed bottom-[88px] left-1/2 -translate-x-1/2 z-50 lg:hidden">
        <button
          onClick={() => setMobilePreviewOpen(true)}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-2xl shadow-primary/40 hover:bg-primary/90 active:scale-95 transition-all"
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
              <p className="text-[10px] text-text-secondary capitalize">{templateType === "ATS" ? "ATS Friendly" : templateType === "DESIGN" ? "Premium Dark" : templateType === "MODERN" ? "Modern Classic" : "Premium Two-Col"} · {format.toUpperCase()}</p>
            </div>
            <button
              onClick={() => setMobilePreviewOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-high border border-border text-text-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Scrollable preview area */}
          <div className="flex-1 overflow-y-auto bg-zinc-100 dark:bg-zinc-900 px-4 pt-4 pb-6">
            <div className="mx-auto w-full">
              {/* 
                Scale trick: the preview is designed for 794px wide (A4).
                We render it full-size inside a clipping wrapper, then scale it down.
                The wrapper's height must equal 794 * 11/8.5 * scale = 1123 * scale.
                On a 360px-wide phone with 32px padding: usable = 328px, scale = 328/794 ≈ 0.413
              */}
              <div
                className="relative overflow-hidden rounded-xl shadow-2xl border border-black/10 bg-white mx-auto"
                style={{
                  width: '100%',
                  paddingBottom: `${(1123 / 794) * 100}%`,
                }}
              >
                <div
                  className="absolute top-0 left-0 origin-top-left"
                  style={{
                    width: '794px',
                    height: '1123px',
                    transform: 'scale(var(--preview-scale, 0.41))',
                  }}
                >
                  {/* CSS custom property set via a small style tag so it reacts to container width */}
                  <style>{`
                    :root { --preview-scale: 0.41; }
                    @media (min-width: 400px) { :root { --preview-scale: 0.46; } }
                    @media (min-width: 480px) { :root { --preview-scale: 0.56; } }
                    @media (min-width: 560px) { :root { --preview-scale: 0.66; } }
                  `}</style>
                  <ResumeLivePreview templateType={templateType} />
                </div>
              </div>
              <p className="text-center text-xs text-zinc-500 mt-4 px-4">
                Preview matches ATS output. Premium templates add sidebars &amp; colors on export.
              </p>
            </div>
          </div>

          {/* Download button at the bottom */}
          <div className="shrink-0 border-t border-border bg-surface p-4">
            <Button
              onClick={async () => { await handleGenerate(); setMobilePreviewOpen(false); }}
              isLoading={isGenerating}
              className="w-full h-12 text-base shadow-xl shadow-primary/20"
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
