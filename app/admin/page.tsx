import { db } from "@/lib/db";
import { projects, galleryItems, packages, bookings, leads } from "@/lib/db/schema";
import { sql, eq } from "drizzle-orm";
import Link from "next/link";
import { adminNavGroups } from "@/components/admin/layout/nav-config";
import { BookingCalendarCompact } from "@/components/admin/booking-calendar-compact";
import { DashboardCharts, type DashboardChartData } from "@/components/admin/dashboard-charts";
import { SiteHealthPanel } from "@/components/admin/site-health-panel";
import { runSiteHealthAudit } from "@/lib/site-health/audit";
import { getAnalyticsReport } from "@/lib/analytics/stats";
import { VisitorAnalytics } from "@/components/admin/visitor-analytics";
import { getCalendarBookings } from "@/lib/admin/calendar-bookings";

export const dynamic = "force-dynamic";

const BOOKING_STATUS_COLORS: Record<string, string> = {
  pending: "#facc15",
  confirmed: "#60a5fa",
  completed: "#34d399",
  cancelled: "#f87171",
};

const LEAD_STATUS_COLORS: Record<string, string> = {
  new: "#facc15",
  contacted: "#60a5fa",
  converted: "#34d399",
  closed: "#94a3b8",
};

const PACKAGE_COLORS = ["#fbbf24", "#60a5fa", "#34d399", "#a78bfa", "#f472b6", "#fb923c"];

function countByField<T extends string>(
  rows: { value: T | null }[],
  order: T[],
  colors: Record<string, string> | string[]
): { label: string; value: number; color: string }[] {
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const key = row.value || "unknown";
    counts[key] = (counts[key] || 0) + 1;
  }
  const keys = order.length > 0 ? order : Object.keys(counts);
  return keys
    .filter((k) => counts[k] > 0)
    .map((k, i) => ({
      label: k,
      value: counts[k],
      color: Array.isArray(colors)
        ? colors[i % colors.length]
        : colors[k] || "#94a3b8",
    }));
}

function getLast6Months() {
  const months: { month: string; label: string }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "short" });
    months.push({ month, label });
  }
  return months;
}

function monthKeyFromDate(date: Date | null | undefined) {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getChartData(stats: ReturnType<typeof getStats>): DashboardChartData {
  const allBookings = db.select({ status: bookings.status, packageName: bookings.packageName, createdAt: bookings.createdAt }).from(bookings).all();
  const allLeads = db.select({ status: leads.status, createdAt: leads.createdAt }).from(leads).all();

  const bookingsByStatus = countByField(
    allBookings.map((b) => ({ value: b.status })),
    ["pending", "confirmed", "completed", "cancelled"],
    BOOKING_STATUS_COLORS
  );

  const leadsByStatus = countByField(
    allLeads.map((l) => ({ value: l.status })),
    ["new", "contacted", "converted", "closed"],
    LEAD_STATUS_COLORS
  );

  const packageCounts: Record<string, number> = {};
  for (const b of allBookings) {
    const name = b.packageName?.trim() || "Custom Inquiry";
    packageCounts[name] = (packageCounts[name] || 0) + 1;
  }
  const bookingsByPackage = Object.entries(packageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value], i) => ({
      label,
      value,
      color: PACKAGE_COLORS[i % PACKAGE_COLORS.length],
    }));

  const monthBuckets = getLast6Months();
  const leadMonths: Record<string, number> = {};
  const bookingMonths: Record<string, number> = {};
  for (const m of monthBuckets) {
    leadMonths[m.month] = 0;
    bookingMonths[m.month] = 0;
  }
  for (const l of allLeads) {
    const key = monthKeyFromDate(l.createdAt);
    if (key && key in leadMonths) leadMonths[key]++;
  }
  for (const b of allBookings) {
    const key = monthKeyFromDate(b.createdAt);
    if (key && key in bookingMonths) bookingMonths[key]++;
  }

  const monthlyActivity = monthBuckets.map((m) => ({
    month: m.month,
    label: m.label,
    leads: leadMonths[m.month],
    bookings: bookingMonths[m.month],
  }));

  return {
    bookingsByStatus,
    leadsByStatus,
    monthlyActivity,
    bookingsByPackage,
    totals: {
      leads: allLeads.length,
      bookings: allBookings.length,
      projects: stats.projects,
      packages: stats.packages,
    },
  };
}

function getStats() {
  const projectCount = db.select({ count: sql<number>`count(*)` }).from(projects).get();
  const galleryCount = db.select({ count: sql<number>`count(*)` }).from(galleryItems).get();
  const packageCount = db.select({ count: sql<number>`count(*)` }).from(packages).get();
  const pendingLeads = db
    .select({ count: sql<number>`count(*)` })
    .from(leads)
    .where(eq(leads.status, "new"))
    .get();
  const pendingBookings = db
    .select({ count: sql<number>`count(*)` })
    .from(bookings)
    .where(eq(bookings.status, "pending"))
    .get();

  return {
    projects: projectCount?.count || 0,
    gallery: galleryCount?.count || 0,
    packages: packageCount?.count || 0,
    pendingLeads: pendingLeads?.count || 0,
    pendingBookings: pendingBookings?.count || 0,
  };
}

const statCards = [
  { key: "pendingLeads", label: "New Leads", href: "/admin/leads", highlight: true },
  { key: "pendingBookings", label: "Pending Bookings", href: "/admin/bookings", highlight: true },
  { key: "packages", label: "Packages", href: "/admin/packages" },
  { key: "projects", label: "Projects", href: "/admin/projects" },
] as const;

const groupDescriptions: Record<string, string> = {
  Business: "Analytics, invoices, leads, bookings, and packages",
  Homepage: "Sections displayed on the landing page",
  Portfolio: "Case studies and client work",
  Pages: "Standalone site pages",
  Settings: "Site health, SEO, and global config",
};

export default function AdminDashboard() {
  const stats = getStats();
  const chartData = getChartData(stats);
  const calendarBookings = getCalendarBookings();
  const healthReport = runSiteHealthAudit();
  const analyticsReport = getAnalyticsReport("30d");

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white">Welcome back</h2>
        <p className="text-sm text-white/50 mt-1">
          Manage your studio website — content, portfolio, leads, and settings.
        </p>
      </div>

      <BookingCalendarCompact bookings={calendarBookings} />

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {statCards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className={`hover:bg-white/[0.08] border hover:border-white/15 rounded-xl p-4 transition-colors ${
              "highlight" in card && card.highlight && stats[card.key] > 0
                ? "bg-amber-500/10 border-amber-500/20"
                : "bg-white/5 border-white/10"
            }`}
          >
            <p
              className={`text-2xl font-bold ${
                "highlight" in card && card.highlight && stats[card.key] > 0
                  ? "text-amber-400"
                  : "text-white"
              }`}
            >
              {stats[card.key]}
            </p>
            <p className="text-xs text-white/45 mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <SiteHealthPanel report={healthReport} compact />

      <VisitorAnalytics initialReport={analyticsReport} compact />

      <DashboardCharts data={chartData} />

      {/* Grouped sections — mirrors sidebar */}
      <div className="space-y-6">
        {adminNavGroups.map((group) => (
          <div key={group.title} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
                {group.title}
              </h3>
              {groupDescriptions[group.title] && (
                <p className="text-[11px] text-white/30 mt-0.5">{groupDescriptions[group.title]}</p>
              )}
            </div>
            <div className="divide-y divide-white/5">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.03] transition-colors group"
                >
                  <div className="min-w-0">
                    <span className="text-sm text-white/70 group-hover:text-white block">
                      {item.label}
                    </span>
                    {item.description && (
                      <span className="text-[11px] text-white/30 block mt-0.5 truncate">
                        {item.description}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-amber-400/70 group-hover:text-amber-400 shrink-0 ml-4">
                    Open →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
