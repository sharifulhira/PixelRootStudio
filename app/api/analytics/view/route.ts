import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pageViews } from "@/lib/db/schema";
import { categorizeReferrer, parseUserAgent } from "@/lib/analytics/referrer";
import { getSiteSettings } from "@/lib/db/queries";

const SKIP_PREFIXES = ["/admin", "/api", "/_next", "/favicon"];

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const path = data.path as string;

    if (!path || typeof path !== "string") {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    if (SKIP_PREFIXES.some((p) => path.startsWith(p))) {
      return NextResponse.json({ skipped: true });
    }

    if (!data.sessionId || typeof data.sessionId !== "string") {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const settings = getSiteSettings();
    let siteHost: string | undefined;
    try {
      siteHost = settings?.siteUrl ? new URL(settings.siteUrl).hostname : undefined;
    } catch {
      siteHost = undefined;
    }

    const referrer = (data.referrer as string) || "";
    const ua = request.headers.get("user-agent") || "";
    const { device, browser } = parseUserAgent(ua);
    const source = categorizeReferrer(referrer, siteHost);

    db.insert(pageViews)
      .values({
        path: path.split("?")[0] || "/",
        referrer: referrer || null,
        source,
        sessionId: data.sessionId.slice(0, 64),
        device,
        browser,
        createdAt: new Date(),
      })
      .run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics track error:", error);
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
