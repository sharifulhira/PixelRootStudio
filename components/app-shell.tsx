"use client";

import { FloatingNavigation } from "@/components/navigation/floating-navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      {children}
      <FloatingNavigation />
    </div>
  );
}
