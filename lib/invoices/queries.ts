import { db } from "@/lib/db";
import { bookings, packages, invoices, invoiceItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getInvoiceSettings, getNextInvoiceNumber } from "./settings";
import { calculateInvoiceTotals } from "./calculations";
import { getPaymentsForInvoice, getAmountPaid } from "./payments";
import { calculatePaymentSummary, roundMoney } from "./calculations";
import { getInvoiceForBooking } from "./booking-link";

export function buildInvoiceFromBooking(bookingId: number) {
  const booking = db.select().from(bookings).where(eq(bookings.id, bookingId)).get();
  if (!booking) return null;

  const settings = getInvoiceSettings();
  let unitPrice = 0;
  let description = booking.packageName || "Photography Service";

  if (booking.packageId) {
    const pkg = db.select().from(packages).where(eq(packages.id, booking.packageId)).get();
    if (pkg) {
      unitPrice = pkg.price || 0;
      description = pkg.name;
      if (pkg.duration) description += ` (${pkg.duration})`;
    }
  }

  const lineItems = [{ description, quantity: 1, unitPrice }];

  const totals = calculateInvoiceTotals({
    items: lineItems,
    taxRate: settings.defaultTaxRate || 0,
    discountType: "fixed",
    discountValue: 0,
  });

  const today = new Date().toISOString().slice(0, 10);
  const due = new Date();
  due.setDate(due.getDate() + 7);

  const eventNote = booking.eventDate
    ? `Event: ${booking.eventDate}${booking.eventType ? ` (${booking.eventType})` : ""}`
    : "";

  const existing = getInvoiceForBooking(bookingId);

  return {
    invoiceNumber: getNextInvoiceNumber(),
    bookingId: booking.id,
    existingInvoiceId: existing?.invoiceId ?? null,
    existingInvoiceNumber: existing?.invoiceNumber ?? null,
    clientName: booking.clientName,
    clientEmail: booking.email || "",
    clientPhone: booking.phone,
    clientAddress: "",
    issueDate: today,
    dueDate: due.toISOString().slice(0, 10),
    status: "draft",
    currency: settings.defaultCurrency || "BDT",
    taxRate: settings.defaultTaxRate || 0,
    discountType: "fixed" as const,
    discountValue: 0,
    notes: [eventNote, booking.message, settings.defaultNotes].filter(Boolean).join("\n\n"),
    terms: settings.defaultTerms || "",
    items: lineItems,
    ...totals,
    company: {
      name: settings.companyName,
      email: settings.companyEmail,
      phone: settings.companyPhone,
      address: settings.companyAddress,
      signatureImage: settings.signatureImage,
      paidSealImage: settings.paidSealImage,
    },
  };
}

export function getInvoiceByNumber(invoiceNumber: string) {
  const invoice = db
    .select()
    .from(invoices)
    .where(eq(invoices.invoiceNumber, invoiceNumber))
    .get();
  if (!invoice) return null;

  const settings = getInvoiceSettings();

  return {
    invoiceNumber: invoice.invoiceNumber,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    status: invoice.status,
    currency: invoice.currency,
    total: invoice.total,
    company: {
      name: settings.companyName,
      email: settings.companyEmail,
      phone: settings.companyPhone,
    },
  };
}

export function getInvoiceWithItems(id: number) {
  const invoice = db.select().from(invoices).where(eq(invoices.id, id)).get();
  if (!invoice) return null;

  const items = db
    .select()
    .from(invoiceItems)
    .where(eq(invoiceItems.invoiceId, id))
    .orderBy(invoiceItems.sortOrder)
    .all();

  const settings = getInvoiceSettings();
  const payments = getPaymentsForInvoice(id);
  const invoiceTotal = roundMoney(invoice.total || 0);
  const { amountPaid, balanceDue } = calculatePaymentSummary(invoiceTotal, payments);

  return {
    ...invoice,
    items,
    payments,
    amountPaid,
    balanceDue,
    company: {
      name: settings.companyName,
      email: settings.companyEmail,
      phone: settings.companyPhone,
      address: settings.companyAddress,
      signatureImage: settings.signatureImage,
      paidSealImage: settings.paidSealImage,
    },
  };
}

export function getAccountingSummary() {
  const all = db.select().from(invoices).all();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  let totalPaid = 0;
  let totalOutstanding = 0;
  let paidThisMonth = 0;
  let draftCount = 0;
  let overdueCount = 0;

  for (const inv of all) {
    if (inv.status === "paid") {
      totalPaid += inv.total || 0;
      if (inv.paidAt && inv.paidAt >= monthStart) {
        paidThisMonth += inv.total || 0;
      }
    } else if (inv.status === "partial") {
      const paid = getAmountPaid(inv.id);
      totalPaid += paid;
      totalOutstanding += Math.max(0, (inv.total || 0) - paid);
    } else if (inv.status === "sent" || inv.status === "overdue") {
      totalOutstanding += inv.total || 0;
    }
    if (inv.status === "draft") draftCount++;
    if (inv.status === "overdue") overdueCount++;
  }

  return {
    totalPaid: Math.round(totalPaid * 100) / 100,
    totalOutstanding: Math.round(totalOutstanding * 100) / 100,
    paidThisMonth: Math.round(paidThisMonth * 100) / 100,
    invoiceCount: all.length,
    draftCount,
    overdueCount,
  };
}
