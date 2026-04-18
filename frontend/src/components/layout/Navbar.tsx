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
  Sparkles
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Navbar() {
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            <>
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link href="/dashboard">
                    <Button variant="ghost" className="gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/dashboard/resume">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create New
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="gap-2 bg-primary text-white hover:bg-primary/90">
                      <Sparkles className="h-4 w-4" />
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-4 md:hidden">
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
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard/resume" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    Create New
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Sign In</Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full justify-start gap-2">
                    <Sparkles className="h-4 w-4" />
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
