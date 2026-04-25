"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/Button";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";

const GRID_OPACITY = [
  [0.18, 0.24, 0.35, 0.22],
  [0.42, 0.3, 0.2, 0.28],
  [0.55, 0.32, 0.23, 0.45],
  [0.26, 0.18, 0.48, 0.2],
  [0.22, 0.41, 0.27, 0.3],
  [0.4, 0.2, 0.17, 0.52],
  [0.29, 0.21, 0.38, 0.19],
  [0.47, 0.26, 0.24, 0.33],
  [0.36, 0.19, 0.21, 0.41],
  [0.31, 0.26, 0.49, 0.17],
  [0.22, 0.43, 0.28, 0.25],
  [0.35, 0.3, 0.2, 0.44],
];

export function Hero() {
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden pb-20 pt-32">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-16 -top-24 h-[560px] w-[560px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute -bottom-24 -right-16 h-[460px] w-[460px] rounded-full bg-tertiary/18 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Built for professionals. Designed to get you hired.
          </div>
          <h1 className="mt-7 font-heading text-6xl font-black leading-[1.03] tracking-tight text-text-primary sm:text-7xl lg:text-[80px]">
            Your Professional
            <br />
            Identity, <span className="animated-gradient-text">Reimagined.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">
            Turn your bio, experience, and projects into stunning profile cards and ATS-friendly resumes in minutes.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            {isAuthenticated ? (
              <>
                <Link href={`/u/${user?.username}`}>
                  <Button size="lg" className="w-full sm:w-auto">View My Profile <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
                <Link href="/dashboard/resume">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto group">
                    View Templates
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">Create Your Profile <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
                <Link href="/ats-resume-generator">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto group">
                    View Templates
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10 text-success">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">ATS-Optimized</p>
                <p className="text-xs text-text-secondary">Higher Shortlist Rate</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">Save Hours</p>
                <p className="text-xs text-text-secondary">Focus on what matters</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotateZ: 0, rotateY: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.15, ease: "easeOut" }}
          className="relative hidden lg:block perspective-1000"
          style={{ perspective: "1000px" }}
        >
          <motion.div
            initial={{ rotateZ: 4, rotateY: -12, rotateX: 6 }}
            animate={{ y: [-6, 8, -6], rotateZ: 4, rotateY: -12, rotateX: 6 }}
            transition={{ y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
            className="glass-panel relative mx-auto w-full max-w-[500px] rounded-3xl p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] border border-white/10 overflow-hidden"
          >
            {/* Shiny Edge Effect */}
            <motion.div 
              animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-3xl pointer-events-none z-10"
              style={{
                padding: "2px", // Border thickness
                background: "linear-gradient(90deg, transparent 0%, rgba(56,189,248,0.7) 25%, rgba(16,185,129,0.7) 50%, rgba(56,189,248,0.7) 75%, transparent 100%)",
                backgroundSize: "200% 100%",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
            />
            {/* Top Pill */}
            <div className="mb-6 flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-low px-3 py-1 text-xs text-text-secondary">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Profile Card
              </div>
            </div>

            {/* Profile Header */}
            <div className="flex items-start gap-5">
              <div className="relative">
                <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-surface-high shadow-md">
                  <Image src="https://api.dicebear.com/7.x/notionists/svg?seed=johndoe" alt="John Doe avatar" width={80} height={80} className="h-full w-full object-cover" />
                </div>
                <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-surface bg-[#39d353]" />
              </div>
              <div className="pt-1">
                <h3 className="font-heading text-2xl font-bold text-text-primary">John Doe</h3>
                <p className="text-sm text-text-secondary">Full Stack Developer</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-text-secondary/70">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  San Francisco, CA
                </p>
                <div className="mt-3 flex items-center gap-3 text-text-secondary">
                  <FaGithub className="h-4 w-4 hover:text-primary transition-colors cursor-pointer" />
                  <svg className="h-4 w-4 hover:text-primary transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  <svg className="h-4 w-4 hover:text-primary transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  <ExternalLink className="h-4 w-4 hover:text-primary transition-colors cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="mt-6 text-sm leading-relaxed text-text-secondary">
              I build scalable web applications and delightful user experiences. Passionate about clean code, system design and developer tools.
            </p>

            {/* Skills */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["React", "TypeScript", "Node.js", "PostgreSQL"].map((skill) => (
                <span key={skill} className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-text-primary">
                  {skill}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-8 flex items-center justify-between border-t border-border/50 pt-5">
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                profilix.site/johndoe
              </div>
              <Button size="sm" variant="outline" className="h-8 text-xs">
                View Full Profile <ArrowRight className="ml-1.5 h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
