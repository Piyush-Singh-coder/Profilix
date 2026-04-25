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
import ExperienceCard from "@/components/dashboard/ExperienceCard";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import { useExperienceStore } from "@/store/useExperienceStore";
import { Experience } from "@/types";

interface ExperienceFormState {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  bullets: string;
}

const EMPTY_FORM: ExperienceFormState = {
  company: "",
  role: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  bullets: "",
};

export default function ExperiencesPage() {
  const {
    experiences,
    isLoading,
    isSaving,
    fetchExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
  } = useExperienceStore();

  const [experienceOrder, setExperienceOrder] = useState<Experience[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [formState, setFormState] = useState<ExperienceFormState>(EMPTY_FORM);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  useEffect(() => {
    setExperienceOrder([...experiences].sort((a, b) => a.displayOrder - b.displayOrder));
  }, [experiences]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const orderedIds = useMemo(() => experienceOrder.map((experience) => experience.id), [experienceOrder]);

  const openCreateModal = () => {
    setEditingExperience(null);
    setFormState(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (experience: Experience) => {
    setEditingExperience(experience);
    setFormState({
      company: experience.company || "",
      role: experience.role || "",
      location: experience.location || "",
      startDate: experience.startDate ? experience.startDate.split("T")[0] : "",
      endDate: experience.endDate ? experience.endDate.split("T")[0] : "",
      isCurrent: experience.isCurrent || false,
      description: experience.description || "",
      bullets: (experience.bullets || []).join("\n"),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const rawBullets = formState.bullets
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line) => line.length > 0);

    if (rawBullets.length > 10) {
      toast.error("Maximum 10 bullet points allowed");
      return;
    }

    const bullets = rawBullets.slice(0, 10);

    const payload = {
      company: formState.company.trim(),
      role: formState.role.trim(),
      location: formState.location.trim() || undefined,
      startDate: formState.startDate,
      endDate: formState.isCurrent ? undefined : formState.endDate || undefined,
      isCurrent: formState.isCurrent,
      description: formState.description.trim() || undefined,
      bullets: bullets.length > 0 ? bullets : undefined,
    };

    if (!payload.company) {
      toast.error("Company is required");
      return;
    }

    if (!payload.role) {
      toast.error("Role is required");
      return;
    }

    if (!payload.startDate) {
      toast.error("Start date is required");
      return;
    }

    try {
      if (editingExperience) {
        await updateExperience(editingExperience.id, payload);
        toast.success("Experience updated");
      } else {
        await createExperience(payload);
        toast.success("Experience created");
      }
      setIsModalOpen(false);
      setFormState(EMPTY_FORM);
      setEditingExperience(null);
    } catch {
      toast.error("Failed to save experience");
    }
  };

  const handleDelete = async (experienceId: string) => {
    if (!window.confirm("Delete this experience?")) return;
    try {
      await deleteExperience(experienceId);
      toast.success("Experience deleted");
    } catch {
      toast.error("Failed to delete experience");
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedIds.indexOf(String(active.id));
    const newIndex = orderedIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    const previousOrder = experienceOrder;
    const nextOrder = arrayMove(experienceOrder, oldIndex, newIndex);
    // Optimistic update immediately for instant UI response
    setExperienceOrder(nextOrder);

    try {
      // Single parallel batch call instead of N sequential calls
      const updates = nextOrder.map((exp, index) => ({ id: exp.id, displayOrder: index }));
      await Promise.all(
        updates
          .filter((item) => {
            const original = previousOrder.find((e) => e.id === item.id);
            return original && original.displayOrder !== item.displayOrder;
          })
          .map(({ id, displayOrder }) => updateExperience(id, { displayOrder }))
      );
      toast.success("Experience order updated");
    } catch {
      setExperienceOrder(previousOrder);
      toast.error("Failed to reorder experiences");
    }
  };


  if (isLoading && experienceOrder.length === 0) {
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
          <h1 className="font-heading text-3xl font-bold">Experiences</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Document your work history and drag cards to control display order.
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          New Experience
        </Button>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Experience List</CardTitle>
          <CardDescription>
            Drag any card by the handle to reorder. Add bullet points to highlight key achievements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {experienceOrder.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-12 text-center">
              <p className="text-sm text-text-secondary">No experiences yet. Create your first one to get started.</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={orderedIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {experienceOrder.map((experience) => (
                    <ExperienceCard
                      key={experience.id}
                      experience={experience}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
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
        title={editingExperience ? "Edit Experience" : "Create Experience"}
        description="Add details about your role, responsibilities, and achievements."
      >
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Company"
              value={formState.company}
              onChange={(event) => setFormState((prev) => ({ ...prev, company: event.target.value }))}
              placeholder="Google, Microsoft, etc."
            />
            <Input
              label="Role"
              value={formState.role}
              onChange={(event) => setFormState((prev) => ({ ...prev, role: event.target.value }))}
              placeholder="Senior Software Engineer"
              info="E.g., Senior Software Engineer. Be specific to stand out on your resume."
            />
          </div>
          <Input
            label="Location"
            value={formState.location}
            onChange={(event) => setFormState((prev) => ({ ...prev, location: event.target.value }))}
            placeholder="San Francisco, CA (Remote)"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Start Date"
              type="date"
              value={formState.startDate}
              onChange={(event) => setFormState((prev) => ({ ...prev, startDate: event.target.value }))}
            />
            <Input
              label="End Date"
              type="date"
              value={formState.endDate}
              onChange={(event) => setFormState((prev) => ({ ...prev, endDate: event.target.value }))}
              disabled={formState.isCurrent}
            />
          </div>
          <Switch
            checked={formState.isCurrent}
            onCheckedChange={(checked) =>
              setFormState((prev) => ({
                ...prev,
                isCurrent: checked,
                endDate: checked ? "" : prev.endDate,
              }))
            }
            label="Current Position"
          />
          <Textarea
            label="Description"
            value={formState.description}
            onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
            rows={3}
            placeholder="Brief description of your role and responsibilities."
            info="A high level overview. Leave the detailed accomplishments for your bullets."
          />
          <Textarea
            label="Bullet Points"
            value={formState.bullets}
            onChange={(event) => setFormState((prev) => ({ ...prev, bullets: event.target.value }))}
            rows={4}
            helperText="One bullet per line. Max 10 bullets."
            placeholder={"Led a team of 5 engineers\nImproved system performance by 40%\nShipped 3 major features"}
            info="Recommended max 3 bullets for optimal resume and card rendering. Start with action verbs and quantify impact."
          />
          <div className="mt-2 flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isSaving}>
              {editingExperience ? "Update Experience" : "Create Experience"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
