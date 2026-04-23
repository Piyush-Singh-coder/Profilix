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
            Premium Developer Identity
          </div>
          <h1 className="mt-7 font-heading text-6xl font-black leading-[1.03] tracking-tight text-text-primary sm:text-7xl lg:text-[80px]">
            Create.
            <br />
            Impress.
            <br />
            <span className="animated-gradient-text">Get Hired.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">
            Stop sending five links. Profilix is the <strong>easiest way to generate best-in-class, ATS-friendly resumes</strong> and premium developer identity cards from one setup.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            {isAuthenticated ? (
              <>
                <Link href={`/u/${user?.username}`}>
                  <Button size="lg">View My Profile</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="group">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg">Build My Profile Free</Button>
                </Link>
                <Link href="/u/piyushsingh">
                  <Button variant="outline" size="lg" className="group">
                    See Live Example
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="mt-12 flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-high border border-border shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-text-primary">Live community-driven platform</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.15, ease: "easeOut" }}
          className="relative hidden lg:block"
        >
          <motion.div
            animate={{ y: [-6, 8, -6] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="glass-panel relative mx-auto w-full max-w-[430px] rounded-[30px] p-8"
          >
            <div className="text-center">
              <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border border-secondary/50 bg-surface-high p-1">
                <Image src="https://api.dicebear.com/7.x/notionists/svg?seed=alex" alt="Alex avatar" width={96} height={96} />
              </div>
              <h3 className="mt-4 font-heading text-2xl font-bold text-text-primary">Alex Developer</h3>
              <p className="text-sm text-text-secondary">Senior Full-Stack Engineer</p>
            </div>

            <div className="mt-8 rounded-xl border border-border bg-surface-low p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-text-secondary">
                <FaGithub className="h-4 w-4" />
                <span>2,104 contributions</span>
              </div>
              <div className="flex gap-1">
                {GRID_OPACITY.map((column, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-1">
                    {column.map((opacity, rowIndex) => (
                      <div
                        key={`${colIndex}-${rowIndex}`}
                        className="h-3 w-3 rounded-sm bg-[#39d353]"
                        style={{ opacity }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              {isAuthenticated ? (
                <Link href={`/u/${user?.username}`}>
                  <Button className="w-full">View Full Profile</Button>
                </Link>
              ) : (
                <Link href="/register">
                  <Button className="w-full">Build My Profile Free</Button>
                </Link>
              )}
              <Button variant="outline" size="icon" className="shrink-0">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
