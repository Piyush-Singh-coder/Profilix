import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function CTABanner() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* CTA Box */}
        <div className="relative overflow-hidden rounded-[32px] border border-border/80 bg-surface-low p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
          {/* Subtle Background Glow */}
          <div className="absolute -right-24 -top-24 h-[300px] w-[300px] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

          <div className="relative z-10 text-center md:text-left max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-heading font-black text-text-primary mb-4 tracking-tight">
              Ready to build your professional brand?
            </h2>
            <p className="text-text-secondary text-base md:text-lg">
              Join thousands of professionals who trust Profilix.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full md:w-auto px-10 py-7 text-lg font-bold shadow-xl shadow-primary/20"
              >
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>

        {/* Logo Strip */}
        <div className="mt-20 flex flex-wrap justify-center lg:justify-between items-center gap-10 opacity-50 grayscale">
          <div className="text-2xl font-bold font-heading text-text-primary">
            Google
          </div>
          <div className="text-2xl font-bold font-heading text-text-primary flex items-center gap-2">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
            </svg>{" "}
            Microsoft
          </div>
          <div className="text-2xl font-bold font-heading text-text-primary tracking-tighter">
            amazon
          </div>
          <div className="text-2xl font-bold font-heading text-text-primary">
            airbnb
          </div>
          <div className="text-2xl font-bold font-heading text-text-primary tracking-tight">
            Spotify
          </div>
          <div className="text-2xl font-bold font-heading text-text-primary">
            Notion
          </div>
        </div>
      </div>
    </section>
  );
}
