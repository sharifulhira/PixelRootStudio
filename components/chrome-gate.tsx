"use client";

import { usePathname } from "next/navigation";

const HIDDEN_PATHS = ["/admin", "/studio"];

export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hide = HIDDEN_PATHS.some((path) => pathname.startsWith(path));

  if (hide) return null;

  return children;
}
