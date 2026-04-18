"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import EducationCard from "@/components/dashboard/EducationCard";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import { useEducationStore } from "@/store/useEducationStore";
import { Education } from "@/types";

interface EducationFormState {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  bullets: string;
}

const EMPTY_FORM: EducationFormState = {
  school: "",
  degree: "",
  fieldOfStudy: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  bullets: "",
};

export default function EducationPage() {
  const { educations, isLoading, isSaving, fetchEducations, createEducation, updateEducation, deleteEducation } =
    useEducationStore();

  const [educationOrder, setEducationOrder] = useState<Education[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [formState, setFormState] = useState<EducationFormState>(EMPTY_FORM);

  useEffect(() => {
    fetchEducations();
  }, [fetchEducations]);

  useEffect(() => {
    setEducationOrder([...educations].sort((a, b) => a.displayOrder - b.displayOrder));
  }, [educations]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const orderedIds = useMemo(() => educationOrder.map((education) => education.id), [educationOrder]);

  const openCreateModal = () => {
    setEditingEducation(null);
    setFormState(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (education: Education) => {
    setEditingEducation(education);
    setFormState({
      school: education.school || "",
      degree: education.degree || "",
      fieldOfStudy: education.fieldOfStudy || "",
      startDate: education.startDate ? education.startDate.split("T")[0] : "",
      endDate: education.endDate ? education.endDate.split("T")[0] : "",
      isCurrent: education.isCurrent || false,
      description: education.description || "",
      bullets: (education.bullets || []).join("\n"),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const payloadBullets = formState.bullets
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (payloadBullets.length > 10) {
      toast.error("Maximum 10 bullet points allowed");
      return;
    }

    const payload = {
      school: formState.school.trim(),
      degree: formState.degree.trim() || undefined,
      fieldOfStudy: formState.fieldOfStudy.trim() || undefined,
      startDate: formState.startDate,
      endDate: formState.isCurrent ? undefined : formState.endDate || undefined,
      isCurrent: formState.isCurrent,
      description: formState.description.trim() || undefined,
      bullets: payloadBullets.length > 0 ? payloadBullets : undefined,
    };

    if (!payload.school) {
      toast.error("School is required");
      return;
    }

    if (!payload.startDate) {
      toast.error("Start date is required");
      return;
    }

    try {
      if (editingEducation) {
        await updateEducation(editingEducation.id, payload);
        toast.success("Education updated");
      } else {
        await createEducation(payload);
        toast.success("Education created");
      }
      setIsModalOpen(false);
      setFormState(EMPTY_FORM);
      setEditingEducation(null);
    } catch {
      toast.error("Failed to save education");
    }
  };

  const handleDelete = async (educationId: string) => {
    if (!window.confirm("Delete this education entry?")) return;
    try {
      await deleteEducation(educationId);
      toast.success("Education deleted");
    } catch {
      toast.error("Failed to delete education");
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedIds.indexOf(String(active.id));
    const newIndex = orderedIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    const previousOrder = educationOrder;
    const nextOrder = arrayMove(educationOrder, oldIndex, newIndex);
    setEducationOrder(nextOrder);

    try {
      for (let index = 0; index < nextOrder.length; index += 1) {
        const edu = nextOrder[index];
        if (edu.displayOrder !== index) {
          await updateEducation(edu.id, { displayOrder: index });
        }
      }
      toast.success("Education order updated");
    } catch {
      setEducationOrder(previousOrder);
      toast.error("Failed to reorder education");
    }
  };

  if (isLoading && educationOrder.length === 0) {
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
          <h1 className="font-heading text-3xl font-bold">Education</h1>
          <p className="mt-1 text-sm text-text-secondary">Add academic history and drag cards to control display order.</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          New Education
        </Button>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Education List</CardTitle>
          <CardDescription>Drag any card by the handle to reorder.</CardDescription>
        </CardHeader>
        <CardContent>
          {educationOrder.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-12 text-center">
              <p className="text-sm text-text-secondary">No education yet. Add your first school to get started.</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={orderedIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {educationOrder.map((education) => (
                    <EducationCard
                      key={education.id}
                      education={education}
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
        title={editingEducation ? "Edit Education" : "Create Education"}
        description="Add your academic background, coursework highlights, or honors."
      >
        <div className="grid gap-4">
          <Input
            label="School"
            value={formState.school}
            onChange={(event) => setFormState((prev) => ({ ...prev, school: event.target.value }))}
            placeholder="University of Example"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Degree"
              value={formState.degree}
              onChange={(event) => setFormState((prev) => ({ ...prev, degree: event.target.value }))}
              placeholder="B.S."
            />
            <Input
              label="Field of Study"
              value={formState.fieldOfStudy}
              onChange={(event) => setFormState((prev) => ({ ...prev, fieldOfStudy: event.target.value }))}
              placeholder="Computer Science"
            />
          </div>
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
            label="Currently Enrolled"
          />
          <Textarea
            label="Description"
            value={formState.description}
            onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
            rows={3}
            placeholder="Brief summary (GPA, honors, relevant coursework, etc.)"
          />
          <Textarea
            label="Bullet Points"
            value={formState.bullets}
            onChange={(event) => setFormState((prev) => ({ ...prev, bullets: event.target.value }))}
            rows={4}
            helperText="One bullet per line. Max 10 bullets."
            placeholder={"Dean's List (3 semesters)\nRelevant coursework: Distributed Systems, ML\nTeaching Assistant for Data Structures"}
          />
          <div className="mt-2 flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isSaving}>
              {editingEducation ? "Update Education" : "Create Education"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

