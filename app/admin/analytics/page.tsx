import { getAnalyticsReport } from "@/lib/analytics/stats";
import { VisitorAnalytics } from "@/components/admin/visitor-analytics";

export const dynamic = "force-dynamic";

export default function AdminAnalyticsPage() {
  const report = getAnalyticsReport("30d");
  return <VisitorAnalytics initialReport={report} />;
}
