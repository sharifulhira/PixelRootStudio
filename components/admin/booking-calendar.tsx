"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  type CalendarBooking,
  WEEKDAYS,
  statusColors,
  statusDot,
  toDateKey,
  parseEventDate,
  buildMonthGrid,
  groupBookingsByDate,
} from "@/lib/admin/calendar-utils";

const STATUS_OPTIONS = ["all", "pending", "confirmed", "completed", "cancelled"];

type Props = {
  bookings: CalendarBooking[];
};

export function BookingCalendar({ bookings }: Props) {
  const today = new Date();
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(todayKey);
  const [statusFilter, setStatusFilter] = useState("all");
  const [packageFilter, setPackageFilter] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [upcomingOnly, setUpcomingOnly] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const date = params.get("date");
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setSelectedDate(date);
      const parsed = parseEventDate(date);
      if (parsed) {
        setViewYear(parsed.year);
        setViewMonth(parsed.month);
      }
    }
  }, []);

  const packageOptions = useMemo(() => {
    const names = new Set<string>();
    for (const b of bookings) {
      if (b.packageName?.trim()) names.add(b.packageName.trim());
    }
    return Array.from(names).sort();
  }, [bookings]);

  const eventTypeOptions = useMemo(() => {
    const types = new Set<string>();
    for (const b of bookings) {
      if (b.eventType?.trim()) types.add(b.eventType.trim());
    }
    return Array.from(types).sort();
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (packageFilter !== "all" && (b.packageName?.trim() || "") !== packageFilter) return false;
      if (eventTypeFilter !== "all" && (b.eventType?.trim() || "") !== eventTypeFilter) return false;
      if (q && !b.clientName.toLowerCase().includes(q) && !(b.phone || "").includes(q)) return false;
      if (upcomingOnly) {
        const p = parseEventDate(b.eventDate);
        if (!p) return false;
        const key = toDateKey(p.year, p.month, p.day);
        if (key < todayKey || b.status === "cancelled") return false;
      }
      return true;
    });
  }, [bookings, statusFilter, packageFilter, eventTypeFilter, search, upcomingOnly, todayKey]);

  const bookingsByDate = useMemo(
    () => groupBookingsByDate(filteredBookings),
    [filteredBookings]
  );

  const cells = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const upcomingCount = useMemo(() => {
    return filteredBookings.filter((b) => {
      const p = parseEventDate(b.eventDate);
      if (!p) return false;
      const key = toDateKey(p.year, p.month, p.day);
      return key >= todayKey && b.status !== "cancelled";
    }).length;
  }, [filteredBookings, todayKey]);

  function goToPrevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else setViewMonth((m) => m - 1);
  }

  function goToNextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else setViewMonth((m) => m + 1);
  }

  function goToToday() {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDate(todayKey);
  }

  const selectedBookings = selectedDate ? bookingsByDate[selectedDate] || [] : [];

  const inputClass =
    "px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Booking Calendar</h1>
          <p className="text-sm text-white/50 mt-1">
            {filteredBookings.length} shown • {upcomingCount} upcoming
          </p>
        </div>
        <Link
          href="/admin/bookings"
          className="px-3 py-1.5 text-xs font-semibold text-amber-400 border border-amber-500/25 rounded-lg hover:bg-amber-500/10 self-start"
        >
          List View →
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 space-y-3">
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === s
                  ? "bg-amber-500 text-slate-900"
                  : "bg-white/5 border border-white/10 text-white/50 hover:text-white"
              }`}
            >
              {s === "all" ? "All statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="search"
            placeholder="Search name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputClass}
          />
          <select
            value={packageFilter}
            onChange={(e) => setPackageFilter(e.target.value)}
            className={inputClass}
          >
            <option value="all">All packages</option>
            {packageOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className={inputClass}
          >
            <option value="all">All event types</option>
            {eventTypeOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={upcomingOnly}
              onChange={(e) => setUpcomingOnly(e.target.checked)}
              className="rounded border-white/20"
            />
            <span className="text-xs text-white/60">Upcoming only</span>
          </label>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToToday}
              className="px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white border border-white/10 rounded-lg hover:bg-white/5"
            >
              Today
            </button>
            <button type="button" onClick={goToPrevMonth} className="p-1.5 text-white/50 hover:text-white rounded-lg" aria-label="Previous month">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-white min-w-[140px] text-center">{monthLabel}</span>
            <button type="button" onClick={goToNextMonth} className="p-1.5 text-white/50 hover:text-white rounded-lg" aria-label="Next month">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(statusDot).map(([status, color]) => (
              <div key={status} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-[10px] text-white/40 capitalize">{status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px]">
          <div className="p-4 sm:p-5 border-b lg:border-b-0 lg:border-r border-white/5">
            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAYS.map((day) => (
                <div key={day} className="text-center text-[10px] font-semibold uppercase tracking-wider text-white/30 py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((cell) => {
                const dayBookings = bookingsByDate[cell.dateKey] || [];
                const isToday = cell.dateKey === todayKey;
                const isSelected = cell.dateKey === selectedDate;

                return (
                  <button
                    key={cell.dateKey}
                    type="button"
                    onClick={() => setSelectedDate(cell.dateKey)}
                    className={`min-h-[72px] sm:min-h-[80px] p-1.5 rounded-lg text-left transition-colors border ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-500/30"
                        : isToday
                          ? "bg-white/[0.04] border-amber-500/20"
                          : "border-transparent hover:bg-white/[0.03] hover:border-white/5"
                    }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full ${
                        !cell.inMonth
                          ? "text-white/20"
                          : isToday
                            ? "bg-amber-500 text-slate-900"
                            : "text-white/70"
                      }`}
                    >
                      {cell.day}
                    </span>

                    {dayBookings.length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {dayBookings.slice(0, 2).map((b) => (
                          <div
                            key={b.id}
                            className={`hidden sm:flex items-center gap-1 px-1 py-0.5 rounded text-[9px] font-medium truncate border ${
                              statusColors[b.status] || statusColors.pending
                            }`}
                          >
                            <span className={`w-1 h-1 rounded-full shrink-0 ${statusDot[b.status] || statusDot.pending}`} />
                            <span className="truncate">{b.clientName}</span>
                          </div>
                        ))}
                        <div className="sm:hidden flex gap-0.5 flex-wrap mt-0.5">
                          {dayBookings.slice(0, 3).map((b) => (
                            <span key={b.id} className={`w-1.5 h-1.5 rounded-full ${statusDot[b.status] || statusDot.pending}`} />
                          ))}
                        </div>
                        {dayBookings.length > 2 && (
                          <p className="text-[9px] text-white/40 pl-1 hidden sm:block">+{dayBookings.length - 2} more</p>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-white/[0.02]">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-3">
              {selectedDate
                ? new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })
                : "Select a day"}
            </p>

            {selectedBookings.length === 0 ? (
              <p className="text-xs text-white/35 leading-relaxed">
                No bookings on this date
                {(statusFilter !== "all" || packageFilter !== "all" || search || upcomingOnly) && " matching filters"}.
              </p>
            ) : (
              <ul className="space-y-2 max-h-[420px] overflow-y-auto">
                {selectedBookings.map((b) => (
                  <li key={b.id}>
                    <Link
                      href={`/admin/bookings?highlight=${b.id}`}
                      className={`block rounded-lg border p-3 hover:bg-white/[0.04] transition-colors ${
                        statusColors[b.status] || statusColors.pending
                      }`}
                    >
                      <p className="text-sm font-medium truncate">{b.clientName}</p>
                      {b.packageName && <p className="text-[11px] opacity-80 truncate mt-0.5">{b.packageName}</p>}
                      {b.eventType && <p className="text-[10px] opacity-60 capitalize mt-0.5">{b.eventType}</p>}
                      {b.phone && <p className="text-[10px] opacity-60 mt-1">{b.phone}</p>}
                      <p className="text-[10px] font-semibold uppercase tracking-wider mt-1.5 opacity-70">{b.status}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
