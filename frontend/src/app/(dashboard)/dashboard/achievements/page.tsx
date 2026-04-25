"use client";

import { useEffect, useMemo, useState, useRef } from "react";
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
import { Loader2, Plus, Upload, X } from "lucide-react";
import { toast } from "sonner";
import AchievementCard from "@/components/dashboard/AchievementCard";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useAchievementStore } from "@/store/useAchievementStore";
import { Achievement, AchievementType } from "@/types";

interface AchievementFormState {
  title: string;
  provider: string;
  type: AchievementType;
  date: string;
  url: string;
  description: string;
}

const EMPTY_FORM: AchievementFormState = {
  title: "",
  provider: "",
  type: "OTHER",
  date: "",
  url: "",
  description: "",
};

const ACHIEVEMENT_TYPES: Array<{ value: AchievementType; label: string }> = [
  { value: "HACKATHON", label: "Hackathon" },
  { value: "COMPETITION", label: "Competition" },
  { value: "CERTIFICATE", label: "Certificate" },
  { value: "AWARD", label: "Award" },
  { value: "OTHER", label: "Other" },
];

export default function AchievementsPage() {
  const {
    achievements,
    isLoading,
    isSaving,
    fetchAchievements,
    createAchievement,
    updateAchievement,
    deleteAchievement,
  } = useAchievementStore();

  const [achievementOrder, setAchievementOrder] = useState<Achievement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [formState, setFormState] = useState<AchievementFormState>(EMPTY_FORM);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  useEffect(() => {
    setAchievementOrder([...achievements].sort((a, b) => a.displayOrder - b.displayOrder));
  }, [achievements]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const orderedIds = useMemo(() => achievementOrder.map((achievement) => achievement.id), [achievementOrder]);

  const openCreateModal = () => {
    setEditingAchievement(null);
    setFormState(EMPTY_FORM);
    setSelectedImage(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setFormState({
      title: achievement.title || "",
      provider: achievement.provider || "",
      type: achievement.type || "OTHER",
      date: achievement.date ? achievement.date.split("T")[0] : "",
      url: achievement.url || "",
      description: achievement.description || "",
    });
    setSelectedImage(null);
    setImagePreview(achievement.imageUrl || null);
    setIsModalOpen(true);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    const payload = {
      title: formState.title.trim(),
      provider: formState.provider.trim() || undefined,
      type: formState.type,
      date: formState.date || undefined,
      url: formState.url.trim() || undefined,
      description: formState.description.trim() || undefined,
    };

    if (!payload.title) {
      toast.error("Achievement title is required");
      return;
    }

    try {
      if (editingAchievement) {
        await updateAchievement(editingAchievement.id, payload, selectedImage);
        toast.success("Achievement updated");
      } else {
        await createAchievement(payload, selectedImage);
        toast.success("Achievement created");
      }
      setIsModalOpen(false);
      setFormState(EMPTY_FORM);
      setEditingAchievement(null);
      setSelectedImage(null);
      setImagePreview(null);
    } catch {
      toast.error("Failed to save achievement");
    }
  };

  const handleDelete = async (achievementId: string) => {
    if (!window.confirm("Delete this achievement?")) return;
    try {
      await deleteAchievement(achievementId);
      toast.success("Achievement deleted");
    } catch {
      toast.error("Failed to delete achievement");
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedIds.indexOf(String(active.id));
    const newIndex = orderedIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    const previousOrder = achievementOrder;
    const nextOrder = arrayMove(achievementOrder, oldIndex, newIndex);
    // Optimistic update immediately for instant UI response
    setAchievementOrder(nextOrder);

    try {
      // Single batch API call instead of N sequential calls
      const orderedIds = nextOrder.map((a, index) => ({ id: a.id, displayOrder: index }));
      await Promise.all(
        orderedIds
          .filter((item) => {
            const original = previousOrder.find((a) => a.id === item.id);
            return original && original.displayOrder !== item.displayOrder;
          })
          .map(({ id, displayOrder }) =>
            updateAchievement(id, { displayOrder })
          )
      );
      toast.success("Achievement order updated");
    } catch {
      setAchievementOrder(previousOrder);
      toast.error("Failed to reorder achievements");
    }
  };


  if (isLoading && achievementOrder.length === 0) {
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
          <h1 className="font-heading text-3xl font-bold">Achievements</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Showcase your accomplishments and drag cards to control display order.
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          New Achievement
        </Button>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Achievement List</CardTitle>
          <CardDescription>
            Drag any card by the handle to reorder. Add certificate images to make your achievements stand out.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {achievementOrder.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-12 text-center">
              <p className="text-sm text-text-secondary">No achievements yet. Create your first one to get started.</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={orderedIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {achievementOrder.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
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
        title={editingAchievement ? "Edit Achievement" : "Create Achievement"}
        description="Add details about your accomplishment and optionally upload a certificate image."
      >
        <div className="grid gap-4">
          <Input
            label="Title"
            value={formState.title}
            onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="1st Place at Hackathon 2024"
          />
          <Input
            label="Provider"
            value={formState.provider}
            onChange={(event) => setFormState((prev) => ({ ...prev, provider: event.target.value }))}
            placeholder="TechCrunch, Google, etc."
          />
          <Select
            label="Type"
            value={formState.type}
            onChange={(value) => setFormState((prev) => ({ ...prev, type: value as AchievementType }))}
            options={ACHIEVEMENT_TYPES}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Date"
              type="date"
              value={formState.date}
              onChange={(event) => setFormState((prev) => ({ ...prev, date: event.target.value }))}
            />
            <Input
              label="URL"
              value={formState.url}
              onChange={(event) => setFormState((prev) => ({ ...prev, url: event.target.value }))}
              placeholder="https://..."
            />
          </div>
          <Textarea
            label="Description"
            value={formState.description}
            onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
            rows={3}
            placeholder="Brief description of your achievement."
          />
          <div className="grid gap-2">
            <label className="text-sm font-medium text-text-primary">Certificate Image</label>
            <div className="flex items-start gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Certificate preview"
                    className="h-24 w-24 rounded-md object-cover border border-border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -right-2 -top-2 rounded-full bg-danger p-1 text-white hover:bg-danger/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-24 w-24 flex-col items-center justify-center rounded-md border border-dashed border-border hover:border-primary/50 transition-colors"
                >
                  <Upload className="h-6 w-6 text-text-secondary" />
                  <span className="mt-1 text-xs text-text-secondary">Upload</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <p className="text-xs text-text-secondary">
                Upload a certificate or badge image. Max 5MB.
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isSaving}>
              {editingAchievement ? "Update Achievement" : "Create Achievement"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
