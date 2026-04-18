"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  info?: string;
  className?: string;
  layout?: "horizontal" | "vertical";
}

export function Switch({
  checked,
  onCheckedChange,
  disabled,
  label,
  description,
  info,
  className,
  layout = "horizontal",
}: SwitchProps) {
  const isVertical = layout === "vertical";

  return (
    <label className={cn(
      "flex cursor-pointer gap-4",
      isVertical ? "flex-col items-start gap-1.5" : "items-start justify-between",
      disabled && "cursor-not-allowed opacity-60", 
      className
    )}>
      <div className={cn(isVertical && "w-full")}>
        {label ? (
          <div className="flex items-center gap-1.5">
            <p className={cn(
              "text-sm",
              isVertical ? "font-medium text-text-secondary" : "font-semibold text-text-primary"
            )}>
              {label}
            </p>
            {info && (
                <div className="pointer-events-none absolute left-1/2 bottom-full mb-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity w-[200px] rounded-xl border border-border bg-surface-high p-2.5 text-xs leading-relaxed text-text-primary shadow-2xl text-center">
                  {info}
                  <div className="absolute left-1/2 top-full -translate-x-1/2 border-[5px] border-transparent border-t-surface-high drop-shadow-md" />
                </div>
            )}
          </div>
        ) : null}
        {description ? <p className="text-xs text-text-secondary mt-0.5">{description}</p> : null}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault(); // Prevent double toggling since parent is a label
          onCheckedChange(!checked);
        }}
        className={cn(
          "relative inline-flex h-7 w-12 items-center rounded-full border transition-all",
          isVertical && "mt-auto", // Keep it at the bottom if needed
          checked
            ? "border-primary/40 bg-primary/25 shadow-[0_0_20px_var(--color-primary-glow)]"
            : "border-border bg-surface-low"
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </label>
  );
}
