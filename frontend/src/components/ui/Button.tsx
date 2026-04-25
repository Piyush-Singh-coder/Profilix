import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", isLoading, children, disabled, ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium font-heading transition-all duration-300 ease-out active:scale-95 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      primary:
        "bg-[var(--color-primary)] text-white shadow-[0_0_20px_var(--color-primary-glow)] hover:brightness-110 hover:shadow-[0_0_30px_var(--color-primary-glow)]",
      secondary:
        "bg-[var(--color-secondary)] text-[var(--color-background)] hover:opacity-90",
      ghost:
        "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-high)]",
      outline:
        "border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:shadow-[0_0_20px_var(--color-primary-glow)]",
      danger:
        "bg-[var(--color-danger)] text-white hover:brightness-110",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm rounded-[var(--radius-sm)]",
      md: "h-11 px-6 text-base rounded-[var(--radius-sm)]",
      lg: "h-14 px-8 text-lg rounded-[var(--radius-sm)]",
      icon: "h-11 w-11 rounded-[var(--radius-sm)]",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
