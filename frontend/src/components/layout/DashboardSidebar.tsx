"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Code2,
  FolderKanban,
  Share2,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Trophy,
  Briefcase,
  GraduationCap,
  IdCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { Logo } from "@/components/ui/Logo";

const NAV_ITEMS = [
  { name: "Identity", path: "/dashboard", icon: User },
  { name: "Education", path: "/dashboard/education", icon: GraduationCap },
  { name: "Experiences", path: "/dashboard/experiences", icon: Briefcase },
  { name: "Projects", path: "/dashboard/projects", icon: FolderKanban },
  { name: "Skills", path: "/dashboard/tech", icon: Code2 },
  { name: "Socials", path: "/dashboard/socials", icon: Share2 },
  { name: "Achievements", path: "/dashboard/achievements", icon: Trophy },
  { name: "Resume", path: "/dashboard/resume", icon: FileText },
  { name: "Profile Card", path: "/dashboard/qr", icon: IdCard },
  { name: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <>
      <aside className="hidden h-full w-72 flex-col justify-between border-r border-border bg-surface/95 p-4 md:flex">
        <div>
          <Link href="/" className="mb-5 flex items-center gap-2 rounded-xl px-3 py-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-high/50 border border-border/50">
              <Logo size={120} className="h-10 w-10 drop-shadow-lg" />
            </div>
            <div>
              <p className="font-heading text-base font-bold">Profilix</p>
              <p className="text-xs text-text-secondary">Dashboard</p>
            </div>
          </Link>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-transparent text-text-secondary hover:border-border hover:bg-surface-high hover:text-text-primary"
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm text-text-secondary transition-colors hover:border-danger/30 hover:bg-danger/10 hover:text-danger"
        >
          <LogOut className="h-4.5 w-4.5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </aside>

      <nav className="fixed bottom-0 left-0 z-50 flex h-[72px] w-full items-center gap-1 overflow-x-auto border-t border-border bg-surface/95 px-4 backdrop-blur-xl md:hidden scrollbar-hide">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex h-14 w-[72px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-colors",
                isActive ? "bg-primary/10 text-primary" : "text-text-secondary"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
