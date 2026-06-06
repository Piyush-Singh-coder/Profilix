"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
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
  bullets: string;
}

const EMPTY_FORM: ExperienceFormState = {
  company: "",
  role: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  bullets: "",
};

export function ExperienceEditor() {
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
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
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
      description: undefined, // description field removed from UI
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

  const moveExperience = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experienceOrder.length) return;

    const previousOrder = experienceOrder;
    const nextOrder = arrayMove(experienceOrder, index, targetIndex);
    setExperienceOrder(nextOrder);

    try {
      const updates = nextOrder.map((exp, idx) => ({ id: exp.id, displayOrder: idx }));
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
    <div className="animate-in space-y-8">
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
                  {experienceOrder.map((experience, index) => (
                    <ExperienceCard
                      key={experience.id}
                      experience={experience}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                      onMove={(dir) => moveExperience(index, dir)}
                      isFirst={index === 0}
                      isLast={index === experienceOrder.length - 1}
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
        <div className="space-y-8 py-2">
          {/* Section: Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Plus className="h-4 w-4" />
              <h4 className="text-sm font-bold uppercase tracking-wider">Basic Information</h4>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Company Name"
                value={formState.company}
                onChange={(event) => setFormState((prev) => ({ ...prev, company: event.target.value }))}
                placeholder="Google, Microsoft, etc."
                required
              />
              <Input
                label="Your Role"
                value={formState.role}
                onChange={(event) => setFormState((prev) => ({ ...prev, role: event.target.value }))}
                placeholder="Senior Software Engineer"
                info="E.g., Senior Software Engineer. Be specific to stand out."
                required
              />
            </div>
            <Input
              label="Location"
              value={formState.location}
              onChange={(event) => setFormState((prev) => ({ ...prev, location: event.target.value }))}
              placeholder="San Francisco, CA (Remote)"
            />
          </div>

          {/* Section: Timeline */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-primary">
              <Plus className="h-4 w-4" />
              <h4 className="text-sm font-bold uppercase tracking-wider">Timeline</h4>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Start Date"
                type="date"
                value={formState.startDate}
                onChange={(event) => setFormState((prev) => ({ ...prev, startDate: event.target.value }))}
                required
              />
              <Input
                label="End Date"
                type="date"
                value={formState.endDate}
                onChange={(event) => setFormState((prev) => ({ ...prev, endDate: event.target.value }))}
                disabled={formState.isCurrent}
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border/50 bg-surface-low p-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-text-primary">Current Position</p>
                <p className="text-xs text-text-secondary">Mark this if you are still working here.</p>
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
              />
            </div>
          </div>

          {/* Section: Details */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-primary">
              <Plus className="h-4 w-4" />
              <h4 className="text-sm font-bold uppercase tracking-wider">Impact & Details</h4>
            </div>
            <Textarea
              label="Key Achievements (Bullets)"
              value={formState.bullets}
              onChange={(event) => setFormState((prev) => ({ ...prev, bullets: event.target.value }))}
              rows={5}
              placeholder={"Led a team of 5 engineers\nImproved system performance by 40%\nShipped 3 major features"}
              helperText="One bullet per line. Max 10 bullets."
              info="Quantify your impact where possible. E.g., 'Reduced costs by 20% by optimizing infra'."
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/50">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              isLoading={isSaving}
              className="min-w-[140px] shadow-lg shadow-primary/20"
            >
              {editingExperience ? "Save Changes" : "Create Experience"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
