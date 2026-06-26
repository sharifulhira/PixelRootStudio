import { runSiteHealthAudit } from "@/lib/site-health/audit";
import { SiteHealthPanel } from "@/components/admin/site-health-panel";

export const dynamic = "force-dynamic";

export default function AdminPerformancePage() {
  const report = runSiteHealthAudit();

  return <SiteHealthPanel report={report} />;
}
