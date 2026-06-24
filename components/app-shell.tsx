"use client";

import { FloatingNavigation } from "@/components/navigation/floating-navigation";

export function AppShell({
  children,
  siteName,
}: {
  children: React.ReactNode;
  siteName: string;
}) {
  return (
    <div className="app-shell">
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <div className="container footer-row">
          <p>{siteName}</p>
        </div>
      </footer>
      <FloatingNavigation />
    </div>
  );
}
