"use client";

import { useEffect, useState } from "react";
import { Search, Users, Loader2, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommunityCard } from "@/components/landing/CommunityCard";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { ProfileStatus, TechStack } from "@/types";

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "LOOKING_FOR_ROLES", label: "Looking For Roles" },
  { value: "OPEN_TO_HACKATHONS", label: "Open To Hackathons" },
  { value: "BUILDING_SOMETHING", label: "Building Something" },
  { value: "AVAILABLE_FOR_FREELANCE", label: "Available For Freelance" },
  { value: "NOT_AVAILABLE", label: "Not Available" },
];

export default function CommunityClientPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProfiles, setTotalProfiles] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [tech, setTech] = useState("ALL");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 450);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, tech]);

  // Fetch tech stack options once on load
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const { data } = await api.get("/u/tech-stacks");
        if (data.success) {
          setTechStacks(data.data);
        }
      } catch (err) {
        console.error("Failed to load tech stack filter options", err);
      }
    };
    fetchFilters();
  }, []);

  // Fetch profiles when page or filters update
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: "12",
        });

        if (debouncedSearch.trim()) {
          queryParams.append("search", debouncedSearch.trim());
        }
        if (status !== "ALL") {
          queryParams.append("status", status);
        }
        if (tech !== "ALL") {
          queryParams.append("tech", tech);
        }

        const { data } = await api.get(`/u/community?${queryParams.toString()}`);
        if (data.success) {
          setProfiles(data.data.profiles);
          setTotalPages(data.data.pagination.pages);
          setTotalProfiles(data.data.pagination.total);
        }
      } catch (err) {
        console.error("Failed to fetch community profiles", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [page, debouncedSearch, status, tech]);

  // Available tech stack select list
  const techOptions = [
    { value: "ALL", label: "All Technologies" },
    ...techStacks.map((t) => ({ value: t.slug, label: t.name })),
  ];

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/30 bg-background/35 py-10 md:py-12 mt-20">
        {/* Radial Background Glow */}
        <div className="absolute left-1/2 top-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto max-w-7xl px-6 text-center lg:px-8 relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest shadow-lg shadow-primary/5 animate-pulse">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Developer Directory
          </div>
          <h1 className="font-heading text-4xl font-black text-text-primary md:text-6xl tracking-tight leading-none">
            Discover <span className="animated-gradient-text">Tech Talents</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm md:text-lg text-text-secondary leading-relaxed font-body font-medium">
            Discover peers, find teammates for hackathons, and connect with developers across the globe. Endorse profiles, upvote skills, and explore real-time GitHub contributions.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="container mx-auto max-w-7xl px-6 py-8 relative z-30">
        <div className="glass-panel flex flex-col gap-4 rounded-3xl p-5 md:flex-row md:items-center">
          {/* Search Box */}
          <div className="relative flex-1">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, location, or keyword..."
              className="pl-10"
            />
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          </div>

          {/* Status Select */}
          <div className="w-full md:w-60">
            <Select
              options={STATUS_OPTIONS}
              value={status}
              onChange={setStatus}
              placeholder="Filter by availability"
            />
          </div>

          {/* Tech Select */}
          <div className="w-full md:w-60">
            <Select
              options={techOptions}
              value={tech}
              onChange={setTech}
              placeholder="Filter by technology"
            />
          </div>
        </div>
      </section>

      {/* Profiles Grid */}
      <section className="container mx-auto max-w-7xl px-6 pb-24 relative z-10">
        {loading ? (
          /* Loading Skeletons */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-panel h-64 animate-pulse rounded-3xl border border-border/40 bg-surface-low/30 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-border" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 rounded bg-border" />
                    <div className="h-3 w-16 rounded bg-border" />
                  </div>
                </div>
                <div className="h-16 w-full rounded bg-border" />
                <div className="flex gap-2">
                  <div className="h-5 w-12 rounded bg-border" />
                  <div className="h-5 w-16 rounded bg-border" />
                </div>
              </div>
            ))}
          </div>
        ) : profiles.length === 0 ? (
          /* Empty State */
          <div className="rounded-[var(--radius-lg)] border border-dashed border-border/80 bg-surface-low/20 py-20 text-center">
            <Users className="mx-auto h-12 w-12 text-text-muted opacity-40" />
            <h2 className="mt-4 font-heading text-xl font-bold text-text-primary">No profiles found</h2>
            <p className="mt-2 text-sm text-text-secondary">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          /* Results Grid */
          <div>
            <div className="mb-4 flex items-center justify-between text-xs text-text-secondary">
              <span>Showing {profiles.length} of {totalProfiles} profiles</span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {profiles.map((profile) => (
                <CommunityCard key={profile.id} profile={profile} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-xl border-border bg-surface hover:border-primary/40 text-text-secondary disabled:opacity-40"
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => {
                    const isCurrent = pNum === page;
                    return isCurrent ? (
                      <span
                        key={pNum}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-md shadow-primary/20"
                      >
                        {pNum}
                      </span>
                    ) : (
                      <Button
                        key={pNum}
                        variant="outline"
                        onClick={() => setPage(pNum)}
                        className="h-10 w-10 rounded-xl border-border bg-surface text-sm font-medium hover:border-primary/40 text-text-secondary"
                      >
                        {pNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-xl border-border bg-surface hover:border-primary/40 text-text-secondary disabled:opacity-40"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
