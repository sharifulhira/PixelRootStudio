import { db } from "@/lib/db";
import { projects, categories, galleryItems, teamMembers, gear, packages, bookings } from "@/lib/db/schema";
import { sql, eq } from "drizzle-orm";
import Link from "next/link";
import { adminNavGroups } from "@/components/admin/layout/nav-config";

export const dynamic = "force-dynamic";

function getStats() {
  const projectCount = db.select({ count: sql<number>`count(*)` }).from(projects).get();
  const categoryCount = db.select({ count: sql<number>`count(*)` }).from(categories).get();
  const galleryCount = db.select({ count: sql<number>`count(*)` }).from(galleryItems).get();
  const teamCount = db.select({ count: sql<number>`count(*)` }).from(teamMembers).get();
  const gearCount = db.select({ count: sql<number>`count(*)` }).from(gear).get();
  const packageCount = db.select({ count: sql<number>`count(*)` }).from(packages).get();
  const pendingBookings = db.select({ count: sql<number>`count(*)` }).from(bookings).where(eq(bookings.status, "pending")).get();
  const totalBookings = db.select({ count: sql<number>`count(*)` }).from(bookings).get();

  return {
    projects: projectCount?.count || 0,
    categories: categoryCount?.count || 0,
    gallery: galleryCount?.count || 0,
    team: teamCount?.count || 0,
    gear: gearCount?.count || 0,
    packages: packageCount?.count || 0,
    pendingBookings: pendingBookings?.count || 0,
    totalBookings: totalBookings?.count || 0,
  };
}

const statCards = [
  { key: "pendingBookings", label: "Pending Bookings", href: "/admin/bookings", highlight: true },
  { key: "packages", label: "Packages", href: "/admin/packages" },
  { key: "projects", label: "Projects", href: "/admin/projects" },
  { key: "gallery", label: "Gallery", href: "/admin/gallery" },
] as const;

export default function AdminDashboard() {
  const stats = getStats();

  const contentGroups = adminNavGroups.filter((g) => g.title !== "Overview");

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white">Welcome back</h2>
        <p className="text-sm text-white/50 mt-1">Manage your website content from the sections below.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
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
            <p className={`text-2xl font-bold ${
              "highlight" in card && card.highlight && stats[card.key] > 0 ? "text-amber-400" : "text-white"
            }`}>{stats[card.key]}</p>
            <p className="text-xs text-white/45 mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Grouped content links */}
      <div className="space-y-6">
        {contentGroups.map((group) => (
          <div key={group.title} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/40">{group.title}</h3>
            </div>
            <div className="divide-y divide-white/5">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.03] transition-colors group"
                >
                  <span className="text-sm text-white/70 group-hover:text-white">{item.label}</span>
                  <span className="text-xs text-amber-400/70 group-hover:text-amber-400">Manage →</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
