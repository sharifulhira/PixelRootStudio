"use client";

import { FloatingNavigation } from "@/components/navigation/floating-navigation";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell print:hidden">
      <PageViewTracker />
      {children}
      <FloatingNavigation />
    </div>
  );
}
