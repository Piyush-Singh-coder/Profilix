import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CTABanner() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
        <div className="rounded-3xl border border-primary/20 bg-surface/50 backdrop-blur-xl p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10 pointer-events-none" />
          
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 text-primary ring-1 ring-primary/30 shadow-[0_0_20px_var(--color-primary-glow)]">
            <Sparkles className="h-8 w-8" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-text-primary mb-6 leading-tight">
            Ready to build your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              ultimate developer identity?
            </span>
          </h2>
          
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Join developers, students, and freelancers who stopped sending 5 different links, and started sending one beautiful portfolio card.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full group">
                Create Your Profile Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-text-secondary mt-6">
            No credit card required. Takes 2 minutes.
          </p>
        </div>
      </div>
    </section>
  );
}
