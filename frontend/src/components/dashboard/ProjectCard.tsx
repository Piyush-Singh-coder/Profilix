"use client";

import { ExternalLink, ExternalLinkIcon, Pin, Trash2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Project } from "@/types";
import { SortableItem } from "@/components/ui/SortableItem";
import { Button } from "@/components/ui/Button";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onTogglePin: (projectId: string) => void;
}

export default function ProjectCard({ project, onEdit, onDelete, onTogglePin }: ProjectCardProps) {
  return (
    <SortableItem id={project.id}>
      <div className="pr-7 sm:pr-9">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-lg font-bold text-text-primary overflow-hidden text-ellipsis whitespace-normal sm:whitespace-nowrap sm:truncate">{project.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-text-secondary break-words">
              {project.description}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onTogglePin(project.id)}
              className={`rounded-lg p-2 transition-colors ${
                project.isPinned ? "bg-primary/10 text-primary" : "text-text-secondary hover:bg-surface-high"
              }`}
              aria-label="Toggle pin"
            >
              <Pin className={`h-4 w-4 ${project.isPinned ? "fill-current" : ""}`} />
            </button>
            <Button size="sm" variant="outline" onClick={() => onEdit(project)}>
              Edit
            </Button>
          </div>
        </div>

        {project.bullets && project.bullets.length > 0 ? (
          <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-text-secondary break-words">
            {project.bullets.slice(0, 3).map((bullet, index) => (
              <li key={`${project.id}-bullet-${index}`}>{bullet}</li>
            ))}
          </ul>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] sm:px-3 sm:text-xs text-text-secondary transition-colors hover:border-primary/30 hover:text-primary"
            >
              <FaGithub className="h-3.5 w-3.5" />
              Repo
            </a>
          ) : null}
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] sm:px-3 sm:text-xs text-text-secondary transition-colors hover:border-primary/30 hover:text-primary"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live
            </a>
          ) : null}
          {project.videoUrl ? (
            <a
              href={project.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] sm:px-3 sm:text-xs text-text-secondary transition-colors hover:border-primary/30 hover:text-primary"
            >
              <ExternalLinkIcon className="h-3.5 w-3.5" />
              Video
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => onDelete(project.id)}
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
