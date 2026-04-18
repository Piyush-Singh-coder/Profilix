"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { Loader2 } from "lucide-react";

export default function LivePreview() {
  const { user } = useAuthStore();
  const { profile } = useProfileStore();

  const previewThemeClass =
    profile?.theme === "BRUTALISM"
      ? "bg-[#fffce8] border-[#111]"
      : profile?.theme === "CLAY"
      ? "bg-[#f6f2ea] border-[#c7b8a9]"
      : profile?.theme === "MINIMAL"
      ? "bg-[#f7f7f7] border-[#d4d4d4]"
      : "bg-surface border-border";

  if (!user?.username) {
    return (
      <div className="relative mx-auto flex h-[670px] w-[330px] items-center justify-center rounded-[2.8rem] border-4 border-black/60 bg-black shadow-2xl">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
      </div>
    );
  }

  // A cache-buster forces the preview to reload its internal data 
  // every time LivePreview remounts, so it picks up recent saves.
  const previewTimestamp = new Date().getTime();

  return (
    <div className="relative mx-auto w-[330px] max-w-full rounded-[2.8rem] border-4 border-black/60 bg-black p-[3px] shadow-2xl">
      <div className={`relative h-[670px] flex overflow-hidden rounded-[2.6rem] border ${previewThemeClass} bg-surface`}>
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-text-secondary opacity-50" />
        </div>
        <iframe
          src={`/u/${user.username}?preview=${previewTimestamp}`}
          className="relative z-10 h-full w-full border-0"
          title="Live Mobile Portfolio Preview"
        />
      </div>
    </div>
  );
}
