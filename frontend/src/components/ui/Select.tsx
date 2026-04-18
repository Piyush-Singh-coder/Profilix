import React, { useState, useRef, useEffect, useId } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const selectId = label ? `select-${generatedId}` : undefined;

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("flex w-full flex-col gap-1.5 relative", isOpen && "z-50")} ref={containerRef}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          id={selectId}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-[var(--radius-md)] border border-border bg-surface-low px-4 py-2 text-sm text-text-primary transition-all duration-200",
            isOpen && "border-primary/60 ring-4 ring-primary/10 shadow-[0_0_20px_var(--color-primary-glow)]",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
        >
          <span className={selectedOption ? "text-text-primary" : "text-text-secondary"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn("h-4 w-4 text-text-secondary transition-transform duration-200", isOpen && "rotate-180")}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 top-[calc(100%+8px)] z-50 max-h-60 w-full overflow-y-auto rounded-[var(--radius-md)] border border-border bg-surface-high p-1 shadow-2xl animate-in fade-in zoom-in-95">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors",
                  value === option.value
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-text-primary hover:bg-surface-low hover:text-text-primary"
                )}
              >
                {option.label}
                {value === option.value && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
