import type { Metadata } from "next";
import { ShieldCheck, Sparkles, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Authentication | Profilix",
  description: "Sign in or create your Profilix account.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="noise-overlay relative flex min-h-screen items-center justify-center p-4 sm:p-8">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-border bg-surface/85 shadow-2xl lg:grid-cols-2">
        <section className="relative hidden flex-col justify-between border-r border-border bg-gradient-to-br from-surface-high via-surface to-background p-12 lg:flex">
          <div className="absolute inset-0">
            <div className="absolute -left-12 top-8 h-64 w-64 rounded-full bg-primary/20 blur-[120px]" />
            <div className="absolute bottom-8 right-8 h-72 w-72 rounded-full bg-tertiary/20 blur-[120px]" />
          </div>
          <div className="relative z-10">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Premium Portfolio Builder
            </p>
            <h1 className="mt-6 font-heading text-5xl font-black leading-tight text-text-primary">
              Build the portfolio your next role remembers.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-text-secondary">
              Profilix turns your profile, projects, socials, and resume into a polished personal brand URL.
            </p>
          </div>

          <div className="relative z-10 space-y-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                <Zap className="h-4 w-4" />
              </div>
              <p className="text-sm text-text-secondary">Fast setup with live preview and themed layouts</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-secondary/10 p-2.5 text-secondary">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <p className="text-sm text-text-secondary">OAuth + email authentication with secure sessions</p>
            </div>
          </div>
        </section>

        <section className="flex min-h-[720px] items-center justify-center bg-surface-low/30 px-5 py-10 sm:px-10">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </div>
    </main>
  );
}
