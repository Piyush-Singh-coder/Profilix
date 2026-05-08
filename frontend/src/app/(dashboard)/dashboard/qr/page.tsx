"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Copy, Download, ExternalLink, Loader2, QrCode, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuthStore } from "@/store/useAuthStore";
import { useQRStore } from "@/store/useQRStore";
import { useProfileStore } from "@/store/useProfileStore";
import { OnboardingModal } from "@/components/dashboard/OnboardingModal";
import type { CardTheme } from "@/types";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function QRDashboardPage() {
  const { user } = useAuthStore();
  const { standardQR, lockScreenQR, isLoading, error, fetchQR } = useQRStore();
  const { completeness, fetchProfileCompleteness } = useProfileStore();
  const [showBlockerModal, setShowBlockerModal] = useState(false);
  const [hasDismissedOnCurrentVisit, setHasDismissedOnCurrentVisit] = useState(false);

  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"default" | "hire">("default");

  useEffect(() => {
    fetchQR("STANDARD");
    fetchQR("LOCK_SCREEN");
    fetchProfileCompleteness();
  }, [fetchQR, fetchProfileCompleteness]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (completeness) {
      const requiredFields = ["identity", "projects", "skills", "experience", "achievements"];
      const isMissingFields = requiredFields.some(field => !completeness[field]);
      if (isMissingFields && !hasDismissedOnCurrentVisit) {
        setShowBlockerModal(true);
      }
    }
  }, [completeness, hasDismissedOnCurrentVisit]);

  const profileUrl = useMemo(() => {
    if (typeof window === "undefined" || !user?.username) return "";
    const modeQuery = viewMode === "hire" ? "?mode=hire" : "";
    return `${window.location.origin}/u/${user.username}${modeQuery}`;
  }, [user?.username, viewMode]);

  const copyLink = async () => {
    if (!profileUrl) return;
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const downloadUrlAsFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        toast.error(`Export failed (${response.status})`);
        return;
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("image/")) {
        toast.error("Export returned an invalid image response");
        return;
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      toast.error("Download failed");
    }
  };



  const openProfile = () => {
    if (profileUrl) window.open(profileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="animate-in space-y-8 pb-24">
      <DashboardHeader 
        title="QR & Share"
        subtitle="Access your digital identity anywhere. Copy your profile URL, generate standard QR codes, or create beautiful lock screen wallpapers."
        badge="Instant Sharing"
        icon={QrCode}
      />

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Public Profile URL</CardTitle>
          <CardDescription>Switch between default and recruiter mode before sharing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${viewMode === "default" ? "border-primary bg-primary/10 text-primary" : "border-border text-text-secondary"}`}
              onClick={() => setViewMode("default")}
            >
              Default
            </button>
            <button
              type="button"
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${viewMode === "hire" ? "border-primary bg-primary/10 text-primary" : "border-border text-text-secondary"}`}
              onClick={() => setViewMode("hire")}
            >
              Recruiter
            </button>
          </div>
          <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-surface-low p-3 sm:flex-row sm:items-center">
            <p className="flex-1 truncate text-sm text-text-secondary">{profileUrl || "Loading profile URL..."}</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={copyLink}>
                <Copy className="mr-2 h-4 w-4" />
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button onClick={openProfile}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>



      <div className="grid gap-4 lg:grid-cols-2">
        <Card variant="surface">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Standard QR
            </CardTitle>
            <CardDescription>Square card for docs, social bios and print material.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5">
            <div className="relative h-56 w-56 overflow-hidden rounded-2xl border border-border bg-white p-4">
              {isLoading && !standardQR ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : standardQR ? (
                <Image src={standardQR} alt="Standard QR" fill className="object-contain p-4" unoptimized />
              ) : null}
            </div>
            <Button
              disabled={!standardQR}
              onClick={() => standardQR && downloadUrlAsFile(standardQR, `profilix-qr-${user?.username || "user"}.png`)}
            >
              <Download className="mr-2 h-4 w-4" />
              Download PNG
            </Button>
          </CardContent>
        </Card>

        <Card variant="surface">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Lock Screen QR
            </CardTitle>
            <CardDescription>Vertical wallpaper style card for events and meetups.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5">
            <div className="relative h-[320px] w-[190px] overflow-hidden rounded-[2rem] border border-border bg-slate-900">
              {isLoading && !lockScreenQR ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : lockScreenQR ? (
                <Image src={lockScreenQR} alt="Lockscreen QR" fill className="object-cover" unoptimized />
              ) : null}
            </div>
            <Button
              variant="outline"
              disabled={!lockScreenQR}
              onClick={() =>
                lockScreenQR && downloadUrlAsFile(lockScreenQR, `profilix-wallpaper-${user?.username || "user"}.png`)
              }
            >
              <Download className="mr-2 h-4 w-4" />
              Download Wallpaper
            </Button>
          </CardContent>
        </Card>
      </div>

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
