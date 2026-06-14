"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";
import { 
  Plus, 
  LayoutDashboard, 
  Menu, 
  X, 
  LogOut, 
  Settings,
  Sparkles,
  Sun,
  Moon,
  Users
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { api } from "@/lib/api";

export function Navbar() {
  const { isAuthenticated, user, updateSelectedTheme } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Local isDark state — source of truth for unauthenticated users.
  // Initialised to match whatever is already set on the DOM (e.g. system preference / Providers).
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Read initial theme from DOM so we always start in sync
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    setIsDark(dark);
  }, []);

  // Keep local state in sync when the authenticated user's stored theme changes
  useEffect(() => {
    if (user?.selectedTheme) {
      setIsDark(user.selectedTheme === "DARK");
    }
  }, [user?.selectedTheme]);

  const handleThemeToggle = async () => {
    const newIsDark = !isDark;
    const newTheme = newIsDark ? "DARK" : "LIGHT";

    // 1. Update local toggle state immediately
    setIsDark(newIsDark);

    // 2. Apply to DOM immediately
    if (newIsDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    // 3. Update auth store (only works when user is not null, but we have local state as fallback)
    updateSelectedTheme(newTheme);

    // 4. Persist if authenticated
    if (isAuthenticated) {
      try {
        await api.put("/profile", { theme: newTheme });
      } catch (error) {
        console.error("Failed to persist theme change", error);
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-[var(--color-border)]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="group flex items-center">
          <Logo 
            size={125} 
            className="h-14 w-14" 
            priority
          />
          <span className="font-heading text-2xl font-bold tracking-tight text-text-primary">
            Profilix
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {mounted && (
            <button
              onClick={handleThemeToggle}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface-low text-text-secondary transition-all hover:border-primary/40 hover:text-primary"
              title="Toggle Theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          )}

          <Link href="/community">
            <Button variant="ghost" className="relative gap-2 text-text-primary hover:text-primary transition-all font-medium px-4.5 py-2.5 bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/45 rounded-xl">
              <Users className="h-4 w-4 text-primary" />
              Community
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </Button>
          </Link>

          {mounted && (
            <>
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button variant="ghost" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
              )}
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-4 md:hidden">
          {mounted && (
            <button
              onClick={handleThemeToggle}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface-low text-text-secondary transition-all"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 text-text-secondary hover:bg-surface-high transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-t border-border bg-surface/95 p-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-2">
            <Link href="/community" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-2 text-primary bg-primary/5 hover:bg-primary/10 border border-primary/25 rounded-xl">
                <Users className="h-4 w-4 text-primary" />
                Community Directory
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </Button>
            </Link>
            {isAuthenticated ? (
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
