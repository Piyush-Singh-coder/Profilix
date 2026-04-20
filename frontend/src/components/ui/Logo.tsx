"use client";

import Image from "next/image";
import imageKitLoader from "@/lib/imagekitLoader";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
  priority?: boolean;
}

/**
 * Standardized Brand Logo Component
 * Optimized with ImageKit loader for maximum Lighthouse performance.
 */
export function Logo({ size = 120, className, priority = true }: LogoProps) {
  return (
    <Image
      loader={imageKitLoader}
      src="profilix_Logo.png" // The loader will prepend the endpoint
      alt="Profilix Logo"
      width={size}
      height={size}
      priority={priority}
      quality={75}
      className={cn("object-contain", className)}
    />
  );
}
