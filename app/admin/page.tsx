import { db } from "@/lib/db";
import { projects, categories, galleryItems, teamMembers } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

function getStats() {
  const projectCount = db.select({ count: sql<number>`count(*)` }).from(projects).get();
  const categoryCount = db.select({ count: sql<number>`count(*)` }).from(categories).get();
  const galleryCount = db.select({ count: sql<number>`count(*)` }).from(galleryItems).get();
  const teamCount = db.select({ count: sql<number>`count(*)` }).from(teamMembers).get();
  
  return {
    projects: projectCount?.count || 0,
    categories: categoryCount?.count || 0,
    gallery: galleryCount?.count || 0,
    team: teamCount?.count || 0,
  };
}

const statCards = [
  { key: "projects", label: "Projects", href: "/admin/projects", icon: "📷", color: "amber" },
  { key: "categories", label: "Categories", href: "/admin/categories", icon: "📁", color: "blue" },
  { key: "gallery", label: "Gallery Items", href: "/admin/gallery", icon: "🖼️", color: "green" },
  { key: "team", label: "Team Members", href: "/admin/team", icon: "👥", color: "purple" },
];

const quickActions = [
  { label: "Add Project", href: "/admin/projects/new", icon: "➕" },
  { label: "Edit Hero", href: "/admin/hero", icon: "🎬" },
  { label: "Update SEO", href: "/admin/seo", icon: "🔍" },
  { label: "View Site", href: "/", icon: "🌐", external: true },
];

export default function AdminDashboard() {
  const stats = getStats();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-white/50 mt-1">Welcome back to PixelRoot Studio admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-5 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-3xl font-bold text-white">
                {stats[card.key as keyof typeof stats]}
              </span>
            </div>
            <p className="text-sm text-white/50">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              target={action.external ? "_blank" : undefined}
              className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 rounded-lg text-sm font-medium text-white/70 hover:text-amber-400 transition-all"
            >
              <span>{action.icon}</span>
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Content Overview</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <span className="text-sm text-white/60">Hero Section</span>
            <Link href="/admin/hero" className="text-xs text-amber-400 hover:underline">Edit →</Link>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <span className="text-sm text-white/60">About Page</span>
            <Link href="/admin/about" className="text-xs text-amber-400 hover:underline">Edit →</Link>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <span className="text-sm text-white/60">SEO Settings</span>
            <Link href="/admin/seo" className="text-xs text-amber-400 hover:underline">Edit →</Link>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-white/60">Homepage Gallery</span>
            <Link href="/admin/gallery" className="text-xs text-amber-400 hover:underline">Edit →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
