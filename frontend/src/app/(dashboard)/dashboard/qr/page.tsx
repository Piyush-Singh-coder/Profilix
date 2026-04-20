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

const EXPORT_SIZES = ["1080x1080", "1200x628", "1200x675", "1920x1080"] as const;
const SIZE_INFO: Record<string, { label: string; sub: string; ratio: number }> = {
  "1080x1080": { label: "Instagram", sub: "Post / Square", ratio: 1 },
  "1200x628": { label: "LinkedIn", sub: "Wide Banner", ratio: 1.91 },
  "1200x675": { label: "Twitter (X)", sub: "Landscape Post", ratio: 1.77 },
  "1920x1080": { label: "Full HD", sub: "Presentation", ratio: 1.77 },
};
const CARD_THEMES: CardTheme[] = ["GLASSMORPHISM", "NEOBRUTALISM", "APPLE"];

type ExportSize = (typeof EXPORT_SIZES)[number];

function RatioBox({ ratio, active }: { ratio: number; active: boolean }) {
  return (
    <div className={`relative flex h-8 w-10 items-center justify-center rounded-md border ${active ? "border-primary/50 bg-primary/20" : "border-border bg-surface-low"} transition-all duration-300`}>
      <div 
        className={`rounded-[1.5px] border-[1.5px] ${active ? "border-primary" : "border-text-secondary/50"} transition-all duration-300`} 
        style={{ 
          width: ratio >= 1 ? "18px" : `${18 * ratio}px`, 
          height: ratio >= 1 ? `${18 / ratio}px` : "18px" 
        }} 
      />
    </div>
  );
}

export default function QRDashboardPage() {
  const { user } = useAuthStore();
  const { standardQR, lockScreenQR, isLoading, error, fetchQR } = useQRStore();
  const { completeness, fetchProfileCompleteness } = useProfileStore();
  const [showBlockerModal, setShowBlockerModal] = useState(false);
  const [hasDismissedOnCurrentVisit, setHasDismissedOnCurrentVisit] = useState(false);

  const [copied, setCopied] = useState(false);
  const [exportSize, setExportSize] = useState<ExportSize>("1080x1080");
  const [cardTheme, setCardTheme] = useState<CardTheme>("GLASSMORPHISM");
  const [viewMode, setViewMode] = useState<"default" | "hire">("default");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchQR("STANDARD");
    fetchQR("LOCK_SCREEN");
    fetchProfileCompleteness();
  }, [fetchQR, fetchProfileCompleteness]);

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

  const exportCard = async () => {
    if (!user?.username || isExporting) return;
    try {
      setIsExporting(true);
      const modeQuery = viewMode === "hire" ? "&mode=hire" : "";
      const themeQuery = `&theme=${cardTheme}`;
      const exportUrl = `${API_BASE_URL}/u/${user.username}/card-export?size=${exportSize}${modeQuery}${themeQuery}`;
      await downloadUrlAsFile(exportUrl, `profilix-card-${cardTheme.toLowerCase()}-${exportSize}.png`);
    } finally {
      setIsExporting(false);
    }
  };

  const openProfile = () => {
    if (profileUrl) window.open(profileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="animate-in space-y-8 pb-24">
      <div className="border-b border-border pb-5">
        <h1 className="font-heading text-3xl font-bold">Share & QR</h1>
        <p className="mt-1 text-sm text-text-secondary">Copy your profile URL, download QR assets and export profile cards.</p>
      </div>

      {error ? (
        <div className="rounded-[var(--radius-md)] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

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

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Profile Card Export</CardTitle>
          <CardDescription>Generate a social-ready profile image from your current public data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">Theme</p>
            <div className="flex gap-2">
              {CARD_THEMES.map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => setCardTheme(theme)}
                  className={`rounded-[var(--radius-md)] border px-3 py-2 text-sm transition-colors ${
                    cardTheme === theme
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-surface-low text-text-secondary"
                  }`}
                >
                  {theme === "GLASSMORPHISM" ? "Glass" : theme === "NEOBRUTALISM" ? "Brutal" : theme}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Export Size</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {EXPORT_SIZES.map((size) => {
                const info = SIZE_INFO[size];
                const active = exportSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setExportSize(size)}
                    className={`group flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-300 ${
                      active 
                        ? "border-primary bg-primary/10 shadow-sm shadow-primary/5" 
                        : "border-border bg-surface-low hover:border-text-secondary/30 hover:bg-surface-medium"
                    }`}
                  >
                    <RatioBox ratio={info.ratio} active={active} />
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold transition-colors ${active ? "text-primary" : "text-text-primary group-hover:text-primary"}`}>
                        {info.label}
                      </span>
                      <span className="text-[10px] font-medium text-text-tertiary">
                        {info.sub}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={exportCard} disabled={isExporting}>
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {isExporting ? "Exporting..." : "Export Card"}
            </Button>
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
