import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { isNotNull, desc } from "drizzle-orm";

export function getCalendarBookings() {
  return db
    .select({
      id: bookings.id,
      clientName: bookings.clientName,
      packageName: bookings.packageName,
      eventDate: bookings.eventDate,
      eventType: bookings.eventType,
      status: bookings.status,
      phone: bookings.phone,
    })
    .from(bookings)
    .where(isNotNull(bookings.eventDate))
    .orderBy(desc(bookings.eventDate))
    .all()
    .filter((b) => b.eventDate && b.eventDate.trim() !== "")
    .map((b) => ({
      id: b.id,
      clientName: b.clientName,
      packageName: b.packageName,
      eventDate: b.eventDate!,
      eventType: b.eventType,
      status: b.status,
      phone: b.phone,
    }));
}
