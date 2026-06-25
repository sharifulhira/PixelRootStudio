"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
import { AdminTopbar } from "@/components/admin/layout/admin-topbar";

const SIDEBAR_WIDTH = "260px";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="min-h-dvh bg-slate-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar — always fixed, full viewport height */}
      <aside
        style={{ width: SIDEBAR_WIDTH }}
        className={`fixed inset-y-0 left-0 z-50 bg-slate-900 border-r border-white/5 flex flex-col transform transition-transform duration-200 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <AdminSidebar
          pathname={pathname}
          onNavigate={closeSidebar}
          onLogout={handleLogout}
        />
      </aside>

      {/* Main area — offset by sidebar width on desktop */}
      <div
        className="min-h-dvh flex flex-col lg:ml-[260px]"
      >
        <AdminTopbar
          pathname={pathname}
          onLogout={handleLogout}
          onMenuToggle={() => setSidebarOpen((open) => !open)}
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
