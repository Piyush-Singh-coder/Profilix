"use client";

import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import Image from "next/image";
import { Logo } from "@/components/ui/Logo";

export function VideoShowcase() {
  const videoThumbnail = "https://ik.imagekit.io/v6xwevpjp/Profilix/profilix-yt-thumbnail.png?updatedAt=1777139598329";
  const youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-6"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Product Tour
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-heading font-black text-text-primary mb-6"
          >
            See Profilix <span className="text-primary">in Action</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-text-secondary text-lg max-w-2xl mx-auto"
          >
            Watch how easy it is to create your professional identity, sync your GitHub, and generate stunning profile cards and resumes in minutes.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-[40px] pointer-events-none" />
          <div className="relative group cursor-pointer overflow-hidden rounded-[32px] border border-border/50 bg-surface shadow-2xl">
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="block relative aspect-video">
              <Image 
                src={videoThumbnail} 
                alt="Profilix Video Showcase" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity group-hover:opacity-40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -inset-6 bg-primary/30 blur-2xl rounded-full animate-pulse group-hover:bg-primary/50" />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-primary-hover">
                    <Play className="h-10 w-10 fill-current ml-1" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center justify-between translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center p-2">
                    <Logo size={40} className="h-8 w-8 brightness-0 invert" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Platform Walkthrough</p>
                    <p className="text-white/70 text-sm">3:45 • Watch on YouTube</p>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
