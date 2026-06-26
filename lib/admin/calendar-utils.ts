export type CalendarBooking = {
  id: number;
  clientName: string;
  packageName: string | null;
  eventDate: string;
  eventType?: string | null;
  status: string;
  phone: string | null;
};

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const WEEKDAYS_SHORT = ["M", "T", "W", "T", "F", "S", "S"];

export const statusColors: Record<string, string> = {
  pending: "bg-yellow-400/20 text-yellow-300 border-yellow-400/30",
  confirmed: "bg-blue-400/20 text-blue-300 border-blue-400/30",
  completed: "bg-green-400/20 text-green-300 border-green-400/30",
  cancelled: "bg-red-400/20 text-red-300 border-red-400/30",
};

export const statusDot: Record<string, string> = {
  pending: "bg-yellow-400",
  confirmed: "bg-blue-400",
  completed: "bg-green-400",
  cancelled: "bg-red-400",
};

export function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function parseEventDate(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  return { year: +match[1], month: +match[2] - 1, day: +match[3] };
}

export function buildMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;

  const cells: { day: number; inMonth: boolean; dateKey: string }[] = [];

  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const m = month - 1;
    const y = m < 0 ? year - 1 : year;
    const mo = m < 0 ? 11 : m;
    cells.push({ day, inMonth: false, dateKey: toDateKey(y, mo, day) });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, inMonth: true, dateKey: toDateKey(year, month, day) });
  }

  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    const m = month + 1;
    const y = m > 11 ? year + 1 : year;
    const mo = m > 11 ? 0 : m;
    cells.push({ day: nextDay, inMonth: false, dateKey: toDateKey(y, mo, nextDay) });
    nextDay++;
  }

  return cells;
}

export function groupBookingsByDate(bookings: CalendarBooking[]) {
  const map: Record<string, CalendarBooking[]> = {};
  for (const booking of bookings) {
    const parsed = parseEventDate(booking.eventDate);
    if (!parsed) continue;
    const key = toDateKey(parsed.year, parsed.month, parsed.day);
    if (!map[key]) map[key] = [];
    map[key].push(booking);
  }
  for (const key of Object.keys(map)) {
    map[key].sort((a, b) => a.clientName.localeCompare(b.clientName));
  }
  return map;
}

export function getUpcomingBookings(bookings: CalendarBooking[], limit = 5) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  return bookings
    .filter((b) => {
      const p = parseEventDate(b.eventDate);
      if (!p) return false;
      const key = toDateKey(p.year, p.month, p.day);
      return key >= todayKey && b.status !== "cancelled";
    })
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
    .slice(0, limit);
}
