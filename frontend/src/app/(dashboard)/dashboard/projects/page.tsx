"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import ProjectCard from "@/components/dashboard/ProjectCard";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useProjectStore } from "@/store/useProjectStore";
import { Project } from "@/types";

interface ProjectFormState {
  title: string;
  description: string;
  repoUrl: string;
  liveUrl: string;
  videoUrl: string;
  bullets: string;
}

const EMPTY_FORM: ProjectFormState = {
  title: "",
  description: "",
  repoUrl: "",
  liveUrl: "",
  videoUrl: "",
  bullets: "",
};

export default function ProjectsPage() {
  const {
    projects,
    isLoading,
    isSaving,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    togglePin,
    reorderProjects,
  } = useProjectStore();

  const [projectOrder, setProjectOrder] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formState, setFormState] = useState<ProjectFormState>(EMPTY_FORM);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    setProjectOrder(projects);
  }, [projects]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const orderedIds = useMemo(() => projectOrder.map((project) => project.id), [projectOrder]);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormState(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormState({
      title: project.title || "",
      description: project.description || "",
      repoUrl: project.repoUrl || "",
      liveUrl: project.liveUrl || "",
      videoUrl: project.videoUrl || "",
      bullets: (project.bullets || []).join("\n"),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const bullets = formState.bullets
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const payload = {
      title: formState.title.trim(),
      description: formState.description.trim() || undefined,
      repoUrl: formState.repoUrl.trim() || undefined,
      liveUrl: formState.liveUrl.trim() || undefined,
      videoUrl: formState.videoUrl.trim() || undefined,
      bullets: bullets.length > 0 ? bullets : undefined,
    };

    if (!payload.title) {
      toast.error("Project title is required");
      return;
    }

    try {
      if (editingProject) {
        await updateProject(editingProject.id, payload);
        toast.success("Project updated");
      } else {
        await createProject(payload);
        toast.success("Project created");
      }
      setIsModalOpen(false);
      setFormState(EMPTY_FORM);
      setEditingProject(null);
    } catch {
      toast.error("Failed to save project");
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProject(projectId);
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const handleTogglePin = async (projectId: string) => {
    try {
      await togglePin(projectId);
    } catch {
      toast.error("Failed to toggle pin. You can pin at most 3 projects.");
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedIds.indexOf(String(active.id));
    const newIndex = orderedIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    const nextOrder = arrayMove(projectOrder, oldIndex, newIndex);
    setProjectOrder(nextOrder);

    try {
      await reorderProjects(nextOrder.map((project) => project.id));
      toast.success("Project order updated");
    } catch {
      setProjectOrder(projects);
      toast.error("Failed to reorder projects");
    }
  };

  if (isLoading && projectOrder.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-in space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="font-heading text-3xl font-bold">Projects</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Build your showcase and drag cards to control display order.
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Project List</CardTitle>
          <CardDescription>
            Drag any card by the handle to reorder. Pinned projects always float to the top publicly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projectOrder.length === 0 ? (
            <div className="rounded-[var(--radius-md)] border border-dashed border-border p-12 text-center">
              <p className="text-sm text-text-secondary">No projects yet. Create your first one to get started.</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={orderedIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {projectOrder.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                      onTogglePin={handleTogglePin}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingProject ? "Edit Project" : "Create Project"}
        description="Provide links, context, and bullet points that explain impact."
      >
        <div className="grid gap-4">
          <Input
            label="Title"
            value={formState.title}
            onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Realtime Issue Tracker"
          />
          <Textarea
            label="Description"
            value={formState.description}
            onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
            rows={3}
            placeholder="One to two lines explaining this project."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Repository URL"
              value={formState.repoUrl}
              onChange={(event) => setFormState((prev) => ({ ...prev, repoUrl: event.target.value }))}
              placeholder="https://github.com/org/repo"
            />
            <Input
              label="Live URL"
              value={formState.liveUrl}
              onChange={(event) => setFormState((prev) => ({ ...prev, liveUrl: event.target.value }))}
              placeholder="https://app.example.com"
            />
          </div>
          <Input
            label="Demo Video URL"
            value={formState.videoUrl}
            onChange={(event) => setFormState((prev) => ({ ...prev, videoUrl: event.target.value }))}
            placeholder="https://youtube.com/watch?v=..."
          />
          <Textarea
            label="Bullet Points"
            value={formState.bullets}
            onChange={(event) => setFormState((prev) => ({ ...prev, bullets: event.target.value }))}
            rows={4}
            helperText="One bullet per line."
            placeholder={"Reduced API latency by 42%\nHandled 10k concurrent websocket users"}
            info="Recommended max 3 bullets. Detail specific technical challenges, integrations, or measurable impact."
          />
          <div className="mt-2 flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isSaving}>
              {editingProject ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
