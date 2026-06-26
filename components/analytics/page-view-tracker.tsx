"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "pixelroot_vid";
const DEBOUNCE_MS = 2000;

function getSessionId() {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "anonymous";
  }
}

function shouldTrack(path: string) {
  return (
    !path.startsWith("/admin") &&
    !path.startsWith("/api") &&
    !path.startsWith("/_next")
  );
}

export function PageViewTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<{ path: string; at: number } | null>(null);

  useEffect(() => {
    if (!pathname || !shouldTrack(pathname)) return;

    const now = Date.now();
    if (
      lastTracked.current?.path === pathname &&
      now - lastTracked.current.at < DEBOUNCE_MS
    ) {
      return;
    }
    lastTracked.current = { path: pathname, at: now };

    const payload = {
      path: pathname,
      referrer: typeof document !== "undefined" ? document.referrer : "",
      sessionId: getSessionId(),
    };

    fetch("/api/analytics/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
