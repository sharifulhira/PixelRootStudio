import { db } from "@/lib/db";
import { pageViews } from "@/lib/db/schema";
import { desc, gte } from "drizzle-orm";

export type AnalyticsPeriod = "7d" | "30d" | "all";

export type AnalyticsReport = {
  period: AnalyticsPeriod;
  totals: {
    views: number;
    visitors: number;
    viewsToday: number;
    visitorsToday: number;
  };
  topPages: { path: string; views: number; visitors: number }[];
  sources: { source: string; views: number; percent: number }[];
  dailyViews: { date: string; label: string; views: number; visitors: number }[];
  devices: { device: string; views: number; percent: number }[];
  browsers: { browser: string; views: number }[];
  recentViews: {
    path: string;
    source: string;
    device: string | null;
    browser: string | null;
    createdAt: string;
  }[];
};

function periodStart(period: AnalyticsPeriod): Date | null {
  if (period === "all") return null;
  const days = period === "7d" ? 7 : 30;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - (days - 1));
  return d;
}

function todayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getAnalyticsReport(period: AnalyticsPeriod = "30d"): AnalyticsReport {
  const start = periodStart(period);
  const today = todayStart();

  const allInPeriod = start
    ? db.select().from(pageViews).where(gte(pageViews.createdAt, start)).all()
    : db.select().from(pageViews).all();

  const views = allInPeriod.length;
  const visitors = new Set(allInPeriod.map((v) => v.sessionId)).size;

  const todayRows = allInPeriod.filter((v) => v.createdAt && v.createdAt >= today);
  const viewsToday = todayRows.length;
  const visitorsToday = new Set(todayRows.map((v) => v.sessionId)).size;

  const pageMap: Record<string, { views: number; sessions: Set<string> }> = {};
  for (const row of allInPeriod) {
    if (!pageMap[row.path]) pageMap[row.path] = { views: 0, sessions: new Set() };
    pageMap[row.path].views++;
    pageMap[row.path].sessions.add(row.sessionId);
  }
  const topPages = Object.entries(pageMap)
    .map(([path, data]) => ({
      path,
      views: data.views,
      visitors: data.sessions.size,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  const sourceMap: Record<string, number> = {};
  for (const row of allInPeriod) {
    const src = row.source || "Direct";
    sourceMap[src] = (sourceMap[src] || 0) + 1;
  }
  const sources = Object.entries(sourceMap)
    .map(([source, count]) => ({
      source,
      views: count,
      percent: views > 0 ? Math.round((count / views) * 100) : 0,
    }))
    .sort((a, b) => b.views - a.views);

  const deviceMap: Record<string, number> = {};
  for (const row of allInPeriod) {
    const d = row.device || "unknown";
    deviceMap[d] = (deviceMap[d] || 0) + 1;
  }
  const devices = Object.entries(deviceMap)
    .map(([device, count]) => ({
      device,
      views: count,
      percent: views > 0 ? Math.round((count / views) * 100) : 0,
    }))
    .sort((a, b) => b.views - a.views);

  const browserMap: Record<string, number> = {};
  for (const row of allInPeriod) {
    const b = row.browser || "unknown";
    browserMap[b] = (browserMap[b] || 0) + 1;
  }
  const browsers = Object.entries(browserMap)
    .map(([browser, count]) => ({ browser, views: count }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  const dayCount = period === "7d" ? 7 : period === "30d" ? 30 : 14;
  const dailyBuckets: { date: string; label: string; views: number; sessions: Set<string> }[] = [];
  const now = new Date();
  for (let i = dayCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const label =
      dayCount <= 7
        ? d.toLocaleDateString("en-US", { weekday: "short" })
        : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dailyBuckets.push({ date, label, views: 0, sessions: new Set() });
  }

  for (const row of allInPeriod) {
    if (!row.createdAt) continue;
    const d = row.createdAt;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const bucket = dailyBuckets.find((b) => b.date === key);
    if (bucket) {
      bucket.views++;
      bucket.sessions.add(row.sessionId);
    }
  }

  const dailyViews = dailyBuckets.map((b) => ({
    date: b.date,
    label: b.label,
    views: b.views,
    visitors: b.sessions.size,
  }));

  const recent = start
    ? db.select().from(pageViews).where(gte(pageViews.createdAt, start)).orderBy(desc(pageViews.createdAt)).limit(15).all()
    : db.select().from(pageViews).orderBy(desc(pageViews.createdAt)).limit(15).all();

  const recentViews = recent.map((r) => ({
    path: r.path,
    source: r.source,
    device: r.device,
    browser: r.browser,
    createdAt: r.createdAt?.toISOString() || new Date().toISOString(),
  }));

  return {
    period,
    totals: { views, visitors, viewsToday, visitorsToday },
    topPages,
    sources,
    dailyViews,
    devices,
    browsers,
    recentViews,
  };
}
