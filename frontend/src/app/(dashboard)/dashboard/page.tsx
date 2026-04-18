"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { GitBranch, Loader2, Palette, RefreshCw, Save, CheckCircle2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { useProfileStore } from "@/store/useProfileStore";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ProfileStatus, ProfileTheme } from "@/types";

const PROFILE_STATUSES: Array<{ value: ProfileStatus; label: string }> = [
  { value: "LOOKING_FOR_ROLES", label: "Looking For Roles" },
  { value: "OPEN_TO_HACKATHONS", label: "Open To Hackathons" },
  { value: "BUILDING_SOMETHING", label: "Building Something" },
  { value: "AVAILABLE_FOR_FREELANCE", label: "Available For Freelance" },
  { value: "NOT_AVAILABLE", label: "Not Available" },
  { value: "CUSTOM", label: "Custom Status" },
];

const THEMES: Array<{ theme: ProfileTheme; description: string; preview: string; dot: string; }> = [
  { theme: "GLASS", description: "Frosted, luminous and premium.", preview: "from-slate-900 via-blue-950 to-slate-900", dot: "bg-blue-400" },
  { theme: "BRUTALISM", description: "High-contrast and editorial.", preview: "bg-amber-50 border-black border-2", dot: "bg-amber-400" },
  { theme: "CLAY", description: "Soft shadows and tactile warmth.", preview: "bg-[#f6f2ea] border-[#c7b8a9] border", dot: "bg-[#c7b8a9]" },
  { theme: "MINIMAL", description: "Clean grayscale focus.", preview: "bg-[#f7f7f7] border-[#d4d4d4] border", dot: "bg-gray-500" },
  { theme: "NEON", description: "Electric gradient accents.", preview: "from-purple-900 via-pink-900 to-black", dot: "bg-pink-500" },
  { theme: "RETRO", description: "Terminal-inspired green glow.", preview: "bg-black border-green-500 border", dot: "bg-green-500" },
  { theme: "AURORA", description: "Blue atmospheric gradients.", preview: "from-teal-900 via-blue-900 to-indigo-900", dot: "bg-teal-400" },
  { theme: "SKEUOMORPHIC", description: "Depth-heavy card treatment.", preview: "bg-gradient-to-b from-[#1c1f2b] to-[#12141d] shadow-inner", dot: "bg-[#c3a069]" },
];

export default function IdentityDashboardPage() {
  const { user, updateSelectedTheme } = useAuthStore();
  const { profile, isLoading, isSaving, fetchProfile, updateProfile, updateTheme } = useProfileStore();
  const [githubUsername, setGithubUsername] = useState("");
  const [isSyncingGitHub, setIsSyncingGitHub] = useState(false);
  const [githubSummary, setGithubSummary] = useState(
    "No GitHub sync yet. Sync once to display contribution graph publicly."
  );

  const [formData, setFormData] = useState({
    displayName: "",
    headline: "",
    bio: "",
    location: "",
    status: "NOT_AVAILABLE" as ProfileStatus,
    statusCustomText: "",
  });

  const fetchGithubStats = async () => {
    try {
      const response = await api.get("/github/stats");
      const stats = response.data?.data;
      if (stats?.githubUsername) {
        setGithubUsername(stats.githubUsername);
        setGithubSummary(
          `${stats.totalRepos} repos - ${stats.totalStars} stars - ${stats.followers} followers`
        );
      } else {
        setGithubSummary("No GitHub sync yet. Sync once to display contribution graph publicly.");
      }
    } catch {
      setGithubSummary("Unable to fetch GitHub stats currently.");
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchGithubStats();
  }, [fetchProfile]);

  useEffect(() => {
    if (!profile) return;
    setFormData({
      displayName: profile.displayName || "",
      headline: profile.headline || "",
      bio: profile.bio || "",
      location: profile.location || "",
      status: profile.status,
      statusCustomText: profile.statusCustomText || "",
    });
  }, [profile]);

  const hasChanged = useMemo(() => {
    if (!profile) return false;
    return (
      formData.displayName !== (profile.displayName || "") ||
      formData.headline !== (profile.headline || "") ||
      formData.bio !== (profile.bio || "") ||
      formData.location !== (profile.location || "") ||
      formData.status !== profile.status ||
      formData.statusCustomText !== (profile.statusCustomText || "")
    );
  }, [formData, profile]);

  const handleSave = async () => {
    try {
      await updateProfile({
        displayName: formData.displayName.trim(),
        headline: formData.headline.trim() || null,
        bio: formData.bio.trim() || null,
        location: formData.location.trim() || null,
        status: formData.status,
        statusCustomText: formData.status === "CUSTOM" ? formData.statusCustomText.trim() || null : null,
      });
      toast.success("Identity updated");
    } catch {
      toast.error("Failed to save identity changes");
    }
  };

  

  const handleThemeChange = async (theme: ProfileTheme) => {
    if (theme === profile?.theme) return;
    try {
      await updateTheme(theme);
      updateSelectedTheme(theme);
      toast.success(`Theme switched to ${theme}`);
    } catch {
      toast.error("Failed to update theme");
    }
  };

  const handleSyncGithub = async () => {
    if (!githubUsername.trim()) {
      toast.error("Enter a GitHub username first");
      return;
    }
    try {
      setIsSyncingGitHub(true);
      await api.post("/github/sync", { username: githubUsername.trim() });
      await fetchGithubStats();
      toast.success("GitHub synced. Contribution graph and pinned repos are now available.");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "GitHub sync failed");
    } finally {
      setIsSyncingGitHub(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-in space-y-8 pb-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <h1 className="font-heading text-3xl font-bold">Identity</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Define how your profile introduces you across the dashboard and public portfolio.
          </p>
        </div>
        <Link href={`/u/${user?.username}`} target="_blank">
          <Button variant="outline" className="group">
            <ExternalLink className="mr-2 h-4 w-4" />
            Visit Public Profile
          </Button>
        </Link>
      </div>

      <Card variant="glass" className="relative z-10">
        <CardHeader>
          <CardTitle>Profile Basics</CardTitle>
          <CardDescription>Display name, headline, bio and location appear on your public page.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input
            label="Display Name"
            value={formData.displayName}
            onChange={(event) => setFormData((prev) => ({ ...prev, displayName: event.target.value }))}
            placeholder="Jane Developer"
          />
          <Input
            label="Headline"
            value={formData.headline}
            onChange={(event) => setFormData((prev) => ({ ...prev, headline: event.target.value }))}
            placeholder="Full-stack engineer building polished products"
            info="Keep it short and impactful. E.g., 'Full-stack developer building polished products'. This appears right below your name."
          />
          <Textarea
            label="Bio"
            value={formData.bio}
            onChange={(event) => setFormData((prev) => ({ ...prev, bio: event.target.value }))}
            placeholder="Tell visitors what you build, what you care about, and what you are open to."
            info="Tell visitors what you build. Keep it complete but concise since it tells your story on your profile card and resume."
          />
          <Input
            label="Location"
            value={formData.location}
            onChange={(event) => setFormData((prev) => ({ ...prev, location: event.target.value }))}
            placeholder="Bengaluru, IN"
          />
          <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="Status"
                value={formData.status}
                onChange={(value) => setFormData((prev) => ({ ...prev, status: value as ProfileStatus }))}
                options={PROFILE_STATUSES}
              />
            <Input
              label="Custom Status Text"
              value={formData.statusCustomText}
              disabled={formData.status !== "CUSTOM"}
              onChange={(event) => setFormData((prev) => ({ ...prev, statusCustomText: event.target.value }))}
              placeholder="Shipping my SaaS MVP"
            />
          </div>
        </CardContent>
      </Card>

      <Card variant="surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            GitHub Sync
          </CardTitle>
          <CardDescription>
            Sync GitHub to show contribution graph, pinned repos, and stats on your public profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              label="GitHub Username"
              value={githubUsername}
              onChange={(event) => setGithubUsername(event.target.value)}
              placeholder="octocat"
            />
            <div className="sm:pt-7">
              <Button onClick={handleSyncGithub} disabled={isSyncingGitHub}>
                {isSyncingGitHub ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Sync
              </Button>
            </div>
          </div>
          <p className="text-xs text-text-secondary">{githubSummary}</p>
        </CardContent>
      </Card>

      <Card variant="surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Portfolio Theme
          </CardTitle>
          <CardDescription>Choose your default look. You can switch this anytime.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {THEMES.map((item) => (
            <button
              key={item.theme}
              type="button"
              onClick={() => handleThemeChange(item.theme)}
              className={cn(
                "group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-200",
                profile?.theme === item.theme
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/40 bg-surface-low"
              )}
            >
              <div className={cn("mb-3 h-16 w-full rounded-lg bg-gradient-to-br", item.preview)} />
              <div className="flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", item.dot)} />
                <span className="text-sm font-semibold truncate">{item.theme}</span>
              </div>
              <p className="mt-1 text-xs text-text-secondary line-clamp-2">{item.description}</p>
              {profile?.theme === item.theme && (
                <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-primary" />
              )}
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="fixed bottom-24 right-5 z-40 md:bottom-8 md:right-8">
        <Button
          onClick={handleSave}
          disabled={!hasChanged || isSaving || !formData.displayName.trim()}
          className="shadow-[0_0_28px_var(--color-primary-glow)]"
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Identity
        </Button>
      </div>
    </div>
  );
}
