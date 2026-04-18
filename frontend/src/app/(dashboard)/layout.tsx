"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import LivePreview from "@/components/dashboard/LivePreview";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";

import { LoadingScreen } from "@/components/ui/LoadingScreen";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isBooting, setIsBooting] = useState(true);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const { isAuthenticated, isLoading: isAuthLoading, checkAuth } = useAuthStore();
  const { profile, fetchProfile, isLoading: isProfileLoading } = useProfileStore();

  const isLoading = useMemo(
    () => isBooting || isAuthLoading || (isAuthenticated && isProfileLoading && !profile),
    [isBooting, isAuthLoading, isAuthenticated, isProfileLoading, profile]
  );

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      setIsBooting(false);
    };
    init();
  }, [checkAuth]);

  useEffect(() => {
    if (!isBooting && !isAuthLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isBooting, isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, fetchProfile]);

  useEffect(() => {
    if (!profile?.theme) return;
    document.documentElement.setAttribute("data-theme", profile.theme);
  }, [profile?.theme]);

  if (isLoading || !isAuthenticated) {
    return <LoadingScreen message="Initializing your dashboard..." />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />

      <div className="relative flex flex-1">
        <div className={`h-full flex-1 overflow-y-auto ${showMobilePreview ? "hidden lg:block" : "block"}`}>
          <main className="mx-auto h-full w-full max-w-4xl px-5 pb-[88px] pt-6 md:px-8 md:pb-8 md:pt-8">
            {children}
          </main>
        </div>

        <aside
          className={`h-full w-full border-l border-border bg-surface-high/40 lg:relative lg:block lg:w-[460px] xl:w-[520px] ${
            showMobilePreview ? "absolute inset-0 z-40 block backdrop-blur-xl" : "hidden"
          }`}
        >
          <div className="flex h-full items-center justify-center p-6">
            <LivePreview />
          </div>
        </aside>

        <div className="fixed bottom-[90px] right-5 z-50 md:hidden">
          <Button
            className="h-14 w-14 rounded-full p-0 shadow-2xl"
            onClick={() => setShowMobilePreview((prev) => !prev)}
          >
            {showMobilePreview ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
