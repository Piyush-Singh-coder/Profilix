"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Users } from "lucide-react";
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

import { HeroProfileMockup } from "./HeroProfileMockup";

export function Hero() {
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-[70vh] md:min-h-[85vh] w-full overflow-hidden pb-12 md:pb-10 pt-32 md:pt-24">
      <div className="pointer-events-none absolute inset-0 z-0 hidden">
        {/* Removed giant glowing blobs to match strict dark background mockup */}
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
          <h1 className="mt-4 md:mt-7 font-heading text-4xl font-black leading-[1.1] tracking-tight text-text-primary sm:text-7xl lg:text-[80px]">
            Developer Portfolio
            <br />
            Builder & <span className="animated-gradient-text">ATS Resume Maker.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">
            Sync GitHub activity, showcase your profile in our public developer directory, parse PDF resumes, write cover letters with AI, track analytics, and export ATS-friendly resume templates in PDF & Word DOCX formats.
          </p>

          <div className="mt-6 md:mt-10 flex flex-col gap-4 sm:flex-row">
            {isAuthenticated ? (
              <>
                <Link href={`/u/${user?.username}`}>
                  <Button size="lg" className="w-full sm:w-auto">View My Profile</Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto group border-transparent bg-surface-low hover:bg-surface-high gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Explore Community
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">Create Your Profile</Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto group border-transparent bg-surface-low hover:bg-surface-high gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Explore Community
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="mt-6 md:mt-12 flex items-center gap-8">
            <div className="flex -space-x-3">
              <Image className="h-10 w-10 rounded-full border-2 border-background" src="https://api.dicebear.com/7.x/notionists/svg?seed=1" alt="User 1" width={40} height={40} />
              <Image className="h-10 w-10 rounded-full border-2 border-background" src="https://api.dicebear.com/7.x/notionists/svg?seed=2" alt="User 2" width={40} height={40} />
              <Image className="h-10 w-10 rounded-full border-2 border-background" src="https://api.dicebear.com/7.x/notionists/svg?seed=3" alt="User 3" width={40} height={40} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Join developers building their professional presence</p>
              <div className="flex text-[#F59E0B] mt-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15, ease: "easeOut" }}
          className="relative hidden lg:block"
        >
          <div className="relative translate-x-6 -translate-y-8 lg:-translate-y-12 scale-100 xl:scale-110">
             <HeroProfileMockup />
             
             {/* Decorative blob behind mockup for better blending */}
             <div className="absolute -inset-10 -z-10 bg-primary/5 blur-3xl rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
