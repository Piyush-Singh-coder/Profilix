"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";

export function ActionSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoUrl = "https://www.youtube.com/watch?v=fD0Hw3J0C7s";
  const thumbnailUrl = "https://ik.imagekit.io/v6xwevpjp/Profilix/profilix-yt-thumbnail.png";

  return (
    <section className="relative py-24 bg-surface-low border-y border-border/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="font-heading text-3xl font-black text-text-primary sm:text-4xl">
            See Profilix <span className="text-primary">in Action.</span>
          </h2>
          <p className="mt-4 text-text-secondary">
            Watch how easy it is to create and share your professional identity.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          className="mx-auto max-w-4xl"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border/60 shadow-2xl glass-panel group cursor-pointer" onClick={() => !isPlaying && setIsPlaying(true)}>
            <AnimatePresence mode="wait">
              {!isPlaying ? (
                <motion.div 
                  key="thumbnail"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10"
                >
                  <Image 
                    src={thumbnailUrl} 
                    alt="Profilix Demo Thumbnail" 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/30 flex items-center justify-center">
                    <div className="relative">
                      {/* Animated Rings */}
                      <div className="absolute inset-0 -m-4 rounded-full border border-primary/30 animate-ping opacity-75" />
                      <div className="absolute inset-0 -m-8 rounded-full border border-primary/10 animate-ping [animation-delay:0.5s] opacity-50" />
                      
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-xl shadow-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary-hover">
                        <Play className="h-8 w-8 text-white fill-white ml-1" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="video"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0"
                >
                  <iframe
                    className="w-full h-full"
                    src={videoUrl}
                    title="Profilix Demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
