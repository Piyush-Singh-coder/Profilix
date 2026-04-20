"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Download, FileText, Info, Layout, FileStack, Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useResumeStore } from "@/store/useResumeStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { cn } from "@/lib/utils";
import { OnboardingModal } from "@/components/dashboard/OnboardingModal";
// import { InfoLayout } from "@/components/layout/InfoLayout";

export default function ResumePage() {
  const { resume, isLoading, isUploading, isGenerating, isDeleting, error, uploadProgress, fetchResume, uploadResume, deleteResume, generateResume } =
    useResumeStore();
  const { user } = useAuthStore();
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [useAI, setUseAI] = useState(false);
  const [format, setFormat] = useState<"pdf" | "docx">("pdf");
  const [templateType, setTemplateType] = useState<"ATS" | "DESIGN">("ATS");
  
  const { completeness, fetchProfileCompleteness } = useProfileStore();
  const [showBlockerModal, setShowBlockerModal] = useState(false);
  const [hasDismissedOnCurrentVisit, setHasDismissedOnCurrentVisit] = useState(false);

  useEffect(() => {
    fetchResume();
    fetchProfileCompleteness();
  }, [fetchResume, fetchProfileCompleteness]);

  useEffect(() => {
    if (completeness) {
      const requiredFields = ["identity", "projects", "skills", "experience", "achievements"];
      const isMissingFields = requiredFields.some(field => !completeness[field]);
      if (isMissingFields && !hasDismissedOnCurrentVisit) {
        setShowBlockerModal(true);
      }
    }
  }, [completeness, hasDismissedOnCurrentVisit]);

  const validateFile = (file: File) => {
    if (file.type !== "application/pdf") return "Please upload a PDF resume.";
    if (file.size > 5 * 1024 * 1024) return "Maximum file size is 5MB.";
    return null;
  };

  const handleUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setLocalError(null);
    try {
      await uploadResume(file);
      toast.success("Resume uploaded");
    } catch {
      toast.error("Failed to upload resume");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete your resume?")) return;
    try {
      await deleteResume();
      if (inputRef.current) inputRef.current.value = "";
      toast.success("Resume deleted");
    } catch {
      toast.error("Failed to delete resume");
    }
  };

  const handleGenerate = async () => {
    console.log(`[ResumePage] Generating ${templateType} resume... (Format: ${format})`);
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

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (isLoading && !resume) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const activeError = localError || error;

  return (
    <div className="animate-in space-y-8 pb-24">
      <div className="border-b border-border pb-5">
        <h1 className="font-heading text-3xl font-bold">Resume</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Generate a professional resume (PDF/DOCX) with multiple templates or upload your own.
        </p>
      </div>

      {activeError ? (
        <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4" />
          <span>{activeError}</span>
        </div>
      ) : null}

      <Card variant="glass" className="relative z-10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>AI Resume Generator</CardTitle>
            <div className="group relative z-50 flex items-center">
              <Info className="h-4 w-4 cursor-help text-text-secondary opacity-60 transition-opacity hover:opacity-100" />
              <div className="pointer-events-none absolute left-0 top-full mt-2 w-72 -translate-x-1/4 rounded-xl border border-border bg-surface-high p-4 text-xs leading-relaxed text-text-primary opacity-0 shadow-2xl transition-opacity group-hover:opacity-100 lg:-translate-x-1/2">
                <p className="mb-2 font-bold text-primary">Resume Features</p>
                <div className="space-y-2">
                  <p><strong>ATS Friendly:</strong> Standard single-column layout optimized for software screeners. Available in PDF and DOCX.</p>
                  <p><strong>Premium Design:</strong> Elegant 2-column layout that <span className="text-secondary font-medium">follows your active theme (Glass, Neon, etc.)</span> and brand colors. Available in PDF only.</p>
                </div>
                <div className="absolute -top-1 left-[15%] h-2 w-2 rotate-45 border-l border-t border-border bg-surface-high lg:left-1/2" />
              </div>
            </div>
          </div>
          <CardDescription>
            Paste a job description to tailor bullet points. Files are streamed directly to you (not stored on the server).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Textarea
              label="Job Description (optional)"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              rows={6}
              placeholder="Paste the job description here to tailor your resume..."
            />

            <div className="space-y-3">
              <label className="text-sm font-medium text-text-secondary">Select Template</label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setTemplateType("ATS")}
                  className={cn(
                    "relative flex cursor-pointer flex-col items-start gap-3 rounded-[var(--radius-md)] border-2 p-4 text-left transition-all",
                    templateType === "ATS"
                      ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                      : "border-border bg-surface-low hover:border-primary/40"
                  )}
                >
                  <div className="rounded-lg bg-surface-high p-2 text-text-primary shadow-sm">
                    <FileStack className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">ATS Friendly</h3>
                    <p className="mt-1 text-xs text-text-secondary">
                      Clean, single-column text. Best for automated job portals.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (format === "pdf") setTemplateType("DESIGN");
                  }}
                  disabled={format === "docx"}
                  className={cn(
                    "relative flex flex-col items-start gap-3 rounded-[var(--radius-md)] border-2 p-4 text-left transition-all",
                    templateType === "DESIGN"
                      ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                      : "border-border bg-surface-low hover:border-primary/40",
                    format === "docx" && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="rounded-lg bg-surface-high p-2 text-text-primary shadow-sm">
                    <Layout className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">Premium Design</h3>
                    <p className="mt-1 text-xs text-text-secondary">
                      2-column modern layout with dynamic theme accents.
                    </p>
                    {format === "docx" && (
                      <p className="mt-2 text-[10px] font-medium uppercase text-danger">PDF ONLY</p>
                    )}
                  </div>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-end gap-3">
                <div className="w-44">
                  <Select
                    label="Format"
                    value={format}
                    onChange={(value) => {
                      const nextFormat = value as "pdf" | "docx";
                      setFormat(nextFormat);
                      if (nextFormat === "docx") setTemplateType("ATS");
                    }}
                    options={[
                      { value: "pdf", label: "PDF" },
                      { value: "docx", label: "DOCX" },
                    ]}
                  />
                </div>
                <Switch 
                  checked={useAI} 
                  onCheckedChange={setUseAI} 
                  label="Use AI tailoring" 
                  layout="vertical"
                />
              </div>
              <Button onClick={handleGenerate} isLoading={isGenerating} className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Generate {templateType} Resume
              </Button>
            </div>
            {useAI && !jobDescription.trim() ? (
              <p className="text-xs text-text-secondary">Add a job description to enable AI tailoring.</p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Master Resume</CardTitle>
          <CardDescription>Drag and drop your file or click to browse.</CardDescription>
        </CardHeader>
        <CardContent>
          {resume ? (
            <div className="rounded-[var(--radius-md)] border border-border bg-surface-low p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">{resume.originalFilename}</p>
                    <p className="mt-1 text-xs text-text-secondary">{formatBytes(resume.fileSizeBytes)} PDF</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => window.open(resume.fileUrl, "_blank")}>
                    <Download className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className={`w-full rounded-[var(--radius-lg)] border-2 border-dashed p-12 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/10" : "border-border bg-surface-low hover:border-primary/30"
              }`}
              onDragEnter={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setDragActive(false);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                setDragActive(false);
                const file = event.dataTransfer.files?.[0];
                if (file) handleUpload(file);
              }}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                hidden
                type="file"
                accept="application/pdf"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) handleUpload(file);
                }}
              />
              <UploadCloud className="mx-auto h-10 w-10 text-primary" />
              <p className="mt-4 font-semibold text-text-primary">Drop your resume PDF here</p>
              <p className="mt-1 text-sm text-text-secondary">or click to select a file</p>
              {isUploading ? (
                <div className="mx-auto mt-5 max-w-xs">
                  <div className="h-2 rounded-full bg-surface">
                    <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-text-secondary">{uploadProgress}% uploaded</p>
                </div>
              ) : null}
            </button>
          )}
        </CardContent>
      </Card>

      <OnboardingModal 
        mode="BLOCKER" 
        open={showBlockerModal} 
        onClose={() => {
          setShowBlockerModal(false);
          setHasDismissedOnCurrentVisit(true);
        }} 
      />
    </div>
  );
}
