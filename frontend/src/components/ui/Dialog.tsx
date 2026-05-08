"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  className?: string;
  hideCloseButton?: boolean;
  children: React.ReactNode;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  className,
  hideCloseButton,
  children,
}: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydon own", onEsc);
    };
  }, [open, onOpenChange]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
          />
          
          {/* Dialog Content */}
          <motion.div
            className={cn(
              "relative z-[121] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-surface shadow-2xl shadow-primary/10",
              className
            )}
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border/50 p-6 md:p-8">
              <div className="space-y-1">
                {title ? (
                  <h3 className="font-heading text-2xl font-bold tracking-tight text-text-primary">
                    {title}
                  </h3>
                ) : null}
                {description ? (
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {description}
                  </p>
                ) : null}
              </div>
              {!hideCloseButton && (
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="rounded-full p-2 text-text-secondary transition-all hover:bg-primary/10 hover:text-primary active:scale-95"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

