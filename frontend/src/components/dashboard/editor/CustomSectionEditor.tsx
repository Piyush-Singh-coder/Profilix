"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Edit2, Trash2, HelpCircle, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
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
import { SortableItem } from "@/components/ui/SortableItem";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useCustomSectionStore } from "@/store/useCustomSectionStore";
import { CustomSection } from "@/types";

interface CustomSectionFormState {
  title: string;
  bulletsRaw: string;
}

const EMPTY_FORM: CustomSectionFormState = {
  title: "",
  bulletsRaw: "",
};

export function CustomSectionEditor() {
  const {
    customSections,
    isLoading,
    isSaving,
    fetchCustomSections,
    createCustomSection,
    updateCustomSection,
    deleteCustomSection,
  } = useCustomSectionStore();

  const [sectionsOrder, setSectionsOrder] = useState<CustomSection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<CustomSection | null>(null);
  const [formState, setFormState] = useState<CustomSectionFormState>(EMPTY_FORM);

  useEffect(() => {
    fetchCustomSections();
  }, [fetchCustomSections]);

  useEffect(() => {
    setSectionsOrder(customSections);
  }, [customSections]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const orderedIds = useMemo(() => sectionsOrder.map((s) => s.id), [sectionsOrder]);

  const openCreateModal = () => {
    setEditingSection(null);
    setFormState(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (section: CustomSection) => {
    setEditingSection(section);
    setFormState({
      title: section.title,
      bulletsRaw: section.bullets.join("\n"),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const title = formState.title.trim();
    const bullets = formState.bulletsRaw
      .split("\n")
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    if (!title) {
      toast.error("Section title is required");
      return;
    }

    if (bullets.length === 0) {
      toast.error("At least one bullet point is required");
      return;
    }

    try {
      if (editingSection) {
        await updateCustomSection(editingSection.id, { title, bullets });
        toast.success("Custom section updated");
      } else {
        await createCustomSection({
          title,
          bullets,
          displayOrder: customSections.length,
        });
        toast.success("Custom section created");
      }
      setIsModalOpen(false);
      setFormState(EMPTY_FORM);
      setEditingSection(null);
    } catch {
      toast.error("Failed to save custom section");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this custom section?")) return;
    try {
      await deleteCustomSection(id);
      toast.success("Custom section deleted");
    } catch {
      toast.error("Failed to delete custom section");
    }
  };

  const moveSection = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sectionsOrder.length) return;

    const previousOrder = sectionsOrder;
    const nextOrder = arrayMove(sectionsOrder, index, targetIndex);
    setSectionsOrder(nextOrder);

    try {
      // Optimistically swap orders in UI
      useCustomSectionStore.setState({
        customSections: nextOrder.map((item, idx) => ({ ...item, displayOrder: idx })),
      });

      // Update in backend
      const updates = nextOrder.map((item, index) => ({ id: item.id, displayOrder: index }));
      await Promise.all(
        updates
          .filter((item) => {
            const original = previousOrder.find((s) => s.id === item.id);
            return original && original.displayOrder !== item.displayOrder;
          })
          .map(({ id, displayOrder }) => updateCustomSection(id, { displayOrder }))
      );
      toast.success("Display order updated");
    } catch {
      // Rollback on failure
      setSectionsOrder(previousOrder);
      useCustomSectionStore.setState({ customSections: previousOrder });
      toast.error("Failed to update display order");
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedIds.indexOf(String(active.id));
    const newIndex = orderedIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    const previousOrder = sectionsOrder;
    const nextOrder = arrayMove(sectionsOrder, oldIndex, newIndex);
    setSectionsOrder(nextOrder);

    try {
      // Optimistically swap orders in UI
      useCustomSectionStore.setState({
        customSections: nextOrder.map((item, idx) => ({ ...item, displayOrder: idx })),
      });

      // Update in backend
      const updates = nextOrder.map((item, index) => ({ id: item.id, displayOrder: index }));
      await Promise.all(
        updates
          .filter((item) => {
            const original = previousOrder.find((s) => s.id === item.id);
            return original && original.displayOrder !== item.displayOrder;
          })
          .map(({ id, displayOrder }) => updateCustomSection(id, { displayOrder }))
      );
      toast.success("Display order updated");
    } catch {
      // Rollback on failure
      setSectionsOrder(previousOrder);
      useCustomSectionStore.setState({ customSections: previousOrder });
      toast.error("Failed to update display order");
    }
  };

  if (isLoading && customSections.length === 0) {
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
          <h1 className="font-heading text-3xl font-bold">Custom Sections</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Create user-defined headings (e.g. Languages Known, Certifications, Volunteer Work) with custom bullet items.
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          New Custom Section
        </Button>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Custom Section List</CardTitle>
          <CardDescription>
            Manage and reorder your customized resume sections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sectionsOrder.length === 0 ? (
            <div className="rounded-[var(--radius-md)] border border-dashed border-border p-12 text-center">
              <p className="text-sm text-text-secondary">No custom sections created yet. Add one to show additional achievements or custom lists.</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={orderedIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {sectionsOrder.map((section, index) => (
                    <SortableItem key={section.id} id={section.id}>
                      <div className="pr-7 sm:pr-9">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="min-w-0 flex-1 space-y-2">
                            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                              <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs text-primary font-semibold">
                                {section.title}
                              </span>
                            </h3>
                            <ul className="list-disc pl-5 text-sm text-text-secondary space-y-1">
                              {section.bullets.map((bullet, bIdx) => (
                                <li key={bIdx}>{bullet}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex sm:hidden items-center gap-0.5 border-r border-border/50 pr-1.5 mr-0.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-text-secondary disabled:opacity-30"
                                disabled={index === 0}
                                onClick={() => moveSection(index, "up")}
                                type="button"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-text-secondary disabled:opacity-30"
                                disabled={index === sectionsOrder.length - 1}
                                onClick={() => moveSection(index, "down")}
                                type="button"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(section)}
                              className="h-8"
                            >
                              <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                              Edit
                            </Button>
                            <button
                              type="button"
                              onClick={() => handleDelete(section.id)}
                              className="inline-flex items-center gap-1 rounded-full border border-danger/30 px-3 py-1 text-xs text-danger transition-colors hover:bg-danger/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </SortableItem>
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
        title={editingSection ? "Edit Custom Section" : "Create Custom Section"}
        description="Add a section title and the bullet highlights that go with it."
      >
        <div className="space-y-6 py-2">
          <Input
            label="Section Title"
            value={formState.title}
            onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Languages Known, Certifications, Volunteer Work, Interests"
            required
            info="The title/header of the custom section."
          />

          <div>
            <Textarea
              label="Section Bullet Points (one per line)"
              value={formState.bulletsRaw}
              onChange={(event) => setFormState((prev) => ({ ...prev, bulletsRaw: event.target.value }))}
              rows={6}
              placeholder={"English (Native speaker)\nFrench (Conversational)\nGerman (Basic)"}
              required
              info="Enter the details, one bullet point per line."
            />
            <div className="mt-2 flex items-start gap-1 text-xs text-text-secondary">
              <HelpCircle className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" />
              <span>
                Enter each highlight on a new line. They will be rendered as a bulleted list in your resume and profile.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/50">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={isSaving}
              className="min-w-[140px] shadow-lg shadow-primary/20"
            >
              {editingSection ? "Save Changes" : "Create Section"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
