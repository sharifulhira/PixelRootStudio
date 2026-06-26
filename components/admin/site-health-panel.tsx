"use client";

import Link from "next/link";
import type { HealthCheck, SiteHealthReport } from "@/lib/site-health/audit";

function ScoreRing({
  score,
  label,
  size = 88,
}: {
  score: number;
  label: string;
  size?: number;
}) {
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 90 ? "#34d399" : score >= 70 ? "#fbbf24" : score >= 50 ? "#fb923c" : "#f87171";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{score}%</span>
        </div>
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">{label}</span>
    </div>
  );
}

function StatusIcon({ status }: { status: HealthCheck["status"] }) {
  if (status === "pass") {
    return (
      <span className="w-5 h-5 rounded-full bg-green-400/15 flex items-center justify-center shrink-0">
        <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }
  if (status === "warn") {
    return (
      <span className="w-5 h-5 rounded-full bg-amber-400/15 flex items-center justify-center shrink-0">
        <svg className="w-3 h-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" />
        </svg>
      </span>
    );
  }
  return (
    <span className="w-5 h-5 rounded-full bg-red-400/15 flex items-center justify-center shrink-0">
      <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </span>
  );
}

function CheckList({ checks, title }: { checks: HealthCheck[]; title: string }) {
  const fails = checks.filter((c) => c.status === "fail").length;
  const warns = checks.filter((c) => c.status === "warn").length;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <h4 className="text-xs font-semibold text-white">{title}</h4>
        <span className="text-[10px] text-white/35">
          {fails > 0 && <span className="text-red-400">{fails} fail</span>}
          {fails > 0 && warns > 0 && " · "}
          {warns > 0 && <span className="text-amber-400">{warns} warn</span>}
          {fails === 0 && warns === 0 && <span className="text-green-400">All pass</span>}
        </span>
      </div>
      <ul className="divide-y divide-white/5 max-h-64 overflow-y-auto">
        {checks.map((check) => (
          <li key={check.id} className="flex items-start gap-3 px-4 py-3">
            <StatusIcon status={check.status} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white">{check.label}</p>
              <p className="text-[11px] text-white/45 mt-0.5 leading-relaxed">{check.message}</p>
            </div>
            {check.fixHref && check.status !== "pass" && (
              <Link
                href={check.fixHref}
                className="text-[10px] font-semibold text-amber-400 hover:text-amber-300 shrink-0 whitespace-nowrap"
              >
                Fix →
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

type Props = {
  report: SiteHealthReport;
  compact?: boolean;
};

export function SiteHealthPanel({ report, compact = false }: Props) {
  const seoChecks = report.checks.filter((c) => c.category === "seo");
  const perfChecks = report.checks.filter((c) => c.category === "performance");
  const landingChecks = report.checks.filter((c) => c.category === "landing");

  const issueCount = report.checks.filter((c) => c.status !== "pass").length;

  if (compact) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-sm font-semibold text-white">Site Health</h3>
            <p className="text-[11px] text-white/40 mt-0.5">
              SEO & performance score for landing page — {issueCount} item{issueCount !== 1 ? "s" : ""} to improve
            </p>
          </div>
          <Link
            href="/admin/performance"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 border border-amber-500/25 rounded-lg px-3 py-1.5 hover:bg-amber-500/10 transition-colors self-start"
          >
            Full Report →
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          <ScoreRing score={report.overall} label="Overall" size={96} />
          <ScoreRing score={report.seo} label="SEO" />
          <ScoreRing score={report.performance} label="Performance" />
          <ScoreRing score={report.landing} label="Landing Page" />
        </div>

        {report.overall < 100 && (
          <div className="mt-5 pt-4 border-t border-white/5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-2">Top priorities</p>
            <ul className="space-y-2">
              {report.checks
                .filter((c) => c.status === "fail")
                .slice(0, 3)
                .map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-white/60 truncate">{c.label}</span>
                    {c.fixHref && (
                      <Link href={c.fixHref} className="text-amber-400 hover:underline shrink-0 text-[11px]">
                        Fix
                      </Link>
                    )}
                  </li>
                ))}
              {report.checks.filter((c) => c.status === "fail").length === 0 &&
                report.checks
                  .filter((c) => c.status === "warn")
                  .slice(0, 3)
                  .map((c) => (
                    <li key={c.id} className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-white/60 truncate">{c.label}</span>
                      {c.fixHref && (
                        <Link href={c.fixHref} className="text-amber-400 hover:underline shrink-0 text-[11px]">
                          Improve
                        </Link>
                      )}
                    </li>
                  ))}
            </ul>
          </div>
        )}

        {report.overall === 100 && (
          <p className="mt-4 text-center text-xs text-green-400 font-medium">
            Excellent — landing page SEO & performance checks all pass
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Site Performance & SEO</h2>
        <p className="text-sm text-white/50 mt-1">
          Automated audit to keep your landing page at peak SEO and performance
        </p>
        <p className="text-[10px] text-white/30 mt-1">
          Last audited {new Date(report.auditedAt).toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-center col-span-2 sm:col-span-1">
          <ScoreRing score={report.overall} label="Overall" size={100} />
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-center">
          <ScoreRing score={report.seo} label="SEO" />
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-center">
          <ScoreRing score={report.performance} label="Performance" />
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-center">
          <ScoreRing score={report.landing} label="Landing" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CheckList checks={seoChecks} title="SEO Checks" />
        <CheckList checks={perfChecks} title="Performance Checks" />
        <CheckList checks={landingChecks} title="Landing Page Content" />
      </div>
    </div>
  );
}
