"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function Checkbox({ checked, onCheckedChange, disabled, label, className }: CheckboxProps) {
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-2 text-sm", disabled && "cursor-not-allowed opacity-60", className)}>
      <button
        type="button"
        aria-pressed={checked}
        onClick={() => onCheckedChange(!checked)}
        disabled={disabled}
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-[6px] border transition-colors",
          checked ? "border-primary bg-primary text-white" : "border-border bg-surface-low text-transparent"
        )}
      >
        <Check className="h-3.5 w-3.5" />
      </button>
      {label ? <span className="text-text-secondary">{label}</span> : null}
    </label>
  );
}
