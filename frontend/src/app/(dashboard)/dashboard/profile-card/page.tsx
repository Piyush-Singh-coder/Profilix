"use client";

import { useEffect, useMemo, useState } from "react";
import { 
  Download, 
  Loader2, 
  Sparkles, 
  Layout, 
  Maximize, 
  Check,
  Smartphone,
  Monitor,
  Share2
} from "lucide-react";
import { 
  FaInstagram as Instagram, 
  FaLinkedin as Linkedin, 
  FaXTwitter as Twitter 
} from "react-icons/fa6";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { cn } from "@/lib/utils";
import type { CardTheme } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

const EXPORT_SIZES = ["1080x1080", "1200x628", "1200x675", "1920x1080"] as const;
const SIZE_INFO: Record<string, { label: string; sub: string; icon: any; ratio: number }> = {
  "1080x1080": { label: "Instagram", sub: "Post / Square", icon: Instagram, ratio: 1 },
  "1200x628": { label: "LinkedIn", sub: "Wide Banner", icon: Linkedin, ratio: 1.91 },
  "1200x675": { label: "Twitter (X)", sub: "Landscape Post", icon: Twitter, ratio: 1.77 },
  "1920x1080": { label: "Full HD", sub: "Presentation", icon: Monitor, ratio: 1.77 },
};

const THEMES: { id: CardTheme; name: string; desc: string; colors: string }[] = [
  { id: "GLASS", name: "Glass", desc: "Premium translucent design with vibrant accents", colors: "from-blue-500/20 to-teal-500/20" },
  { id: "BRUTAL", name: "Brutal", desc: "Bold, high-contrast flat design with sharp borders", colors: "from-amber-400 to-orange-400" },
  { id: "APPLE", name: "Apple", desc: "Clean, minimalist aesthetic with soft shadows", colors: "from-gray-100 to-gray-300" },
];

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function ProfileCardPage() {
  const { user } = useAuthStore();
  const { profile, fetchProfile, updateProfile, isLoading: isProfileLoading, isSaving: isProfileSaving } = useProfileStore();
  
  const [exportSize, setExportSize] = useState<(typeof EXPORT_SIZES)[number]>("1080x1080");
  const [cardTheme, setCardTheme] = useState<CardTheme>("GLASS");
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<"customize" | "preview">("customize");

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Sync local state with profile
  useEffect(() => {
    if (profile?.cardTheme) {
      setCardTheme(profile.cardTheme);
    }
  }, [profile?.cardTheme]);

  const handleThemeSelect = async (theme: CardTheme) => {
    setCardTheme(theme);
    try {
      await updateProfile({ cardTheme: theme });
      toast.success(`${theme} theme applied to your public profile`);
    } catch {
      toast.error("Failed to save theme preference");
    }
  };

  const downloadUrlAsFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        toast.error(`Export failed (${response.status})`);
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
      const displayName = profile?.displayName || user?.fullName || user?.username || "user";
      const formattedName = displayName.trim().replace(/\s+/g, "_");
      const exportUrl = `${API_BASE_URL}/u/${user.username}/card-export?size=${exportSize}&theme=${cardTheme}`;
      await downloadUrlAsFile(exportUrl, `ProfileCard-${formattedName}-${exportSize}.png`);
      toast.success("Card exported successfully!");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-24">
      <DashboardHeader 
        title="Profile Card"
        subtitle="Generate high-resolution profile cards for LinkedIn, Twitter, and Instagram. Showcase your skills, experience, and GitHub stats in a single beautiful image."
        badge="Premium Export"
        icon={Sparkles}
      />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* ── Sidebar Controls (Customize) ────────────────────────────── */}
        <div className="space-y-6 lg:col-span-5">
          {/* Theme Selection */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-text-secondary">
              <Layout className="h-4 w-4" />
              Choose Theme
            </h3>
            <div className="grid gap-4">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border-2 p-4 text-left transition-all duration-300",
                    cardTheme === theme.id
                      ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                      : "border-border bg-surface-low hover:border-primary/40 hover:bg-surface-medium"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("h-12 w-12 rounded-xl bg-gradient-to-br shadow-inner", theme.colors)} />
                    <div className="flex-1">
                      <p className="font-bold text-text-primary">{theme.name}</p>
                      <p className="text-xs text-text-secondary line-clamp-1">{theme.desc}</p>
                    </div>
                    {cardTheme === theme.id && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Size Selection */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-text-secondary">
              <Maximize className="h-4 w-4" />
              Export Dimension
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {EXPORT_SIZES.map((size) => {
                const info = SIZE_INFO[size];
                const active = exportSize === size;
                const Icon = info.icon;
                return (
                  <button
                    key={size}
                    onClick={() => setExportSize(size)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all duration-300",
                      active
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-surface-low text-text-secondary hover:border-primary/40"
                    )}
                  >
                    <Icon className={cn("h-6 w-6", active ? "text-primary" : "text-text-muted")} />
                    <div>
                      <p className="text-sm font-bold">{info.label}</p>
                      <p className="text-[10px] opacity-60">{size}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Action Button */}
          <div className="pt-4">
            <Button 
              onClick={exportCard} 
              disabled={isExporting} 
              size="lg" 
              className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20"
            >
              {isExporting ? (
                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
              ) : (
                <Download className="mr-3 h-6 w-6" />
              )}
              {isExporting ? "GENERATING..." : "DOWNLOAD CARD"}
            </Button>
            <p className="mt-4 text-center text-xs text-text-muted">
              Processing can take up to 5 seconds. High-resolution PNG image will be downloaded.
            </p>
          </div>
        </div>

        {/* ── Main Preview Area ────────────────────────────────────────── */}
        <div className="lg:col-span-7">
          <Card variant="glass" className="overflow-hidden border-none bg-surface/40 backdrop-blur-xl">
            <CardHeader className="border-b border-border/50 bg-surface-high/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Live Visualization</CardTitle>
                  <CardDescription>Simulated view of your card layout</CardDescription>
                </div>
                <div className="flex rounded-lg border border-border bg-surface-low p-1">
                   <button 
                    onClick={() => setActiveTab("customize")}
                    className={cn("px-3 py-1.5 text-xs font-bold rounded-md transition-all", activeTab === "customize" ? "bg-surface-high text-primary shadow-sm" : "text-text-secondary")}
                   >
                     Layout
                   </button>
                   <button 
                    onClick={() => setActiveTab("preview")}
                    className={cn("px-3 py-1.5 text-xs font-bold rounded-md transition-all", activeTab === "preview" ? "bg-surface-high text-primary shadow-sm" : "text-text-secondary")}
                   >
                     Real-time
                   </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex min-h-[500px] flex-col items-center justify-center p-8 lg:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={cardTheme + exportSize}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -10 }}
                  className="relative w-full shadow-2xl"
                  style={{ aspectRatio: SIZE_INFO[exportSize].ratio }}
                >
                  {/* Theme Mockup Simulation */}
                  <div className={cn(
                    "absolute inset-0 flex flex-col items-start justify-between overflow-hidden rounded-3xl p-[6%] text-white transition-all duration-700",
                    cardTheme === "GLASS" ? "bg-slate-950 shadow-[inset_0_0_80px_rgba(56,189,248,0.15)]" :
                    cardTheme === "BRUTAL" ? "bg-[#f9f7f0] border-[6px] border-black text-black" :
                    "bg-gray-50 text-gray-900 border border-gray-200 shadow-xl"
                  )}>
                    {/* Header Simulation */}
                    <div className="flex w-full items-center gap-[4%]">
                      <div className={cn(
                        "h-[18%] aspect-square rounded-full flex items-center justify-center text-4xl font-black",
                        cardTheme === "GLASS" ? "bg-gradient-to-br from-blue-400 to-blue-600" :
                        cardTheme === "BRUTAL" ? "bg-amber-400 border-4 border-black" :
                        "bg-gray-200 border border-gray-300"
                      )}>
                        {user?.fullName?.charAt(0) || "P"}
                      </div>
                      <div className="space-y-1">
                        <div className={cn("h-8 w-48 rounded-md", cardTheme === "GLASS" ? "bg-white/20" : cardTheme === "BRUTAL" ? "bg-black/10" : "bg-gray-200")} />
                        <div className={cn("h-4 w-32 rounded-md", cardTheme === "GLASS" ? "bg-white/10" : cardTheme === "BRUTAL" ? "bg-black/5" : "bg-gray-100")} />
                      </div>
                    </div>

                    {/* Middle Grid Simulation */}
                    <div className="grid w-full grid-cols-3 gap-[4%] flex-1 mt-[8%] mb-[4%]">
                       {[1, 2, 3].map(i => (
                         <div key={i} className={cn(
                           "rounded-2xl p-4 space-y-3",
                           cardTheme === "GLASS" ? "bg-white/5 border border-white/10" :
                           cardTheme === "BRUTAL" ? "bg-white border-4 border-black" :
                           "bg-white border border-gray-200 shadow-sm"
                         )}>
                            <div className={cn("h-3 w-12 rounded-full", cardTheme === "GLASS" ? "bg-blue-400/40" : "bg-primary/20")} />
                            <div className="space-y-2">
                               <div className={cn("h-3 w-full rounded-full", cardTheme === "GLASS" ? "bg-white/10" : "bg-gray-100")} />
                               <div className={cn("h-3 w-[80%] rounded-full", cardTheme === "GLASS" ? "bg-white/5" : "bg-gray-50")} />
                               <div className={cn("h-3 w-[60%] rounded-full", cardTheme === "GLASS" ? "bg-white/5" : "bg-gray-50")} />
                            </div>
                         </div>
                       ))}
                    </div>

                    {/* Footer / QR Simulation */}
                    <div className="flex w-full items-end justify-between mt-auto">
                       <div className="space-y-2">
                          <div className={cn("h-3 w-32 rounded-full", cardTheme === "GLASS" ? "bg-white/20" : "bg-gray-200")} />
                          <div className={cn("h-3 w-24 rounded-full", cardTheme === "GLASS" ? "bg-white/10" : "bg-gray-100")} />
                       </div>
                       <div className={cn(
                         "h-24 w-24 rounded-2xl flex items-center justify-center",
                         cardTheme === "GLASS" ? "bg-white/90 p-2" :
                         cardTheme === "BRUTAL" ? "bg-white border-4 border-black p-2" :
                         "bg-white border border-gray-200 p-2 shadow-md"
                       )}>
                          <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center">
                            <Share2 className={cn("h-10 w-10", cardTheme === "BRUTAL" ? "text-black" : "text-primary")} />
                          </div>
                       </div>
                    </div>

                    {/* Decorative blobs for Glass */}
                    {cardTheme === "GLASS" && (
                      <>
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
                      </>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <div className="mt-8 flex items-center gap-6 text-sm text-text-muted">
                 <div className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-success" />
                   <span>Includes QR Code</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-success" />
                   <span>GitHub Stats</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-success" />
                   <span>Auto-scaling</span>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
