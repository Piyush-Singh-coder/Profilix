"use client";

import { useEffect, useMemo } from "react";
import { Activity, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAnalyticsStore } from "@/store/useAnalyticsStore";
import { AnalyticsEventType } from "@/types";

const EVENT_LABELS: Record<AnalyticsEventType, string> = {
  PROFILE_VIEW: "Profile Views",
  RESUME_DOWNLOAD: "Resume Downloads",
  SOCIAL_LINK_CLICK: "Social Clicks",
  QR_SCAN: "QR Scans",
  OG_IMAGE_RENDER: "OG Image Renders",
};

const EVENT_COLORS: Record<AnalyticsEventType, string> = {
  PROFILE_VIEW: "bg-sky-500",
  RESUME_DOWNLOAD: "bg-emerald-500",
  SOCIAL_LINK_CLICK: "bg-amber-500",
  QR_SCAN: "bg-indigo-500",
  OG_IMAGE_RENDER: "bg-slate-500",
};

function timeAgo(isoDate: string) {
  const now = Date.now();
  const date = new Date(isoDate).getTime();
  const diffSeconds = Math.max(1, Math.floor((now - date) / 1000));
  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  return `${Math.floor(diffSeconds / 86400)}d ago`;
}

export default function AnalyticsPage() {
  const { summary, recentEvents, isLoading, error, fetchAnalytics } = useAnalyticsStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const total = useMemo(() => summary.reduce((acc, row) => acc + row.count, 0), [summary]);

  const summaryMap = useMemo(() => {
    return summary.reduce<Record<string, number>>((acc, item) => {
      acc[item.event] = item.count;
      return acc;
    }, {});
  }, [summary]);

  const trendBars = useMemo(() => {
    const buckets = Array.from({ length: 7 }, (_, idx) => {
      const day = new Date();
      day.setDate(day.getDate() - (6 - idx));
      const key = day.toISOString().slice(0, 10);
      return { key, total: 0 };
    });

    for (const event of recentEvents) {
      const key = event.timestamp.slice(0, 10);
      const bucket = buckets.find((item) => item.key === key);
      if (bucket) bucket.total += 1;
    }
    return buckets;
  }, [recentEvents]);

  const maxTrendValue = Math.max(...trendBars.map((bucket) => bucket.total), 1);

  if (isLoading && summary.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-in space-y-8 pb-24">
      <div className="border-b border-border pb-5">
        <h1 className="font-heading text-3xl font-bold">Analytics</h1>
        <p className="mt-1 text-sm text-text-secondary">Track profile engagement and interaction patterns.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(Object.keys(EVENT_LABELS) as AnalyticsEventType[]).map((eventType) => (
          <Card key={eventType} variant="surface">
            <CardContent className="space-y-1">
              <p className="text-xs uppercase tracking-[0.16em] text-text-secondary">{EVENT_LABELS[eventType]}</p>
              <p className="font-heading text-3xl font-bold">{summaryMap[eventType] || 0}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card variant="glass" className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Weekly Trend</CardTitle>
            <CardDescription>Event volume from the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-44 items-end gap-3">
              {trendBars.map((bar) => (
                <div key={bar.key} className="flex flex-1 flex-col items-center gap-2">
                  <div className="relative flex h-32 w-full items-end">
                    <div
                      className="w-full rounded-t-md bg-primary/75 transition-all"
                      style={{
                        height: `${Math.max((bar.total / maxTrendValue) * 100, bar.total === 0 ? 4 : 12)}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-text-secondary">{bar.key.slice(5)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card variant="surface" className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Event Mix</CardTitle>
            <CardDescription>{total} total interactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(Object.keys(EVENT_LABELS) as AnalyticsEventType[]).map((eventType) => {
              const value = summaryMap[eventType] || 0;
              const percentage = total > 0 ? (value / total) * 100 : 0;
              return (
                <div key={eventType} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <p className="text-text-secondary">{EVENT_LABELS[eventType]}</p>
                    <p className="font-semibold text-text-primary">{value}</p>
                  </div>
                  <div className="h-2 rounded-full bg-surface-low">
                    <div className={`h-2 rounded-full ${EVENT_COLORS[eventType]}`} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card variant="surface">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest events from your public profile.</CardDescription>
        </CardHeader>
        <CardContent>
          {recentEvents.length === 0 ? (
            <div className="rounded-[var(--radius-md)] border border-dashed border-border p-8 text-center text-sm text-text-secondary">
              No recent activity yet. Share your profile to start collecting insights.
            </div>
          ) : (
            <div className="space-y-2">
              {recentEvents.slice(0, 30).map((event, index) => (
                <div
                  key={`${event.timestamp}-${index}`}
                  className="flex items-center justify-between rounded-[var(--radius-md)] border border-border bg-surface-low px-3 py-2"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="h-4 w-4 text-primary" />
                    <span>{EVENT_LABELS[event.eventType] || event.eventType}</span>
                  </div>
                  <p className="text-xs text-text-secondary">{timeAgo(event.timestamp)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
