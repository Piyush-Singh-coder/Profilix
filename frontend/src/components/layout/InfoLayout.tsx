"use client";

import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { cn } from "@/lib/utils";

interface InfoLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  lastUpdated?: string;
  className?: string;
}

export function InfoLayout({
  children,
  title,
  description,
  lastUpdated,
  className,
}: InfoLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        {/* Subtle Background Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />

        <article className={cn("container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl", className)}>
          <header className="mb-16 text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
                {description}
              </p>
            )}
            {lastUpdated && (
              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-text-secondary/60 font-medium">
                <span className="w-8 h-px bg-border/50" />
                <span>Last Updated: {lastUpdated}</span>
                <span className="w-8 h-px bg-border/50" />
              </div>
            )}
          </header>

          <div className="prose prose-invert prose-primary max-w-none 
            prose-headings:font-heading prose-headings:font-bold prose-headings:text-text-primary
            prose-p:text-text-secondary prose-p:leading-[1.8] prose-p:mb-8
            prose-li:text-text-secondary prose-li:mb-2
            prose-strong:text-text-primary prose-strong:font-bold
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-hr:border-border/50
          ">
            {children}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
