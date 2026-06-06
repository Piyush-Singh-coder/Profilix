"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, Loader2, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { useProfileStore } from "@/store/useProfileStore";
import { useExperienceStore } from "@/store/useExperienceStore";
import { useEducationStore } from "@/store/useEducationStore";
import { useProjectStore } from "@/store/useProjectStore";
import { useAchievementStore } from "@/store/useAchievementStore";
import { useProfileSkillStore } from "@/store/useProfileSkillStore";
import { useSocialStore } from "@/store/useSocialStore";

export function ResumeParserCard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isDragActive, setIsDragActive] = useState(false);
  const [status, setStatus] = useState<"IDLE" | "LOADING" | "SUCCESS" | "ERROR">("IDLE");
  const [progressMsg, setProgressMsg] = useState("");

  const { fetchProfile } = useProfileStore();
  const { fetchExperiences } = useExperienceStore();
  const { fetchEducations } = useEducationStore();
  const { fetchProjects } = useProjectStore();
  const { fetchAchievements } = useAchievementStore();
  const { fetchProfileSkills } = useProfileSkillStore();
  const { fetchLinks } = useSocialStore();

  const handleFileSelect = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported");
      return;
    }

    try {
      setStatus("LOADING");
      setProgressMsg("Uploading resume PDF...");

      // Simulate step transitions to show AI progress
      const steps = [
        "Extracting resume text...",
        "AI is identifying layout structure...",
        "Structuring work experience...",
        "Organizing technical skills...",
        "Mapping educational history...",
        "Applying updates to database..."
      ];

      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          setProgressMsg(steps[currentStep]);
          currentStep++;
        }
      }, 1500);

      const formData = new FormData();
      formData.append("resume", file);

      await api.post("/resume/parse", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(interval);
      setProgressMsg("Syncing profile dashboard...");

      // Refetch all store data to reload the UI instantly
      await Promise.all([
        fetchProfile(),
        fetchExperiences(),
        fetchEducations(),
        fetchProjects(),
        fetchAchievements(),
        fetchProfileSkills(),
        fetchLinks()
      ]);

      setStatus("SUCCESS");
      toast.success("AI Import completed successfully!");
      
      // Auto reset back to idle after 4 seconds
      setTimeout(() => {
        setStatus("IDLE");
        setProgressMsg("");
      }, 4000);

    } catch (err: any) {
      console.error("[ResumeParser]", err);
      setStatus("ERROR");
      toast.error(err?.response?.data?.message || "Failed to parse resume.");
      
      setTimeout(() => {
        setStatus("IDLE");
      }, 4000);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = () => {
    setIsDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card variant="glass" className="border-primary/20 shadow-lg shadow-primary/5 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5 fill-current animate-pulse" />
          <CardTitle className="text-xl">Import Portfolio from Resume</CardTitle>
        </div>
        <CardDescription>
          Upload your existing resume PDF. Our AI model will extract and populate your profile details, work history, projects, educations, and skills instantly.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {status === "LOADING" ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 animate-in fade-in-50 duration-300">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <div>
              <p className="font-semibold text-text-primary text-base">Processing Resume</p>
              <p className="text-xs text-text-secondary mt-1 animate-pulse">{progressMsg}</p>
            </div>
          </div>
        ) : status === "SUCCESS" ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-3 animate-in zoom-in-95 duration-300">
            <div className="rounded-full bg-success/10 p-3 text-success">
              <CheckCircle2 className="h-10 w-10 fill-current" />
            </div>
            <div>
              <p className="font-semibold text-text-primary text-base">Details Imported!</p>
              <p className="text-xs text-text-secondary mt-1">Your profile has been auto-filled with all parsed information.</p>
            </div>
          </div>
        ) : status === "ERROR" ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-3 animate-in zoom-in-95 duration-300">
            <div className="rounded-full bg-danger/10 p-3 text-danger">
              <AlertCircle className="h-10 w-10" />
            </div>
            <div>
              <p className="font-semibold text-text-primary text-base">Import Failed</p>
              <p className="text-xs text-text-secondary mt-1">Make sure you uploaded a valid PDF file. Please try again.</p>
            </div>
          </div>
        ) : (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              isDragActive 
                ? "border-primary bg-primary/5 scale-[0.99] shadow-inner" 
                : "border-border bg-surface-low hover:border-primary/50 hover:bg-surface-high"
            }`}
            onClick={triggerFileSelect}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="application/pdf"
              className="hidden"
            />
            
            <div className="rounded-full bg-primary/10 p-4 text-primary mb-3">
              <UploadCloud className="h-8 w-8" />
            </div>
            
            <h3 className="font-semibold text-text-primary text-sm">Drag and drop your resume PDF</h3>
            <p className="text-xs text-text-secondary mt-1 mb-4">or click to browse your files (PDF only, max 5MB)</p>
            
            <Button type="button" variant="outline" size="sm">
              Select Resume File
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
