"use client";

import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  FileText, 
  Trophy,
  MapPin,
  Briefcase
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";

export function HeroProfileMockup() {
  return (
    <div className="relative w-full max-w-[600px] mx-auto perspective-1000">
      {/* Background glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[250px] h-[250px] bg-sky-500/20 blur-[80px] rounded-full pointer-events-none" />

      {/* Main Profile Card */}
      <div className="relative z-10 w-full rounded-3xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-black/50 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        {/* Top Header of Card */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary to-sky-500 blur-sm opacity-50" />
              <Image 
                src="https://ik.imagekit.io/v6xwevpjp/Profilix/profile_pic.png" 
                alt="Profile Avatar" 
                width={80} 
                height={80} 
                className="relative h-20 w-20 rounded-full border-2 border-white dark:border-surface bg-surface shadow-lg"
              />
              <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-white dark:border-surface bg-success flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-heading text-2xl font-black text-text-primary">Alex Chen</h3>
              <p className="text-sm font-medium text-primary">Senior Full-Stack Engineer</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-text-secondary">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> San Francisco, CA</span>
                <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> Open to roles</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-6 text-sm leading-relaxed text-text-secondary">
          Building scalable web applications and delightful user experiences. Passionate about open-source, React ecosystem, and cloud architecture. Previously at Vercel & Stripe.
        </p>

        {/* Tech Stack */}
        <div className="mt-6 flex flex-wrap gap-2">
          {["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "TailwindCSS"].map((tech) => (
            <span key={tech} className="rounded-full border border-border bg-surface-low px-3 py-1 text-xs font-semibold text-text-primary shadow-sm">
              {tech}
            </span>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-surface/30 py-3 shadow-inner">
            <span className="text-xl font-black text-text-primary">42</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Projects</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-surface/30 py-3 shadow-inner">
            <span className="text-xl font-black text-text-primary">12k+</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Commits</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-surface/30 py-3 shadow-inner">
            <span className="text-xl font-black text-text-primary">1.2k</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Followers</span>
          </div>
        </div>
      </div>

      {/* Floating Widget 1: GitHub Synced */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -left-12 bottom-12 z-20 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/80 dark:bg-black/60 p-3 shadow-xl backdrop-blur-xl"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black">
          <FaGithub className="h-5 w-5" />
        </div>
        <div className="pr-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Integration</p>
          <p className="text-xs font-black text-text-primary">GitHub Synced</p>
        </div>
      </motion.div>

      {/* Floating Widget 2: ATS Score */}
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -right-16 bottom-24 z-20 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/80 dark:bg-black/60 p-3 shadow-xl backdrop-blur-xl"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10 text-success">
          <FileText className="h-5 w-5" />
        </div>
        <div className="pr-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Resume Score</p>
          <div className="flex items-center gap-1 text-xs font-black text-text-primary">
            <span className="text-success">99%</span> ATS Match
          </div>
        </div>
      </motion.div>

      {/* Floating Widget 3: Top Developer */}
      <motion.div
        animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute -right-8 -top-8 z-20 flex items-center gap-2 rounded-full border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-4 py-2 shadow-lg backdrop-blur-xl"
      >
        <Trophy className="h-4 w-4 text-amber-500" />
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Top 1% Developer</span>
      </motion.div>
    </div>
  );
}
