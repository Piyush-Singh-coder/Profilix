"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, Palette, RefreshCw, Save, CheckCircle2, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
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
import { OnboardingModal } from "@/components/dashboard/OnboardingModal";

const PROFILE_STATUSES: Array<{ value: ProfileStatus; label: string }> = [
  { value: "LOOKING_FOR_ROLES", label: "Looking For Roles" },
  { value: "OPEN_TO_HACKATHONS", label: "Open To Hackathons" },
  { value: "BUILDING_SOMETHING", label: "Building Something" },
  { value: "AVAILABLE_FOR_FREELANCE", label: "Available For Freelance" },
  { value: "NOT_AVAILABLE", label: "Not Available" },
  { value: "CUSTOM", label: "Custom Status" },
];



export function IdentityEditor() {
  const { user, updateSelectedTheme } = useAuthStore();
  const { profile, isLoading, isSaving, fetchProfile, updateProfile, updateTheme } = useProfileStore();
  const [githubUsername, setGithubUsername] = useState("");
  const [isSyncingGitHub, setIsSyncingGitHub] = useState(false);
  const [githubSummary, setGithubSummary] = useState(
    "No GitHub sync yet. Sync once to display contribution graph publicly."
  );
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    location: "",
    phoneNumber: "",
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
    fetchGithubStats();
    
    // Welcome Modal Logic
    const hasSeenWelcome = localStorage.getItem("profilix_welcome_shown");
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setShowWelcomeModal(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleCloseWelcome = () => {
    setShowWelcomeModal(false);
    localStorage.setItem("profilix_welcome_shown", "true");
  };

  useEffect(() => {
    if (!profile) return;
    setFormData({
      displayName: profile.displayName || "",
      bio: profile.bio || "",
      location: profile.location || "",
      phoneNumber: profile.phoneNumber || "",
      status: profile.status,
      statusCustomText: profile.statusCustomText || "",
    });
  }, [profile]);

  const wordCount = useMemo(() => {
    const text = formData.bio.trim();
    if (!text) return 0;
    return text.split(/\s+/).filter(Boolean).length;
  }, [formData.bio]);

  const isWordCountValid = useMemo(() => {
    return wordCount <= 200;
  }, [wordCount]);

  const hasChanged = useMemo(() => {
    if (!profile) return false;
    return (
      formData.displayName !== (profile.displayName || "") ||
      formData.bio !== (profile.bio || "") ||
      formData.location !== (profile.location || "") ||
      formData.phoneNumber !== (profile.phoneNumber || "") ||
      formData.status !== profile.status ||
      formData.statusCustomText !== (profile.statusCustomText || "")
    );
  }, [formData, profile]);

  const handleSave = async () => {
    if (!isWordCountValid) {
      toast.error("Professional summary must be between 100 and 200 words");
      return;
    }
    try {
      await updateProfile({
        displayName: formData.displayName.trim(),
        headline: null, // Removed headline input
        bio: formData.bio.trim() || null,
        location: formData.location.trim() || null,
        phoneNumber: formData.phoneNumber.trim() || null,
        status: formData.status,
        statusCustomText: formData.status === "CUSTOM" ? formData.statusCustomText.trim() || null : null,
      });
      toast.success("Identity updated");
    } catch {
      toast.error("Failed to save identity changes");
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
    <div className="animate-in space-y-8">
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
          <CardDescription>Display name, professional summary and location appear on your public page.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input
            label="Display Name"
            value={formData.displayName}
            onChange={(event) => setFormData((prev) => ({ ...prev, displayName: event.target.value }))}
            placeholder="Jane Developer"
          />
          <div>
            <Textarea
              label="Professional Summary"
              value={formData.bio}
              onChange={(event) => setFormData((prev) => ({ ...prev, bio: event.target.value }))}
              placeholder="Tell visitors what you build, what you care about, and what you are open to. Maximum 200 words."
              info="Keep it complete but concise since it tells your story on your profile card and resume."
            />
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className={cn(
                "font-medium",
                wordCount > 200 ? "text-red-500" : "text-text-secondary"
              )}>
                Word Count: {wordCount} / 200
              </span>
              {wordCount > 0 && wordCount <= 200 && (
                <span className="text-green-500 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Valid length
                </span>
              )}
            </div>
          </div>
          <Input
            label="Location"
            value={formData.location}
            onChange={(event) => setFormData((prev) => ({ ...prev, location: event.target.value }))}
            placeholder="Bengaluru, IN"
          />
          <Input
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={(event) => setFormData((prev) => ({ ...prev, phoneNumber: event.target.value }))}
            placeholder="+91 98765 43210"
            info="You can safely add your phone number. We respect your privacy and keep it secure."
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
            <FaGithub className="h-5 w-5 text-primary" />
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

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!hasChanged || isSaving || !formData.displayName.trim() || !isWordCountValid}
          className="shadow-xl"
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Identity
        </Button>
      </div>

      <OnboardingModal 
        mode="WELCOME" 
        open={showWelcomeModal} 
        onClose={handleCloseWelcome} 
      />
    </div>
  );
}
