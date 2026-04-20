"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Trophy, 
  Briefcase, 
  Code, 
  History, 
  User, 
  Rocket, 
  CheckCircle2, 
  Circle, 
  ArrowRight,
  Info
} from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/Card";
import { useProfileStore } from "@/store/useProfileStore";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

interface OnboardingModalProps {
  mode: "WELCOME" | "BLOCKER";
  onClose: () => void;
  open: boolean;
}

const PRIORITY_LIST = [
  { id: "identity", label: "Identity", path: "/dashboard", icon: User },
  { id: "projects", label: "Projects", path: "/dashboard/projects", icon: Briefcase },
  { id: "skills", label: "Skills", path: "/dashboard/tech", icon: Code },
  { id: "experience", label: "Experience", path: "/dashboard/experiences", icon: History },
  { id: "achievements", label: "Achievements", path: "/dashboard/achievements", icon: Trophy },
];

export function OnboardingModal({ mode, open, onClose }: OnboardingModalProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { completeness, fetchProfileCompleteness } = useProfileStore();

  useEffect(() => {
    if (open) {
      fetchProfileCompleteness();
    }
  }, [open, fetchProfileCompleteness]);

  const missingFields = useMemo(() => {
    if (!completeness) return [];
    return PRIORITY_LIST.filter(item => !completeness[item.id]);
  }, [completeness]);

  const highestPriorityMissing = missingFields[0];

  const handleNavigate = () => {
    if (highestPriorityMissing) {
      router.push(highestPriorityMissing.path);
    }
    onClose();
  };

  // Determine card variant based on theme
  const getVariant = () => {
    const theme = user?.selectedTheme || "SKEUOMORPHIC";
    if (theme === "GLASS" || theme === "AURORA" || theme === "NEON") return "glass";
    if (theme === "BRUTALISM") return "brutal";
    return "surface";
  };

  return (
    <Dialog open={open} onOpenChange={onClose} hideCloseButton className="border-none bg-transparent p-0 shadow-none max-w-lg">
      <Card variant={getVariant()} className="w-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
              {mode === "WELCOME" ? <Rocket className="h-6 w-6" /> : <Info className="h-6 w-6" />}
            </div>
            <div>
              <CardTitle className="text-2xl">
                {mode === "WELCOME" ? "Welcome to Profilix!" : "Ready to Generate?"}
              </CardTitle>
              <CardDescription>
                {mode === "WELCOME" 
                  ? "Let's set up your developer identity to unlock your custom resume and profile cards."
                  : "Complete these sections to make your professional assets truly shine."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="py-2">
          <div className="space-y-3">
            {PRIORITY_LIST.map((item, index) => {
              const isCompleted = completeness?.[item.id];
              const isPriority = highestPriorityMissing?.id === item.id;

              return (
                <div 
                  key={item.id}
                  className={cn(
                    "flex items-center justify-between rounded-xl border p-3 transition-all",
                    isCompleted ? "border-success/20 bg-success/5" : isPriority ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border bg-surface-low"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("h-5 w-5", isCompleted ? "text-success" : isPriority ? "text-primary" : "text-text-secondary")} />
                    <span className={cn("text-sm font-medium", isCompleted ? "text-text-primary" : isPriority ? "text-text-primary" : "text-text-secondary")}>
                      {item.label}
                    </span>
                  </div>
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <Circle className={cn("h-5 w-5", isPriority ? "text-primary animate-pulse" : "text-text-tertiary")} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 mt-8">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            {mode === "WELCOME" ? "I'll do it later" : "Cancel"}
          </Button>
          <Button onClick={handleNavigate} className="w-full sm:flex-1 shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.2)]">
            {highestPriorityMissing ? `Complete ${highestPriorityMissing.label}` : "Review Profile"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
}
