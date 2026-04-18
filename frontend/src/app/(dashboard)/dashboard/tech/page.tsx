"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useProfileStore } from "@/store/useProfileStore";

export default function TechStackPage() {
  const {
    profile,
    techStackOptions,
    isLoading,
    isLoadingOptions,
    isSaving,
    fetchProfile,
    fetchTechStackOptions,
    updateTechStack,
  } = useProfileStore();

  const [search, setSearch] = useState("");
  const [selectedTechIds, setSelectedTechIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchProfile();
    fetchTechStackOptions();
  }, [fetchProfile, fetchTechStackOptions]);

  useEffect(() => {
    const selectedIds = new Set(profile?.techStacks?.map((stack) => stack.tech.id) ?? []);
    setSelectedTechIds(selectedIds);
  }, [profile?.techStacks]);

  const optionsByCategory = useMemo(() => {
    const categoryLabels: Record<string, string> = {
      LANGUAGE: "Programming Languages",
      FRONTEND: "Frontend",
      BACKEND: "Backend",
      DATABASE: "Database",
      DEVOPS: "DevOps",
      TOOL: "Tools",
      CLOUD: "Cloud",
      CS_CORE: "CS Core",
      FRAMEWORK: "Frameworks (Legacy)",
      OTHER: "Other"
    };

    const filtered = techStackOptions.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase().trim())
    );
    
    return filtered.reduce<Record<string, typeof filtered>>((acc, item) => {
      const key = categoryLabels[item.category] || item.category || "Other";
      acc[key] = acc[key] ? [...acc[key], item] : [item];
      return acc;
    }, {});
  }, [search, techStackOptions]);

  const selectedList = useMemo(
    () => techStackOptions.filter((item) => selectedTechIds.has(item.id)),
    [selectedTechIds, techStackOptions]
  );

  const hasChanges = useMemo(() => {
    const initial = new Set(profile?.techStacks?.map((stack) => stack.tech.id) ?? []);
    if (initial.size !== selectedTechIds.size) return true;
    return Array.from(selectedTechIds).some((id) => !initial.has(id));
  }, [profile?.techStacks, selectedTechIds]);

  const toggleTech = (id: string) => {
    setSelectedTechIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 20) {
        next.add(id);
      } else {
        toast.warning("You can select up to 20 technologies.");
      }
      return next;
    });
  };

  const handleSave = async () => {
    try {
      await updateTechStack(Array.from(selectedTechIds));
      toast.success("Tech stack updated");
    } catch {
      toast.error("Failed to update tech stack");
    }
  };

  if ((isLoading || isLoadingOptions) && techStackOptions.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-in space-y-8 pb-24">
      <div className="border-b border-border pb-5">
        <h1 className="font-heading text-3xl font-bold">Tech Stack</h1>
        <p className="mt-1 text-sm text-text-secondary">Select technologies to showcase on your public profile.</p>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Selected Technologies</span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {selectedTechIds.size}/20
            </span>
          </CardTitle>
          <CardDescription>Click any chip to remove it from your profile.</CardDescription>
        </CardHeader>
        <CardContent>
          {selectedList.length === 0 ? (
            <div className="rounded-[var(--radius-md)] border border-dashed border-border p-6 text-center text-sm text-text-secondary">
              No technologies selected yet.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedList.map((tech) => (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => toggleTech(tech.id)}
                  className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
                >
                  {tech.name}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card variant="surface">
        <CardHeader>
          <CardTitle>Browse Library</CardTitle>
          <CardDescription>Search and select tools, frameworks and languages.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search technology"
              className="pl-10"
            />
            <Search className="pointer-events-none absolute left-3 top-[14px] h-4 w-4 text-text-secondary" />
          </div>

          <div className="space-y-7">
            {Object.keys(optionsByCategory).length === 0 ? (
              <div className="rounded-[var(--radius-md)] border border-dashed border-border p-6 text-sm text-text-secondary">
                No technologies match your search.
              </div>
            ) : (
              Object.entries(optionsByCategory).map(([category, options]) => (
                <section key={category} className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-secondary">{category}</p>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {options.map((tech) => {
                      const selected = selectedTechIds.has(tech.id);
                      return (
                        <button
                          key={tech.id}
                          type="button"
                          onClick={() => toggleTech(tech.id)}
                          className={`rounded-[var(--radius-md)] border px-3 py-2 text-left text-sm transition-colors ${
                            selected
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-surface-low text-text-secondary hover:border-primary/30 hover:text-text-primary"
                          }`}
                        >
                          {tech.name}
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="fixed bottom-24 right-5 z-40 md:bottom-8 md:right-8">
        <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Save Stack
        </Button>
      </div>
    </div>
  );
}
