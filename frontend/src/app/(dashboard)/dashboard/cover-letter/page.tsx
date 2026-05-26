"use client";

import { useEffect, useRef, useState } from "react";
import { Download, FileText, Sparkles, Eye, X, PenTool, Columns, BookOpen, Layout } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { useCoverLetterStore, CoverLetterStyle } from "@/store/useCoverLetterStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function CoverLetterPage() {
  const {
    coverLetterContent,
    jobTitle,
    companyName,
    jobDescription,
    style,
    isGenerating,
    isDownloadingPdf,
    isDownloadingDocx,
    setCoverLetterContent,
    setJobTitle,
    setCompanyName,
    setJobDescription,
    setStyle,
    generateCoverLetter,
    downloadCoverLetter,
  } = useCoverLetterStore();

  const { profile, fetchProfile } = useProfileStore();
  const { user } = useAuthStore();

  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.5);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (mobilePreviewOpen && previewWrapperRef.current) {
      const w = previewWrapperRef.current.offsetWidth;
      setPreviewScale(w / 794);
    }
  }, [mobilePreviewOpen]);

  const handleGenerate = async () => {
    if (!jobTitle.trim()) {
      toast.error("Please enter a job title.");
      return;
    }
    if (!companyName.trim()) {
      toast.error("Please enter a company name.");
      return;
    }

    const toastId = toast.loading("Composing your tailored cover letter with AI. This might take 10-15 seconds...");
    try {
      await generateCoverLetter({
        jobTitle,
        companyName,
        jobDescription,
        style,
      });
      toast.success("Cover letter composed successfully by AI!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to generate cover letter", { id: toastId });
    }
  };

  const handleDownload = async (format: "pdf" | "docx") => {
    if (!coverLetterContent) {
      toast.error("Generate a cover letter before downloading.");
      return;
    }
    try {
      await downloadCoverLetter({
        content: coverLetterContent,
        jobTitle,
        companyName,
        style,
        format,
      });
      toast.success(`Downloaded Cover Letter as ${format.toUpperCase()}`);
    } catch (err: any) {
      toast.error(err.message || "Download failed");
    }
  };

  const candidateName = profile?.displayName || user?.fullName || "Your Name";
  const candidateEmail = user?.email || "you@example.com";
  const candidatePhone = profile?.phoneNumber || "";
  const candidateHeadline = profile?.headline || "Software Engineer";
  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Render the styled preview on canvas
  const renderPreview = () => {
    if (!coverLetterContent) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 text-text-secondary">
          <FileText className="h-16 w-16 mb-4 stroke-1 opacity-40 animate-pulse" />
          <p className="font-semibold text-text-primary">Cover Letter Preview</p>
          <p className="text-xs max-w-xs mt-1">
            Fill in the details and click "Generate Cover Letter" to see your customized preview instantly.
          </p>
        </div>
      );
    }

    const paragraphs = coverLetterContent.split(/\n\s*\n/).filter(Boolean);

    // Styling configurations based on style state
    switch (style) {
      case "MODERN":
        return (
          <div className="p-10 min-h-full flex flex-col justify-between font-sans text-[12.5px] leading-relaxed text-zinc-800 bg-white">
            <div>
              {/* Header */}
              <div className="border-b-2 border-blue-600 pb-4 mb-6">
                <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">{candidateName}</h1>
                {candidateHeadline && <p className="text-blue-600 text-xs font-bold uppercase tracking-wider mt-1">{candidateHeadline}</p>}
                <div className="flex gap-4 mt-2.5 text-[10px] text-zinc-505">
                  <span>✉ {candidateEmail}</span>
                  {candidatePhone && <span>📞 {candidatePhone}</span>}
                </div>
              </div>

              {/* Date & Recipient */}
              <div className="text-[10px] text-zinc-400 mb-3">{dateStr}</div>
              <div className="text-xs text-zinc-700 mb-4">
                <span className="font-bold text-zinc-900">Hiring Team</span>
                <p>{companyName}</p>
              </div>

              {/* Subject */}
              <div className="font-bold text-zinc-900 text-xs uppercase tracking-wide mb-4">
                Subject: Application for {jobTitle}
              </div>

              {/* Body */}
              <div className="space-y-3 text-justify text-zinc-700">
                {paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        );

      case "CREATIVE":
        return (
          <div className="min-h-full flex bg-white">
            {/* Sidebar */}
            <div className="w-1/3 bg-slate-900 text-slate-300 p-6 flex flex-col justify-between text-[10px] leading-relaxed border-r border-slate-800">
              <div>
                <h1 className="text-base font-black text-white leading-tight">{candidateName}</h1>
                {candidateHeadline && <p className="text-amber-500 font-bold uppercase tracking-wider text-[8px] mt-1">{candidateHeadline}</p>}
                
                <div className="h-[1px] bg-slate-800 my-4" />
                
                <div className="space-y-3">
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Email</p>
                    <p className="text-slate-200 mt-0.5 break-all">{candidateEmail}</p>
                  </div>
                  {candidatePhone && (
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Phone</p>
                      <p className="text-slate-200 mt-0.5">{candidatePhone}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-[9px] text-slate-500 mt-4">
                Generated with Profilix
              </div>
            </div>

            {/* Main Letter */}
            <div className="w-2/3 p-8 font-sans text-[11.5px] leading-relaxed text-zinc-700 flex flex-col justify-between">
              <div>
                <div className="text-[10px] text-zinc-400 mb-4">{dateStr}</div>
                
                <div className="mb-4">
                  <p className="font-semibold text-zinc-950">Hiring Team</p>
                  <p className="text-zinc-500">{companyName}</p>
                </div>

                <div className="font-extrabold text-zinc-950 text-xs border-l-3 border-amber-500 pl-2.5 mb-4">
                  Re: Application for {jobTitle}
                </div>

                <div className="space-y-3 text-justify">
                  {paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "MINIMALIST":
        return (
          <div className="p-10 min-h-full flex flex-col justify-between font-mono text-[11px] leading-relaxed text-zinc-800 bg-white">
            <div>
              {/* Header */}
              <div className="mb-5">
                <h1 className="text-lg font-medium text-zinc-950 tracking-tight">{candidateName}</h1>
                <div className="text-[9px] text-zinc-400 mt-1">
                  {candidateEmail} {candidatePhone && `• ${candidatePhone}`}
                </div>
              </div>

              {/* Date & Recipient */}
              <div className="text-zinc-400 mb-4">{dateStr}</div>
              <div className="text-zinc-950 mb-4 font-medium">
                Hiring Manager<br/>
                {companyName}
              </div>

              <div className="font-semibold text-zinc-900 mb-4 text-[11px]">
                Re: Application for {jobTitle}
              </div>

              {/* Body */}
              <div className="space-y-3 text-justify font-sans text-[11.5px] leading-relaxed text-zinc-700">
                {paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        );

      case "CLASSIC":
      default:
        return (
          <div className="p-10 min-h-full flex flex-col justify-between font-serif text-[12px] leading-relaxed text-zinc-900 bg-white">
            <div>
              {/* Header block (Classic style: Sender top right) */}
              <div className="text-right mb-5">
                <h1 className="font-sans text-lg font-bold text-zinc-950 leading-tight">{candidateName}</h1>
                {candidateHeadline && <p className="text-zinc-500 text-[9px] italic mt-0.5">{candidateHeadline}</p>}
                <p className="text-[9px] text-zinc-600 mt-1.5">Email: {candidateEmail}</p>
                {candidatePhone && <p className="text-[9px] text-zinc-600">Phone: {candidatePhone}</p>}
              </div>

              {/* Date & Recipient (Classic style: left aligned) */}
              <div className="mb-4">{dateStr}</div>
              
              <div className="mb-4">
                Hiring Committee<br/>
                {companyName}
              </div>

              {/* Subject */}
              <div className="font-bold uppercase tracking-wider text-[10px] mb-4">
                SUBJECT: APPLICATION FOR THE POSITION OF {jobTitle.toUpperCase()}
              </div>

              {/* Body */}
              <div className="space-y-3 text-justify">
                {paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="animate-in pb-24">
      <DashboardHeader 
        title="Cover Letter Builder"
        subtitle="Write bespoke, high-impact cover letters using AI matching your exact background details directly with a job description."
        badge="AI Smart Copy"
        icon={PenTool}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] xl:grid-cols-[500px_1fr] gap-8 items-start">
        {/* Left Column: Editor & Inputs */}
        <div className="space-y-6">
          <Card variant="glass" className="border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Target Role details
              </CardTitle>
              <CardDescription>Specify the target position to let AI custom tailor your cover letter.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Target Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Full-Stack Developer"
                required
              />
              <Input
                label="Target Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Google"
                required
              />
              <Textarea
                label="Job Description (Optional)"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={5}
                placeholder="Paste the job description or specific role requirements here for optimal matching..."
              />

              <div className="space-y-3">
                <label className="text-sm font-semibold text-text-primary">Cover Letter Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "CLASSIC", name: "Classic", icon: FileText, desc: "Traditional Editorial" },
                    { id: "MODERN", name: "Executive Modern", icon: Layout, desc: "Colored accents" },
                    { id: "CREATIVE", name: "Creative Bold", icon: Columns, desc: "Double column sidebar" },
                    { id: "MINIMALIST", name: "Minimalist Serif", icon: BookOpen, desc: "Ultra-clean spacing" },
                  ].map((sOpt) => (
                    <button
                      key={sOpt.id}
                      type="button"
                      onClick={() => setStyle(sOpt.id as CoverLetterStyle)}
                      className={cn(
                        "relative flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all",
                        style === sOpt.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-surface-low hover:border-primary/30"
                      )}
                    >
                      <sOpt.icon className={cn("h-5 w-5", style === sOpt.id ? "text-primary" : "text-text-secondary")} />
                      <div>
                        <h4 className="font-semibold text-text-primary text-[11px]">{sOpt.name}</h4>
                        <p className="text-[9px] text-text-secondary">{sOpt.desc}</p>
                      </div>
                      {style === sOpt.id && <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                isLoading={isGenerating}
                className="w-full mt-4 h-11"
              >
                <Sparkles className="mr-2 h-4 w-4" /> Composing with AI
              </Button>
            </CardContent>
          </Card>

          {/* Active Editable Content Panel */}
          {coverLetterContent !== null && (
            <Card variant="glass" className="border-primary/20 shadow-lg animate-in fade-in slide-in-from-top-3">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Customise Letter Text</span>
                  <span className="text-[10px] text-success bg-success/15 px-2 py-0.5 rounded-full font-semibold">
                    Interactive
                  </span>
                </CardTitle>
                <CardDescription>Manually refine the composed paragraphs directly below.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={coverLetterContent}
                  onChange={(e) => setCoverLetterContent(e.target.value)}
                  rows={14}
                  className="font-sans text-sm text-text-primary resize-y leading-relaxed"
                />

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    onClick={() => handleDownload("pdf")}
                    isLoading={isDownloadingPdf}
                    disabled={isDownloadingDocx}
                    variant="outline"
                    className="h-11 border-primary/20 text-primary hover:bg-primary/5"
                  >
                    <Download className="mr-2 h-4 w-4" /> Export PDF
                  </Button>
                  <Button
                    onClick={() => handleDownload("docx")}
                    isLoading={isDownloadingDocx}
                    disabled={isDownloadingPdf}
                    className="h-11 shadow-lg shadow-primary/10"
                  >
                    <Download className="mr-2 h-4 w-4" /> Export Word
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Live Styled Preview (No min-height to allow natural layout shrink) */}
        <div className="hidden lg:block sticky top-8">
          <div className="rounded-2xl border border-border bg-surface-low p-6 shadow-xl relative">
            <div className="absolute top-0 right-0 p-3 flex gap-2 z-10">
              <span className="flex h-6 items-center rounded-full bg-primary/20 px-2.5 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                Live Canvas preview
              </span>
            </div>
            
            {/* Styled White Page (A4 aspect ratio container, now scrollable for long letter variants) */}
            <div className="overflow-y-auto rounded-xl shadow-2xl border border-border/60 bg-white aspect-[8.5/11] max-w-[620px] mx-auto transition-all scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
              {renderPreview()}
            </div>
            
            <p className="text-center text-xs text-text-secondary mt-5">
              The live canvas dynamically shifts layouts to showcase exact spacing, margins, and letterhead positioning based on your selected template style.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile: inline preview button */}
      {coverLetterContent !== null && (
        <div className="mt-4 lg:hidden">
          <button
            onClick={() => setMobilePreviewOpen(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-5 py-3 text-sm font-bold text-primary hover:bg-primary/20 active:scale-[0.98] transition-all"
          >
            <Eye className="h-4 w-4" />
            Preview Cover Letter Style
          </button>
        </div>
      )}

      {/* Mobile Preview Overlay Bottom-sheet */}
      {mobilePreviewOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-background lg:hidden animate-in slide-in-from-bottom">
          <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 shrink-0">
            <div>
              <p className="font-bold text-text-primary text-sm">Cover Letter Canvas</p>
              <p className="text-[10px] text-text-secondary capitalize">{style.toLowerCase()} Layout Style</p>
            </div>
            <button
              onClick={() => setMobilePreviewOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-high border border-border text-text-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-zinc-100 dark:bg-zinc-950 p-6 sm:p-10 flex flex-col items-center justify-center">
            <div ref={previewWrapperRef} className="w-full max-w-[500px]">
              <div
                className="overflow-y-auto rounded-xl shadow-2xl border border-black/10 bg-white mx-auto aspect-[8.5/11] scrollbar-thin"
                style={{ width: '100%', height: `${Math.round(1020 * previewScale)}px` }}
              >
                <div style={{
                  width: '794px',
                  transformOrigin: 'top left',
                  transform: `scale(${previewScale})`,
                  height: '100%',
                }}>
                  {renderPreview()}
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-border bg-surface p-4 flex gap-3">
            <Button
              onClick={() => { handleDownload("pdf"); setMobilePreviewOpen(false); }}
              isLoading={isDownloadingPdf}
              disabled={isDownloadingDocx}
              variant="outline"
              className="flex-1 h-12"
            >
              <Download className="mr-2 h-4 w-4" /> PDF
            </Button>
            <Button
              onClick={() => { handleDownload("docx"); setMobilePreviewOpen(false); }}
              isLoading={isDownloadingDocx}
              disabled={isDownloadingPdf}
              className="flex-1 h-12"
            >
              <Download className="mr-2 h-4 w-4" /> Word
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
