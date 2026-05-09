"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const THEME_STORAGE_KEY = "profilix-theme";

/** Reads the stored theme preference and applies it to the <html> element immediately. */
function applyTheme(theme: string) {
  if (theme === "light") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const { checkAuth, user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // 1. On first mount, apply the stored theme immediately to prevent flash
  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) || "dark";
    applyTheme(stored);
    checkAuth();
    setMounted(true);
  }, [checkAuth]);

  // 2. Once auth resolves, sync the user's saved theme to the DOM and localStorage
  useEffect(() => {
    if (!mounted) return;

    let activeTheme = "dark"; // default for visitors

    if (isAuthenticated && user?.selectedTheme) {
      activeTheme = user.selectedTheme === "LIGHT" ? "light" : "dark";
    } else if (!isAuthenticated) {
      // Keep the stored preference for logged-out visitors
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) activeTheme = stored;
    }

    applyTheme(activeTheme);
    localStorage.setItem(THEME_STORAGE_KEY, activeTheme);
  }, [mounted, isAuthenticated, user?.selectedTheme]);

  return <>{children}</>;
}
