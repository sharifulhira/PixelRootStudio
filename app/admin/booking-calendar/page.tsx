import { getCalendarBookings } from "@/lib/admin/calendar-bookings";
import { BookingCalendar } from "@/components/admin/booking-calendar";

export const dynamic = "force-dynamic";

export default function AdminBookingCalendarPage() {
  const calendarBookings = getCalendarBookings();
  return <BookingCalendar bookings={calendarBookings} />;
}
