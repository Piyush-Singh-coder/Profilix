"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { MoveLeft, LayoutDashboard, Home } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    checkAuth().finally(() => setIsLoaded(true));
  }, [checkAuth]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150" />
        <Link href="/">
          <Logo 
            size={120} 
            className="relative h-24 w-24 transition-transform hover:scale-110 duration-500" 
            priority 
          />
        </Link>
      </div>

      <div className="max-w-md space-y-6">
        <h1 className="font-heading text-8xl font-black tracking-tighter text-text-primary/10 select-none">
          404
        </h1>
        
        <div className="space-y-3">
          <h2 className="font-heading text-3xl font-bold text-text-primary tracking-tight">
            Lost in Space?
          </h2>
          <p className="text-text-secondary leading-relaxed">
            The profile or page you're looking for doesn't exist or has been moved to a new portfolio.
          </p>
        </div>

        <div className="pt-8">
          {isLoaded && (
            <Link
              href={isAuthenticated ? "/dashboard" : "/"}
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-4 font-heading font-bold text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isAuthenticated ? (
                <>
                  <LayoutDashboard className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                  Go to Dashboard
                </>
              ) : (
                <>
                  <Home className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                  Back to Home
                </>
              )}
            </Link>
          )}
          
          <div className="mt-8">
            <Link 
              href="javascript:history.back()"
              className="text-sm font-medium text-text-secondary hover:text-primary transition-colors flex items-center justify-center gap-2 group"
            >
              <MoveLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Go back to previous page
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Decoration */}
      <p className="absolute bottom-8 text-[10px] uppercase tracking-[0.2em] text-text-secondary/40 font-bold">
        Error Code: ERR_PAGE_NOT_FOUND_PROFILIX
      </p>
    </div>
  );
}
