"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { AnalyticsPeriod, AnalyticsReport } from "@/lib/analytics/stats";

const SOURCE_COLORS = [
  "#fbbf24",
  "#60a5fa",
  "#34d399",
  "#a78bfa",
  "#f472b6",
  "#fb923c",
  "#94a3b8",
];

const DEVICE_LABELS: Record<string, string> = {
  mobile: "Mobile",
  desktop: "Desktop",
  tablet: "Tablet",
  unknown: "Unknown",
};

function formatPage(path: string) {
  if (path === "/") return "Home";
  return path.replace(/^\//, "").split("/").map((s) => s.replace(/-/g, " ")).join(" / ");
}

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/45 mt-1">{label}</p>
      {sub && <p className="text-[10px] text-white/30 mt-0.5">{sub}</p>}
    </div>
  );
}

type Props = {
  initialReport: AnalyticsReport;
  compact?: boolean;
};

export function VisitorAnalytics({ initialReport, compact = false }: Props) {
  const [period, setPeriod] = useState<AnalyticsPeriod>(initialReport.period);
  const [report, setReport] = useState(initialReport);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (period === initialReport.period) return;
    setLoading(true);
    fetch(`/api/admin/analytics?period=${period}`)
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [period]);

  const maxDaily = Math.max(...report.dailyViews.map((d) => d.views), 1);
  const maxPages = Math.max(...report.topPages.map((p) => p.views), 1);

  if (compact) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Visitor Statistics</h3>
            <p className="text-[11px] text-white/40 mt-0.5">Last 30 days — page views & traffic sources</p>
          </div>
          <Link
            href="/admin/analytics"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 border border-amber-500/25 rounded-lg px-3 py-1.5 hover:bg-amber-500/10"
          >
            Full Analytics →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <StatCard label="Page views" value={report.totals.views} />
          <StatCard label="Visitors" value={report.totals.visitors} />
          <StatCard label="Views today" value={report.totals.viewsToday} />
          <StatCard label="Visitors today" value={report.totals.visitorsToday} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-2">Top pages</p>
            {report.topPages.length === 0 ? (
              <p className="text-xs text-white/35">No visits recorded yet</p>
            ) : (
              <ul className="space-y-2">
                {report.topPages.slice(0, 5).map((p) => (
                  <li key={p.path} className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-white/60 truncate">{formatPage(p.path)}</span>
                    <span className="text-white font-medium shrink-0">{p.views}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-2">Traffic sources</p>
            {report.sources.length === 0 ? (
              <p className="text-xs text-white/35">No source data yet</p>
            ) : (
              <ul className="space-y-2">
                {report.sources.slice(0, 5).map((s, i) => (
                  <li key={s.source} className="flex items-center gap-2 text-xs">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: SOURCE_COLORS[i % SOURCE_COLORS.length] }}
                    />
                    <span className="text-white/60 truncate flex-1">{s.source}</span>
                    <span className="text-white/40 shrink-0">{s.percent}%</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={loading ? "opacity-60 pointer-events-none" : ""}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Visitor Analytics</h2>
          <p className="text-sm text-white/50 mt-1">Page views, unique visitors, traffic sources & devices</p>
        </div>
        <div className="flex gap-2">
          {(["7d", "30d", "all"] as AnalyticsPeriod[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                period === p
                  ? "bg-amber-500 text-slate-900"
                  : "bg-white/5 border border-white/10 text-white/50 hover:text-white"
              }`}
            >
              {p === "7d" ? "7 days" : p === "30d" ? "30 days" : "All time"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard label="Total page views" value={report.totals.views} />
        <StatCard label="Unique visitors" value={report.totals.visitors} />
        <StatCard label="Views today" value={report.totals.viewsToday} />
        <StatCard label="Visitors today" value={report.totals.visitorsToday} sub="Since midnight" />
      </div>

      {/* Daily chart */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
        <h3 className="text-sm font-semibold text-white mb-1">Views over time</h3>
        <p className="text-[11px] text-white/40 mb-4">Daily page views & unique visitors</p>
        {report.dailyViews.every((d) => d.views === 0) ? (
          <p className="text-xs text-white/35 text-center py-8">No visits in this period</p>
        ) : (
          <>
            <div className="flex items-end justify-between gap-1 h-32">
              {report.dailyViews.map((day) => (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                  <div className="flex items-end justify-center w-full h-24 gap-px">
                    <div
                      className="w-[45%] bg-amber-500/70 rounded-t-sm"
                      style={{
                        height: `${(day.views / maxDaily) * 100}%`,
                        minHeight: day.views > 0 ? 3 : 0,
                      }}
                      title={`${day.views} views`}
                    />
                    <div
                      className="w-[45%] bg-blue-400/60 rounded-t-sm"
                      style={{
                        height: `${(day.visitors / maxDaily) * 100}%`,
                        minHeight: day.visitors > 0 ? 3 : 0,
                      }}
                      title={`${day.visitors} visitors`}
                    />
                  </div>
                  <span className="text-[8px] sm:text-[9px] text-white/35 truncate w-full text-center">
                    {day.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-3 pt-3 border-t border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/70" />
                <span className="text-[10px] text-white/40">Page views</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-400/60" />
                <span className="text-[10px] text-white/40">Visitors</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top pages */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white">Top Pages</h3>
            <p className="text-[11px] text-white/40">Most visited pages</p>
          </div>
          {report.topPages.length === 0 ? (
            <p className="text-xs text-white/35 p-5 text-center">No page data yet</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {report.topPages.map((page) => (
                <li key={page.path} className="px-5 py-3">
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">{formatPage(page.path)}</p>
                      <p className="text-[10px] text-white/35 truncate">{page.path}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-white">{page.views}</p>
                      <p className="text-[10px] text-white/35">{page.visitors} visitors</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500/60 rounded-full"
                      style={{ width: `${(page.views / maxPages) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Traffic sources */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white">Traffic Sources</h3>
            <p className="text-[11px] text-white/40">Where visitors come from</p>
          </div>
          {report.sources.length === 0 ? (
            <p className="text-xs text-white/35 p-5 text-center">No source data yet</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {report.sources.map((src, i) => (
                <li key={src.source} className="px-5 py-3">
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: SOURCE_COLORS[i % SOURCE_COLORS.length] }}
                      />
                      <span className="text-sm text-white truncate">{src.source}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-semibold text-white">{src.views}</span>
                      <span className="text-[10px] text-white/35 ml-1.5">({src.percent}%)</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${src.percent}%`,
                        backgroundColor: SOURCE_COLORS[i % SOURCE_COLORS.length],
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Devices */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Devices</h3>
          {report.devices.length === 0 ? (
            <p className="text-xs text-white/35">No data</p>
          ) : (
            <ul className="space-y-3">
              {report.devices.map((d) => (
                <li key={d.device}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">{DEVICE_LABELS[d.device] || d.device}</span>
                    <span className="text-white">{d.percent}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400/60 rounded-full" style={{ width: `${d.percent}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Browsers */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Browsers</h3>
          {report.browsers.length === 0 ? (
            <p className="text-xs text-white/35">No data</p>
          ) : (
            <ul className="space-y-2">
              {report.browsers.map((b) => (
                <li key={b.browser} className="flex justify-between text-xs">
                  <span className="text-white/60">{b.browser}</span>
                  <span className="text-white font-medium">{b.views}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden lg:col-span-1">
          <div className="px-5 py-3 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white">Recent Visits</h3>
          </div>
          {report.recentViews.length === 0 ? (
            <p className="text-xs text-white/35 p-5 text-center">No recent visits</p>
          ) : (
            <ul className="divide-y divide-white/5 max-h-64 overflow-y-auto">
              {report.recentViews.map((v, i) => (
                <li key={i} className="px-4 py-2.5">
                  <p className="text-xs text-white truncate">{formatPage(v.path)}</p>
                  <div className="flex flex-wrap gap-x-2 text-[10px] text-white/35 mt-0.5">
                    <span>{v.source}</span>
                    <span>·</span>
                    <span>{DEVICE_LABELS[v.device || ""] || v.device}</span>
                    <span>·</span>
                    <span>{new Date(v.createdAt).toLocaleString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
