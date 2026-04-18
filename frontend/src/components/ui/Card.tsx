import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "surface" | "outline" | "brutal";
}

const cardVariants: Record<NonNullable<CardProps["variant"]>, string> = {
  glass: "glass-panel",
  surface: "surface-panel",
  outline: "border border-border bg-surface/80",
  brutal: "bg-surface theme-brutal-card",
};

export function Card({ className, variant = "surface", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] p-4 sm:p-6 transition-colors",
        cardVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-5 flex flex-col gap-1.5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-bold text-text-primary", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-text-secondary", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-5 flex items-center justify-end gap-3", className)} {...props} />;
}
