"use client";

import { FloatingNavigation } from "@/components/navigation/floating-navigation";
import { usePathname } from "next/navigation";

const HIDDEN_PATHS = ["/admin", "/studio"];

export function AppShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideChrome = HIDDEN_PATHS.some((path) => pathname.startsWith(path));

  return (
    <div className="app-shell">
      <main className="site-main">{children}</main>
      {!hideChrome && footer}
      {!hideChrome && <FloatingNavigation />}
    </div>
  );
}
