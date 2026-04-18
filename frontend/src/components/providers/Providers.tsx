"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const { checkAuth, user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // 1. Initialize Auth on Mount
  useEffect(() => {
    checkAuth();
    setMounted(true);
  }, [checkAuth]);

  // 2. Sync Theme to DOM
  useEffect(() => {
    if (!mounted) return;

    // Default theme for visitors or if no theme selected
    let activeTheme = "SKEUOMORPHIC";

    if (isAuthenticated && user?.selectedTheme) {
      activeTheme = user.selectedTheme;
    }

    // Apply to html element
    document.documentElement.setAttribute("data-theme", activeTheme);
  }, [mounted, isAuthenticated, user?.selectedTheme]);

  return (
    <>
      {children}
    </>
  );
}
