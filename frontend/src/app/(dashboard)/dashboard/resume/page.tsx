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
