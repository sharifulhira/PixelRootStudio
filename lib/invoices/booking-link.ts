import { db } from "@/lib/db";
import { bookings, invoices } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export function linkInvoiceToBooking(bookingId: number, invoiceId: number, invoiceNumber: string) {
  db.update(bookings)
    .set({
      invoiceId,
      invoiceNumber,
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, bookingId))
    .run();
}

export function unlinkInvoiceFromBooking(bookingId: number) {
  db.update(bookings)
    .set({
      invoiceId: null,
      invoiceNumber: null,
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, bookingId))
    .run();
}

export function unlinkBookingByInvoiceId(invoiceId: number) {
  const invoice = db.select().from(invoices).where(eq(invoices.id, invoiceId)).get();
  if (invoice?.bookingId) {
    unlinkInvoiceFromBooking(invoice.bookingId);
  }
}

/** Backfill booking invoice refs from existing invoice rows */
export function syncBookingInvoiceRefs() {
  const linked = db
    .select({ bookingId: invoices.bookingId, invoiceId: invoices.id, invoiceNumber: invoices.invoiceNumber })
    .from(invoices)
    .all()
    .filter((r) => r.bookingId != null);

  for (const row of linked) {
    if (!row.bookingId) continue;
    db.update(bookings)
      .set({
        invoiceId: row.invoiceId,
        invoiceNumber: row.invoiceNumber,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, row.bookingId))
      .run();
  }
}

export function getInvoiceForBooking(bookingId: number) {
  const booking = db.select().from(bookings).where(eq(bookings.id, bookingId)).get();
  if (booking?.invoiceId) {
    return { invoiceId: booking.invoiceId, invoiceNumber: booking.invoiceNumber };
  }
  const invoice = db.select().from(invoices).where(eq(invoices.bookingId, bookingId)).get();
  if (invoice) {
    linkInvoiceToBooking(bookingId, invoice.id, invoice.invoiceNumber);
    return { invoiceId: invoice.id, invoiceNumber: invoice.invoiceNumber };
  }
  return null;
}
