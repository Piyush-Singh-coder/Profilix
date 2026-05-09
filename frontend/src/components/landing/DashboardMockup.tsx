"use client";

import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  FileText, 
  UserCircle, 
  QrCode, 
  BarChart3, 
  Settings, 
  Check,
  Plus,
  Pencil,
  Sparkles
} from "lucide-react";

export function DashboardMockup() {
  return (
    <div className="relative w-full max-w-[800px] overflow-hidden rounded-[32px] border border-border/50 bg-background/80 shadow-2xl backdrop-blur-xl">
      <div className="flex h-[540px]">
        {/* Sidebar */}
        <aside className="w-16 flex-col items-center border-r border-border/40 bg-surface-low py-6 hidden sm:flex">
          <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <nav className="flex flex-1 flex-col gap-6">
            <div className="text-text-muted hover:text-primary transition-colors cursor-pointer"><LayoutDashboard className="h-5 w-5" /></div>
            <div className="rounded-lg bg-primary/10 p-2 text-primary shadow-sm cursor-pointer"><FileText className="h-5 w-5" /></div>
            <div className="text-text-muted hover:text-primary transition-colors cursor-pointer"><UserCircle className="h-5 w-5" /></div>
            <div className="text-text-muted hover:text-primary transition-colors cursor-pointer"><QrCode className="h-5 w-5" /></div>
            <div className="text-text-muted hover:text-primary transition-colors cursor-pointer"><BarChart3 className="h-5 w-5" /></div>
          </nav>
          <div className="mt-auto text-text-muted cursor-pointer hover:text-primary transition-colors">
            <Settings className="h-5 w-5" />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden bg-surface/30">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-border/40 px-6 py-4">
            <h3 className="font-heading text-lg font-bold">Resume Builder</h3>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-success">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-success/10">
                <Check className="h-3 w-3" />
              </div>
              All Changes Saved
            </div>
          </header>

          {/* Stepper */}
          <div className="flex items-center gap-4 px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white">1</div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Content</span>
            </div>
            <div className="h-[1px] w-8 bg-border" />
            <div className="flex items-center gap-2 opacity-40">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-high text-[10px] font-black">2</div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Customize</span>
            </div>
            <div className="h-[1px] w-8 bg-border" />
            <div className="flex items-center gap-2 opacity-40">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-high text-[10px] font-black">3</div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Preview</span>
            </div>
          </div>

          <div className="grid h-full grid-cols-12 gap-4 px-6 pb-6">
            {/* Left: Forms */}
            <div className="col-span-12 lg:col-span-5 space-y-3 overflow-y-auto pr-1 scrollbar-hide">
              {/* Personal Info Card */}
              <div className="rounded-xl border border-border/50 bg-surface/50 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-tighter text-text-muted">Personal Information</span>
                  <Pencil className="h-3 w-3 text-primary" />
                </div>
                <div className="space-y-2">
                   <div className="h-2 w-full rounded-full bg-border/30" />
                   <div className="h-2 w-[70%] rounded-full bg-border/20" />
                   <div className="h-2 w-[85%] rounded-full bg-border/20" />
                </div>
              </div>
              {/* Summary Card */}
              <div className="rounded-xl border border-border/50 bg-surface/50 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-tighter text-text-muted">Professional Summary</span>
                  <Pencil className="h-3 w-3 text-primary" />
                </div>
                <div className="h-2 w-full rounded-full bg-border/30" />
                <div className="mt-2 h-2 w-[90%] rounded-full bg-border/20" />
              </div>
              {/* Experience Card */}
              <div className="rounded-xl border border-border/50 bg-surface/50 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-tighter text-text-muted">Work Experience</span>
                  <Plus className="h-3 w-3 text-primary" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-border/20 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2 w-[40%] rounded-full bg-border/40" />
                    <div className="h-1.5 w-[25%] rounded-full bg-border/20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Preview */}
            <div className="col-span-12 lg:col-span-7">
              <div className="h-full rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
                <div className="text-slate-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading text-xl font-black tracking-tight text-slate-950">ALEX JOHNSON</h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Senior Software Engineer</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-slate-100" />
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <section>
                      <div className="h-px w-full bg-slate-100 mb-2" />
                      <p className="text-[8px] leading-relaxed text-slate-500">
                        Senior software engineer with 8+ years of experience in building scalable web applications and solving real-world problems with clean, efficient code.
                      </p>
                    </section>

                    <section className="space-y-3">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Experience</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                           <p className="text-[10px] font-bold text-slate-800">Senior Software Engineer</p>
                           <span className="text-[8px] text-slate-400">2021 - Present</span>
                        </div>
                        <div className="space-y-1">
                          <div className="h-1.5 w-full rounded-full bg-slate-50" />
                          <div className="h-1.5 w-[90%] rounded-full bg-slate-50" />
                        </div>
                      </div>
                    </section>

                    <section className="space-y-3">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Education</p>
                      <div className="flex justify-between items-start">
                         <p className="text-[10px] font-bold text-slate-800">B.Tech in Computer Science</p>
                         <span className="text-[8px] text-slate-400">2016 - 2020</span>
                      </div>
                    </section>

                    <div className="mt-auto pt-6 flex items-center justify-between">
                       <div className="flex gap-1">
                          {[1,2,3,4].map(i => <div key={i} className="h-4 w-10 rounded bg-slate-50" />)}
                       </div>
                       <div className="h-8 w-24 rounded-lg bg-primary flex items-center justify-center text-[8px] font-bold text-white uppercase tracking-widest">
                          Download PDF
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Decorative Elements */}
      <motion.div 
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-4 top-1/4 h-20 w-48 rounded-2xl bg-surface/40 p-4 shadow-xl backdrop-blur-md border border-border/40 hidden xl:block"
      >
        <div className="flex items-center gap-3">
           <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center text-success">
              <Check className="h-6 w-6" />
           </div>
           <div>
              <p className="text-[10px] font-bold text-text-primary">Profile Ready: 95%</p>
              <div className="mt-1.5 h-1.5 w-24 rounded-full bg-border/40 overflow-hidden">
                 <div className="h-full w-[95%] bg-success" />
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
