"use client";

import { LucideIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
  icon?: LucideIcon;
  className?: string;
}

export function DashboardHeader({
  title,
  subtitle,
  badge,
  icon: Icon = Sparkles,
  className,
}: DashboardHeaderProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-12 mb-8",
      className
    )}>
      <div className="relative z-10 space-y-4">
        {badge && (
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-wider">
            <Icon className="h-3.5 w-3.5" />
            <span>{badge}</span>
          </div>
        )}
        <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl text-text-primary">
          {title}
        </h1>
        <p className="max-w-2xl text-lg text-text-secondary leading-relaxed">
          {subtitle}
        </p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl opacity-60" />
      <div className="absolute -bottom-20 left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl opacity-60" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] [mask-image:linear-gradient(to_bottom,white,transparent)]" 
           style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
    </div>
  );
}
