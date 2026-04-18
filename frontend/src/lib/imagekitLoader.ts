/**
 * ImageKit Loader for Next.js Image component
 * This allows us to use ImageKit's real-time optimization and transformation engine.
 */
export default function imageKitLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith('/')) src = src.slice(1);
  
  // Base URL for ImageKit
  const endpoint = "https://ik.imagekit.io/v6xwevpjp/Profilix";
  
  // Clean the source URL if it already contains the endpoint
  const path = src.replace(endpoint, "").replace(/^\//, "");
  
  // Transformation parameters
  // f-auto: Automatically chooses best format (WebP, AVIF, etc.)
  // q-auto: Automatically optimizes quality based on image content
  // w: Sets the width for responsive delivery
  const params = [`w-${width}`, `f-auto`, `q-${quality || "auto"}`];
  
  return `${endpoint}/tr:${params.join(",")}/${path}`;
}
