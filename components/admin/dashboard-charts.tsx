"use client";

export type StatusCount = { label: string; value: number; color: string };

export type MonthlyCount = {
  month: string;
  label: string;
  leads: number;
  bookings: number;
};

export type DashboardChartData = {
  bookingsByStatus: StatusCount[];
  leadsByStatus: StatusCount[];
  monthlyActivity: MonthlyCount[];
  bookingsByPackage: StatusCount[];
  totals: {
    leads: number;
    bookings: number;
    projects: number;
    packages: number;
  };
};

function DonutChart({
  segments,
  size = 120,
}: {
  segments: StatusCount[];
  size?: number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  if (total === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <div
          className="rounded-full border-[14px] border-white/10"
          style={{ width: size - stroke, height: size - stroke }}
        />
      </div>
    );
  }

  let offset = 0;

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={stroke}
      />
      {segments.map((seg) => {
        if (seg.value === 0) return null;
        const pct = seg.value / total;
        const dash = pct * circumference;
        const el = (
          <circle
            key={seg.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

function HorizontalBars({ items }: { items: StatusCount[] }) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-white/60 capitalize">{item.label}</span>
            <span className="text-xs font-semibold text-white">{item.value}</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(item.value / max) * 100}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function MonthlyBars({ data }: { data: MonthlyCount[] }) {
  const max = Math.max(...data.flatMap((d) => [d.leads, d.bookings]), 1);

  return (
    <div className="flex items-end justify-between gap-2 h-36 pt-2">
      {data.map((month) => (
        <div key={month.month} className="flex-1 flex flex-col items-center gap-1 min-w-0">
          <div className="flex items-end justify-center gap-0.5 w-full h-28">
            <div
              className="w-[42%] rounded-t-sm bg-amber-500/80 transition-all duration-500"
              style={{ height: `${(month.leads / max) * 100}%`, minHeight: month.leads > 0 ? 4 : 0 }}
              title={`${month.leads} leads`}
            />
            <div
              className="w-[42%] rounded-t-sm bg-blue-400/80 transition-all duration-500"
              style={{ height: `${(month.bookings / max) * 100}%`, minHeight: month.bookings > 0 ? 4 : 0 }}
              title={`${month.bookings} bookings`}
            />
          </div>
          <span className="text-[9px] text-white/40 truncate w-full text-center">{month.label}</span>
        </div>
      ))}
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-xl p-5 ${className}`}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-[11px] text-white/40 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function DashboardCharts({ data }: { data: DashboardChartData }) {
  const bookingTotal = data.bookingsByStatus.reduce((s, x) => s + x.value, 0);
  const leadTotal = data.leadsByStatus.reduce((s, x) => s + x.value, 0);
  const packageTotal = data.bookingsByPackage.reduce((s, x) => s + x.value, 0);

  return (
    <div className="mb-10">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">Statistics</h3>
        <p className="text-[11px] text-white/40 mt-0.5">Overview of leads, bookings, and activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Overview donut + totals */}
        <ChartCard title="Overview" subtitle="Site & business totals">
          <div className="flex items-center gap-5">
            <div className="relative">
              <DonutChart
                segments={[
                  { label: "Bookings", value: data.totals.bookings, color: "#60a5fa" },
                  { label: "Leads", value: data.totals.leads, color: "#fbbf24" },
                  { label: "Projects", value: data.totals.projects, color: "#34d399" },
                ]}
                size={110}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {data.totals.leads + data.totals.bookings}
                </span>
              </div>
            </div>
            <div className="space-y-2 flex-1 min-w-0">
              {[
                { label: "Leads", value: data.totals.leads, color: "#fbbf24" },
                { label: "Bookings", value: data.totals.bookings, color: "#60a5fa" },
                { label: "Projects", value: data.totals.projects, color: "#34d399" },
                { label: "Packages", value: data.totals.packages, color: "#a78bfa" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                    <span className="text-xs text-white/50 truncate">{row.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Bookings by status */}
        <ChartCard title="Bookings by Status" subtitle={`${bookingTotal} total`}>
          <div className="flex gap-4 items-start">
            <DonutChart segments={data.bookingsByStatus} size={88} />
            <div className="flex-1 min-w-0">
              <HorizontalBars items={data.bookingsByStatus} />
            </div>
          </div>
        </ChartCard>

        {/* Leads by status */}
        <ChartCard title="Leads by Status" subtitle={`${leadTotal} total`}>
          <div className="flex gap-4 items-start">
            <DonutChart segments={data.leadsByStatus} size={88} />
            <div className="flex-1 min-w-0">
              <HorizontalBars items={data.leadsByStatus} />
            </div>
          </div>
        </ChartCard>

        {/* Monthly activity */}
        <ChartCard
          title="Monthly Activity"
          subtitle="Leads & bookings created — last 6 months"
          className="md:col-span-2 xl:col-span-2"
        >
          <MonthlyBars data={data.monthlyActivity} />
          <div className="flex gap-4 mt-3 pt-3 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/80" />
              <span className="text-[10px] text-white/40">Leads</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-400/80" />
              <span className="text-[10px] text-white/40">Bookings</span>
            </div>
          </div>
        </ChartCard>

        {/* Bookings by package */}
        <ChartCard title="Bookings by Package" subtitle={`${packageTotal} with package`}>
          {data.bookingsByPackage.length === 0 ? (
            <p className="text-xs text-white/35 py-6 text-center">No package bookings yet</p>
          ) : (
            <HorizontalBars items={data.bookingsByPackage} />
          )}
        </ChartCard>
      </div>
    </div>
  );
}
