"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Globe,
  Loader2,
  MapPin,
  Save,
  Trash2,
  Image as ImageIcon,
  Upload,
  CreditCard,
  Sparkles,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { cn } from "@/lib/utils";





import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Settings as SettingsIcon } from "lucide-react";

// ─── Section wrapper ───────────────────────────────────────────────────────
function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { logout, user, uploadAvatar } = useAuthStore();
  const { profile, isLoading, isSaving, fetchProfile, updateProfile, updateTheme } = useProfileStore();
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form state — mirrors profile fields
  const [form, setForm] = useState({
    appTheme: (user?.selectedTheme === "LIGHT" ? "LIGHT" : "DARK") as "LIGHT" | "DARK",
  });

  // Populate form when profile loads
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setForm((prev) => ({
        ...prev,
        appTheme: (user?.selectedTheme === "LIGHT" ? "LIGHT" : "DARK"),
      }));
    }
  }, [profile, user?.selectedTheme]);

  const set = <T extends keyof typeof form>(key: T) => (value: (typeof form)[T]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ── Save profile info ────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      // 2. Update Auth & Profile Theme (App Theme)
      const { updateSelectedTheme } = useAuthStore.getState();
      updateSelectedTheme(form.appTheme);
      
      // Update profile theme in store and backend
      await updateTheme(form.appTheme);

      setSaved(true);
      toast.success("Settings updated successfully!");
      setTimeout(() => setSaved(false), 2500);
    } catch {
      toast.error("Failed to save settings.");
    }
  };

  const toggleVisibility = async (isPublic: boolean) => {
    try {
      await updateProfile({ isPublic });
      toast.success(`Profile is now ${isPublic ? "public" : "private"}`);
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "This permanently deletes your account, projects, analytics, and media. Continue?"
    );
    if (!confirmed) return;
    setDeleting(true);
    try {
      await api.delete("/auth/account");
      await logout();
      toast.success("Account deleted");
      window.location.href = "/";
    } catch {
      toast.error("Failed to delete account");
      setDeleting(false);
    }
  };

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (isLoading && !profile) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-in space-y-8 pb-24">
      <DashboardHeader 
        title="Settings"
        subtitle="Manage your account controls, appearance preferences, and profile visibility. Customize your experience to suit your professional needs."
        badge="Account Controls"
        icon={SettingsIcon}
      />

      {/* ── App Theme ───────────────────────────────────────────────────── */}
      <Section
        icon={Sparkles}
        title="Application Appearance"
        description="Toggle between Light and Dark mode for the dashboard and landing page."
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => set("appTheme")("LIGHT")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-4 font-semibold transition-all",
              form.appTheme === "LIGHT"
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-text-secondary hover:border-primary/40"
            )}
          >
            Light Mode (Cream)
          </button>
          <button
            type="button"
            onClick={() => set("appTheme")("DARK")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-4 font-semibold transition-all",
              form.appTheme === "DARK"
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-text-secondary hover:border-primary/40"
            )}
          >
            Dark Mode (Glass)
          </button>
        </div>
      </Section>

      {/* ── Profile Photo ─────────────────────────────────────────────────── */}
      <Section icon={ImageIcon} title="Profile Photo" description="Update your avatar for your portfolio card and public presence.">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-low">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-8 w-8 text-text-secondary opacity-50" />
            )}
          </div>
          <div className="flex flex-col gap-3">
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setIsUploading(true);
                try {
                  await uploadAvatar(file);
                  toast.success("Profile photo updated");
                } catch (err) {
                  toast.error("Failed to upload photo");
                } finally {
                  setIsUploading(false);
                }
              }}
            />
            <button
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-low disabled:opacity-50"
              disabled={isUploading}
              onClick={() => document.getElementById("avatar-upload")?.click()}
            >
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {isUploading ? "Uploading..." : "Upload New Photo"}
            </button>
            <p className="text-xs text-text-secondary">
              Recommended: 400x400px. Max 5MB.
            </p>
          </div>
        </div>
      </Section>




      {/* ── Privacy ──────────────────────────────────────────────────────── */}
      <Section
        icon={Globe}
        title="Privacy"
        description="Control who can access your public profile URL."
      >
        <Switch
          checked={Boolean(profile?.isPublic)}
          onCheckedChange={toggleVisibility}
          disabled={isSaving}
          label={profile?.isPublic ? "Public Profile Enabled" : "Private Profile"}
          description={
            profile?.isPublic
              ? "Visitors can open your profile URL and see your portfolio."
              : "Only you can view your profile while private."
          }
          info="When disabled, your public profile and share links will be completely hidden from others and return a 404 page."
        />
      </Section>

      {/* ── Save button ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 rounded-xl border border-border/60 bg-surface-low/50 px-6 py-4">
        <p className="mr-auto text-xs text-text-secondary hidden sm:block">
          Changes to your card theme are correctly preserved across visits.
        </p>
        <Button
          variant="outline"
          onClick={async () => {
            await logout();
            window.location.href = "/";
          }}
          className="min-w-[120px]"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
          className="min-w-[120px]"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isSaving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {/* ── Danger Zone ──────────────────────────────────────────────────── */}
      <Card variant="outline" className="border-danger/35 bg-danger/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-danger">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-danger/80">
            Delete your account permanently. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
