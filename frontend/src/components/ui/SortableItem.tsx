"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function SortableItem({ id, children, className }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative rounded-[var(--radius-md)] border border-border bg-surface p-3 sm:p-4",
        isDragging && "z-20 border-primary shadow-[0_0_0_1px_var(--color-primary)]",
        className
      )}
    >
      <button
        type="button"
        className="absolute right-2 top-2 sm:right-3 sm:top-3 rounded-md p-1 text-text-secondary transition-colors hover:bg-surface-high hover:text-text-primary"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      {children}
    </div>
  );
}
