"use client";

import { Trash2, MapPin, Calendar, Building2 } from "lucide-react";
import { Experience } from "@/types";
import { SortableItem } from "@/components/ui/SortableItem";
import { Button } from "@/components/ui/Button";

interface ExperienceCardProps {
  experience: Experience;
  onEdit: (experience: Experience) => void;
  onDelete: (id: string) => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatDateRange(startDate: string, endDate: string | null, isCurrent: boolean): string {
  const start = formatDate(startDate);
  const end = isCurrent || !endDate ? "Present" : formatDate(endDate);
  return `${start} - ${end}`;
}

export default function ExperienceCard({ experience, onEdit, onDelete }: ExperienceCardProps) {
  return (
    <SortableItem id={experience.id}>
      <div className="pr-7 sm:pr-9">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-lg font-bold text-text-primary overflow-hidden text-ellipsis whitespace-normal sm:whitespace-nowrap sm:truncate">
              {experience.role}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary min-w-0">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{experience.company}</span>
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-text-secondary">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 shrink-0" />
                {formatDateRange(experience.startDate, experience.endDate, experience.isCurrent)}
              </span>
              {experience.location && (
                <span className="flex items-center gap-1 min-w-0">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{experience.location}</span>
                </span>
              )}
            </div>
            {experience.description && (
              <p className="mt-2 line-clamp-2 text-sm text-text-secondary break-words">
                {experience.description}
              </p>
            )}
          </div>
          {experience.logoUrl && (
            <img
              src={experience.logoUrl}
              alt={experience.company}
              className="h-12 w-12 rounded-md object-contain border border-border bg-surface-low"
            />
          )}
        </div>

        {experience.bullets && experience.bullets.length > 0 && (
          <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-text-secondary break-words">
            {experience.bullets.slice(0, 3).map((bullet, index) => (
              <li key={`${experience.id}-bullet-${index}`}>{bullet}</li>
            ))}
            {experience.bullets.length > 3 && (
              <li className="text-text-secondary/60">
                +{experience.bullets.length - 3} more
              </li>
            )}
          </ul>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(experience)}>
            Edit
          </Button>
          <button
            type="button"
            onClick={() => onDelete(experience.id)}
            className="inline-flex items-center gap-1 rounded-full border border-danger/30 px-3 py-1 text-xs text-danger transition-colors hover:bg-danger/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>
    </SortableItem>
  );
}
