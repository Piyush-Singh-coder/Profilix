"use client";

import { ExternalLink, Trash2, Calendar, Building2 } from "lucide-react";
import { Achievement } from "@/types";
import { SortableItem } from "@/components/ui/SortableItem";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface AchievementCardProps {
  achievement: Achievement;
  onEdit: (achievement: Achievement) => void;
  onDelete: (id: string) => void;
}

const TYPE_COLORS: Record<string, string> = {
  HACKATHON: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  COMPETITION: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  CERTIFICATE: "bg-green-500/10 text-green-400 border-green-500/30",
  AWARD: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  OTHER: "bg-gray-500/10 text-gray-400 border-gray-500/30",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function AchievementCard({ achievement, onEdit, onDelete }: AchievementCardProps) {
  return (
    <SortableItem id={achievement.id}>
      <div className="pr-7 sm:pr-9">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-heading text-lg font-bold text-text-primary overflow-hidden text-ellipsis whitespace-normal sm:whitespace-nowrap sm:truncate">
                {achievement.title}
              </h3>
              <Badge className={TYPE_COLORS[achievement.type]}>
                {achievement.type}
              </Badge>
            </div>
            {achievement.provider && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{achievement.provider}</span>
              </p>
            )}
            {achievement.date && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
                <Calendar className="h-3 w-3 shrink-0" />
                {formatDate(achievement.date)}
              </p>
            )}
            {achievement.description && (
              <p className="mt-2 line-clamp-2 text-sm text-text-secondary break-words">
                {achievement.description}
              </p>
            )}
          </div>
          {achievement.imageUrl && (
            <img
              src={achievement.imageUrl}
              alt={achievement.title}
              className="h-16 w-16 rounded-md object-cover border border-border"
            />
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {achievement.url && (
            <a
              href={achievement.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-text-secondary transition-colors hover:border-primary/30 hover:text-primary"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View
            </a>
          )}
          <Button size="sm" variant="outline" onClick={() => onEdit(achievement)}>
            Edit
          </Button>
          <button
            type="button"
            onClick={() => onDelete(achievement.id)}
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
