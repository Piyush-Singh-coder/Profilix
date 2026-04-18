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


// ─── Card theme options ────────────────────────────────────────────────────
const CARD_THEMES = [
  {
    value: "GLASSMORPHISM",
    label: "Glassmorphism",
    desc: "Dark glass with blue glow",
    preview: "from-slate-900 via-blue-950 to-slate-900",
    dot: "bg-blue-400",
  },
  {
    value: "NEOBRUTALISM",
    label: "NeoBrutalism",
    desc: "Bold borders & cream tones",
    preview: "bg-amber-50 border-black border-2",
    dot: "bg-amber-400",
  },
  {
    value: "APPLE",
    label: "Apple / Minimal",
    desc: "Clean white system design",
    preview: "bg-gray-50 border border-gray-200",
    dot: "bg-blue-600",
  },
] as const;

type CardThemeValue = (typeof CARD_THEMES)[number]["value"];


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
  const { profile, isLoading, isSaving, fetchProfile, updateProfile } = useProfileStore();
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form state — mirrors profile fields
  const [form, setForm] = useState({
    cardTheme: "GLASSMORPHISM" as CardThemeValue,
  });

  // Populate form when profile loads
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setForm({
        cardTheme:        (profile.cardTheme   as CardThemeValue)  || "GLASSMORPHISM",
      });
    }
  }, [profile]);

  const set = <T extends keyof typeof form>(key: T) => (value: (typeof form)[T]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ── Save profile info ────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      await updateProfile({
        cardTheme:        form.cardTheme        || undefined,
      } as Parameters<typeof updateProfile>[0]);
      setSaved(true);
      toast.success("Profile updated successfully!");
      setTimeout(() => setSaved(false), 2500);
    } catch {
      toast.error("Failed to save profile.");
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
      {/* Page header */}
      <div className="border-b border-border pb-5">
        <h1 className="font-heading text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Manage your account controls, card themes, and profile photo.
        </p>
      </div>

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
            <Button
              variant="outline"
              disabled={isUploading}
              onClick={() => document.getElementById("avatar-upload")?.click()}
            >
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {isUploading ? "Uploading..." : "Upload New Photo"}
            </Button>
            <p className="text-xs text-text-secondary">
              Recommended: 400x400px. Max 5MB.
            </p>
          </div>
        </div>
      </Section>


      {/* ── Card Theme ───────────────────────────────────────────────────── */}
      <Section
        icon={CreditCard}
        title="Profile Card Theme"
        description="Style of the downloadable card generated from your profile."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CARD_THEMES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => set("cardTheme")(t.value)}
              className={cn(
                "group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-200",
                form.cardTheme === t.value
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/40"
              )}
            >
              {/* Mini preview bar */}
              <div className={cn("mb-3 h-16 w-full rounded-lg bg-gradient-to-br", t.preview)} />
              <div className="flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full", t.dot)} />
                <span className="text-sm font-semibold text-text-primary">{t.label}</span>
              </div>
              <p className="mt-0.5 text-xs text-text-secondary">{t.desc}</p>
              {form.cardTheme === t.value && (
                <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-primary" />
              )}
            </button>
          ))}
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
