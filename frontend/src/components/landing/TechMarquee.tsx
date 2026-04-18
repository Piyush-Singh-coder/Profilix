import Image from "next/image";

const row1 = ["react", "nextdotjs", "vuedotjs", "nodedotjs", "express", "go", "python", "rust", "typescript"];
const row2 = ["javascript", "nodedotjs", "postgresql", "mysql", "mongodb", "redis", "docker", "kubernetes", "vuedotjs"];

function TechTile({ tech }: { tech: string }) {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface grayscale transition-all duration-300 hover:scale-110 hover:border-primary/40 hover:grayscale-0">
      <Image src={`https://cdn.simpleicons.org/${tech}`} alt={tech} width={30} height={30} />
    </div>
  );
}

export function TechMarquee() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="mx-auto mb-14 max-w-6xl px-6 text-center">
        <h2 className="font-heading text-4xl font-black text-text-primary sm:text-5xl">Built for the modern stack</h2>
        <p className="mt-3 text-sm text-text-secondary">React, cloud, databases and tooling your portfolio already uses.</p>
      </div>

      <div className="relative flex flex-col gap-8 overflow-hidden">
        <div className="flex min-w-full overflow-hidden whitespace-nowrap">
          <div className="flex shrink-0 animate-marquee gap-7 px-3">
            {[...row1, ...row1, ...row1].map((tech, index) => (
              <TechTile key={`${tech}-row1-${index}`} tech={tech} />
            ))}
          </div>
        </div>
        <div className="flex min-w-full overflow-hidden whitespace-nowrap">
          <div className="flex shrink-0 animate-marquee-reverse gap-7 px-3">
            {[...row2, ...row2, ...row2].map((tech, index) => (
              <TechTile key={`${tech}-row2-${index}`} tech={tech} />
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
}
