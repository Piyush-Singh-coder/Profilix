"use client";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

interface LoadingScreenProps {
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

export function LoadingScreen({ 
  message = "Crafting your professional identity...", 
  className,
  fullScreen = true
}: LoadingScreenProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center bg-background p-6 transition-all duration-500",
      fullScreen ? "fixed inset-0 z-[9999]" : "h-full w-full min-h-[400px]",
      className
    )}>
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10" />
      
      <div className="relative mb-12 animate-pulse">
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
        <Logo 
          size={180} 
          className="relative drop-shadow-2xl h-32 w-32 md:h-40 md:w-40" 
          priority 
        />
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-xs">
        <div className="w-full h-1 bg-surface-high rounded-full overflow-hidden border border-border/10">
          <div className="h-full w-2/3 bg-gradient-to-r from-transparent via-[#0EB3BA] to-transparent animate-shimmer" 
               style={{ backgroundSize: '200% 100%' }} />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <p className="font-heading text-xl font-bold tracking-tight text-text-primary">
            Profilix
          </p>
          <p className="text-sm text-text-secondary/60 font-medium animate-pulse">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
