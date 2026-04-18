import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  info?: string;
}

import { Info } from "lucide-react";

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, info, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || (label ? `input-${generatedId}` : undefined);

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <div className="flex items-center gap-1.5">
            <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
              {label}
            </label>
            {info && (
              <div className="group relative flex items-center z-50">
                <Info className="h-4 w-4 text-text-secondary opacity-60 hover:opacity-100 transition-opacity cursor-help" />
                <div className="pointer-events-none absolute left-1/2 bottom-full mb-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity w-[200px] rounded-xl border border-border bg-surface-high p-2.5 text-xs leading-relaxed text-text-primary shadow-2xl text-center">
                  {info}
                  <div className="absolute left-1/2 top-full -translate-x-1/2 border-[5px] border-transparent border-t-surface-high drop-shadow-md" />
                </div>
              </div>
            )}
          </div>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "flex h-11 w-full rounded-[var(--radius-md)] border border-border bg-surface-low px-4 py-2 text-sm text-text-primary transition-all duration-300",
              "placeholder:text-text-secondary",
              "focus:border-primary/60 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:shadow-[0_0_20px_var(--color-primary-glow)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500/50 focus:border-red-500/80 focus:ring-red-500/10",
              className
            )}
            {...props}
          />
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
