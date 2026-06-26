"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  type CalendarBooking,
  WEEKDAYS_SHORT,
  statusColors,
  statusDot,
  toDateKey,
  buildMonthGrid,
  groupBookingsByDate,
  getUpcomingBookings,
} from "@/lib/admin/calendar-utils";

type Props = {
  bookings: CalendarBooking[];
};

export function BookingCalendarCompact({ bookings }: Props) {
  const today = new Date();
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const bookingsByDate = useMemo(() => groupBookingsByDate(bookings), [bookings]);
  const cells = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);
  const upcoming = useMemo(() => getUpcomingBookings(bookings, 4), [bookings]);

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

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

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-b border-white/5">
        <div>
          <h3 className="text-sm font-semibold text-white">Booking Calendar</h3>
          <p className="text-[11px] text-white/40 mt-0.5">
            {upcoming.length > 0 ? `${upcoming.length} upcoming soon` : "No upcoming events"}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={goToPrevMonth}
            className="p-1 text-white/40 hover:text-white rounded"
            aria-label="Previous month"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-xs font-semibold text-white min-w-[90px] text-center">{monthLabel}</span>
          <button
            type="button"
            onClick={goToNextMonth}
            className="p-1 text-white/40 hover:text-white rounded"
            aria-label="Next month"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <Link
            href="/admin/booking-calendar"
            className="ml-2 px-2.5 py-1 text-[10px] font-semibold text-amber-400 border border-amber-500/25 rounded-md hover:bg-amber-500/10"
          >
            Full Calendar →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-0">
        <div className="p-3 md:p-4 md:border-r border-white/5">
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {WEEKDAYS_SHORT.map((d, i) => (
              <div key={i} className="text-center text-[9px] font-medium text-white/30 w-7">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((cell) => {
              const count = (bookingsByDate[cell.dateKey] || []).length;
              const isToday = cell.dateKey === todayKey;
              return (
                <Link
                  key={cell.dateKey}
                  href={`/admin/booking-calendar?date=${cell.dateKey}`}
                  className={`w-7 h-7 flex flex-col items-center justify-center rounded-md text-[10px] relative transition-colors ${
                    isToday
                      ? "bg-amber-500 text-slate-900 font-bold"
                      : cell.inMonth
                        ? "text-white/70 hover:bg-white/10"
                        : "text-white/20"
                  }`}
                >
                  {cell.day}
                  {count > 0 && (
                    <span
                      className={`absolute bottom-0.5 w-1 h-1 rounded-full ${
                        isToday ? "bg-slate-900" : statusDot.pending
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-3 md:p-4 border-t md:border-t-0 border-white/5 bg-white/[0.02]">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-2">
            Upcoming
          </p>
          {upcoming.length === 0 ? (
            <p className="text-[11px] text-white/35">No scheduled bookings ahead.</p>
          ) : (
            <ul className="space-y-2">
              {upcoming.map((b) => (
                <li key={b.id}>
                  <Link
                    href={`/admin/bookings?highlight=${b.id}`}
                    className="flex items-center justify-between gap-2 group"
                  >
                    <div className="min-w-0">
                      <p className="text-xs text-white group-hover:text-amber-400 truncate transition-colors">
                        {b.clientName}
                      </p>
                      <p className="text-[10px] text-white/35 truncate">
                        {new Date(b.eventDate + "T12:00:00").toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        {b.packageName ? ` · ${b.packageName}` : ""}
                      </p>
                    </div>
                    <span
                      className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                        statusColors[b.status] || statusColors.pending
                      }`}
                    >
                      {b.status.slice(0, 4)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
