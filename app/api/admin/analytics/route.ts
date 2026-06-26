import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAnalyticsReport, type AnalyticsPeriod } from "@/lib/analytics/stats";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = (searchParams.get("period") || "30d") as AnalyticsPeriod;
    const valid: AnalyticsPeriod[] = ["7d", "30d", "all"];
    const p = valid.includes(period) ? period : "30d";

    return NextResponse.json(getAnalyticsReport(p));
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
