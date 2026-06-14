"use client";

import React, { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Info, Eye, EyeOff } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  info?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, info, id, type, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || (label ? `input-${generatedId}` : undefined);
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <div className="flex items-center gap-1.5">
            <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
              {label}
            </label>
            {info && (
              <button type="button" className="group relative flex items-center z-50 focus:outline-none">
                <Info className="h-4 w-4 text-text-secondary opacity-60 hover:opacity-100 group-focus:opacity-100 transition-opacity cursor-help" />
                <div className="pointer-events-none absolute left-1/2 bottom-full mb-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity w-[200px] rounded-xl border border-border bg-surface-high p-2.5 text-xs leading-relaxed text-text-primary shadow-2xl text-center">
                  {info}
                  <div className="absolute left-1/2 top-full -translate-x-1/2 border-[5px] border-transparent border-t-surface-high drop-shadow-md" />
                </div>
              </button>
            )}
          </div>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type={inputType}
            className={cn(
              "flex h-11 w-full rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-2 text-sm text-[var(--color-text-primary)] transition-all duration-300",
              "placeholder:text-text-muted",
              "focus:border-[var(--input-focus)] focus:outline-none focus:ring-4 focus:ring-[var(--input-focus)]/10 focus:shadow-[0_0_25px_var(--input-focus-glow)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              isPassword && "pr-10",
              error && "border-red-500/50 focus:border-red-500/80 focus:ring-red-500/10",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        {error ? (
          <p className="text-xs font-medium text-red-500 mt-1">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-text-secondary">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";
