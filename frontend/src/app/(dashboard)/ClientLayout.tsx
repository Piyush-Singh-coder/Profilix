"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isBooting, setIsBooting] = useState(true);

  const { isAuthenticated, isLoading: isAuthLoading, checkAuth } = useAuthStore();
  const { profile, fetchProfile, fetchProfileCompleteness, isLoading: isProfileLoading } = useProfileStore();

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
      fetchProfileCompleteness();
    }
  }, [isAuthenticated, fetchProfile, fetchProfileCompleteness]);

  if (isLoading || !isAuthenticated) {
    return <LoadingScreen message="Initializing your dashboard..." />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />

      <div className="relative flex flex-1 min-w-0 overflow-hidden">
        <div className="h-full flex-1 overflow-y-auto block min-w-0 w-full">
          <main className="mx-auto h-full w-full max-w-5xl px-5 pb-[88px] pt-6 md:px-8 md:pb-8 md:pt-8 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
