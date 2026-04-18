"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { useSocialStore } from "@/store/useSocialStore";
import { SocialPlatform } from "@/types";

type SocialDraft = {
  url: string;
  enabled: boolean;
  visibleInDefault: boolean;
  visibleInRecruiter: boolean;
};

const PLATFORMS: Array<{ id: SocialPlatform; name: string; placeholder: string }> = [
  { id: "GITHUB", name: "GitHub", placeholder: "https://github.com/username" },
  { id: "LINKEDIN", name: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
  { id: "TWITTER", name: "Twitter / X", placeholder: "https://x.com/username" },
  { id: "LEETCODE", name: "LeetCode", placeholder: "https://leetcode.com/username" },
  { id: "HACKERRANK", name: "HackerRank", placeholder: "https://hackerrank.com/username" },
  { id: "PERSONAL_WEBSITE", name: "Personal Website", placeholder: "https://yourdomain.com" },
  { id: "OTHER", name: "Other", placeholder: "https://example.com" },
];

export default function SocialsPage() {
  const { links, isLoading, isSaving, fetchLinks, saveLink, deleteLink } = useSocialStore();
  const [draft, setDraft] = useState<Record<SocialPlatform, SocialDraft>>(() =>
    PLATFORMS.reduce(
      (acc, platform) => ({
        ...acc,
        [platform.id]: { url: "", enabled: false, visibleInDefault: true, visibleInRecruiter: true },
      }),
      {} as Record<SocialPlatform, SocialDraft>
    )
  );

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  useEffect(() => {
    const nextDraft = { ...draft };
    for (const platform of PLATFORMS) {
      const existing = links.find((link) => link.platform === platform.id);
      nextDraft[platform.id] = existing
        ? {
            url: existing.url,
            enabled: true,
            visibleInDefault: existing.visibleInDefault,
            visibleInRecruiter: existing.visibleInRecruiter,
          }
        : { url: "", enabled: false, visibleInDefault: true, visibleInRecruiter: true };
    }
    setDraft(nextDraft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [links]);

  const hasChanges = useMemo(() => {
    return PLATFORMS.some((platform) => {
      const existing = links.find((link) => link.platform === platform.id);
      const row = draft[platform.id];

      if (!existing && row.enabled && row.url.trim()) return true;
      if (existing && (!row.enabled || row.url.trim() !== existing.url)) return true;
      if (existing && row.visibleInDefault !== existing.visibleInDefault) return true;
      if (existing && row.visibleInRecruiter !== existing.visibleInRecruiter) return true;

      return false;
    });
  }, [draft, links]);

  const updateRow = (platform: SocialPlatform, patch: Partial<SocialDraft>) => {
    setDraft((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        ...patch,
      },
    }));
  };

  const handleSave = async () => {
    try {
      for (const platform of PLATFORMS) {
        const current = draft[platform.id];
        const existing = links.find((link) => link.platform === platform.id);

        if (!current.enabled || !current.url.trim()) {
          if (existing) {
            await deleteLink(existing.id);
          }
          continue;
        }

        await saveLink({
          platform: platform.id,
          url: current.url.trim(),
          visibleInDefault: current.visibleInDefault,
          visibleInRecruiter: current.visibleInRecruiter,
        });
      }
      toast.success("Social links updated");
    } catch {
      toast.error("Failed to update social links");
    }
  };

  if (isLoading && links.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-in space-y-8 pb-24">
      <div className="border-b border-border pb-5">
        <h1 className="font-heading text-3xl font-bold">Socials</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Enable platform links and control what appears in default vs recruiter view.
        </p>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Platform Links</CardTitle>
          <CardDescription>Keep only the links that represent your current profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {PLATFORMS.map((platform) => {
            const row = draft[platform.id];
            return (
              <section key={platform.id} className="rounded-[var(--radius-md)] border border-border bg-surface-low p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="font-heading text-sm font-semibold">{platform.name}</p>
                  <Switch
                    checked={row.enabled}
                    onCheckedChange={(checked) => updateRow(platform.id, { enabled: checked })}
                  />
                </div>
                <Input
                  value={row.url}
                  disabled={!row.enabled}
                  onChange={(event) => updateRow(platform.id, { url: event.target.value })}
                  placeholder={platform.placeholder}
                />
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <Switch
                    checked={row.visibleInDefault}
                    onCheckedChange={(checked) => updateRow(platform.id, { visibleInDefault: checked })}
                    disabled={!row.enabled}
                    label="Visible In Default View"
                  />
                  <Switch
                    checked={row.visibleInRecruiter}
                    onCheckedChange={(checked) => updateRow(platform.id, { visibleInRecruiter: checked })}
                    disabled={!row.enabled}
                    label="Visible In Recruiter View"
                  />
                </div>
              </section>
            );
          })}
        </CardContent>
      </Card>

      <div className="fixed bottom-24 right-5 z-40 md:bottom-8 md:right-8">
        <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save Social Links
        </Button>
      </div>
    </div>
  );
}
