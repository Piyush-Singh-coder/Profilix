import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  info?: string;
}

import { Info } from "lucide-react";

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, info, id, rows = 4, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || (label ? `textarea-${generatedId}` : undefined);

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <div className="flex items-center gap-1.5">
            <label htmlFor={textareaId} className="text-sm font-medium text-text-secondary">
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
        ) : null}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={cn(
            "w-full rounded-[var(--radius-md)] border border-border bg-surface-low px-4 py-3 text-sm text-text-primary transition-all duration-300",
            "placeholder:text-text-secondary",
            "focus:border-primary/60 focus:outline-none focus:ring-4 focus:ring-primary/10",
            "disabled:cursor-not-allowed disabled:opacity-60",
            error && "border-danger/60 focus:border-danger/80 focus:ring-danger/10",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs font-medium text-danger">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-text-secondary">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
