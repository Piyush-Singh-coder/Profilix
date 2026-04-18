"use client";

import { Calendar, GraduationCap, Trash2 } from "lucide-react";
import { Education } from "@/types";
import { SortableItem } from "@/components/ui/SortableItem";
import { Button } from "@/components/ui/Button";

interface EducationCardProps {
  education: Education;
  onEdit: (education: Education) => void;
  onDelete: (id: string) => void;
}

function formatMonthYear(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatDateRange(startDate: string, endDate: string | null, isCurrent: boolean): string {
  const start = formatMonthYear(startDate);
  const end = isCurrent || !endDate ? "Present" : formatMonthYear(endDate);
  return `${start} - ${end}`;
}

export default function EducationCard({ education, onEdit, onDelete }: EducationCardProps) {
  const subtitle = [education.degree, education.fieldOfStudy].filter(Boolean).join(", ");

  return (
    <SortableItem id={education.id}>
      <div className="pr-7 sm:pr-9">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-lg font-bold text-text-primary overflow-hidden text-ellipsis whitespace-normal sm:whitespace-nowrap sm:truncate">{education.school}</h3>
            {subtitle ? (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary min-w-0">
                <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{subtitle}</span>
              </p>
            ) : null}
            <p className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
              <Calendar className="h-3 w-3 shrink-0" />
              {formatDateRange(education.startDate, education.endDate, education.isCurrent)}
            </p>
            {education.description ? (
              <p className="mt-2 line-clamp-2 text-sm text-text-secondary break-words">{education.description}</p>
            ) : null}
          </div>
        </div>

        {education.bullets && education.bullets.length > 0 ? (
          <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-text-secondary break-words">
            {education.bullets.slice(0, 3).map((bullet, index) => (
              <li key={`${education.id}-bullet-${index}`}>{bullet}</li>
            ))}
            {education.bullets.length > 3 ? (
              <li className="text-text-secondary/60">+{education.bullets.length - 3} more</li>
            ) : null}
          </ul>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(education)}>
            Edit
          </Button>
          <button
            type="button"
            onClick={() => onDelete(education.id)}
            className="inline-flex items-center gap-1 rounded-full border border-danger/30 px-2.5 py-1 text-[11px] sm:px-3 sm:text-xs text-danger transition-colors hover:bg-danger/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>
    </SortableItem>
  );
}

