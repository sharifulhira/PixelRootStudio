import { db } from "@/lib/db";
import { invoices, invoicePayments } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { roundMoney, calculatePaymentSummary, formatMoney } from "./calculations";

export type PaymentInput = {
  amount: number;
  paymentDate: string;
  method?: string;
  reference?: string;
  notes?: string;
};

export function getPaymentsForInvoice(invoiceId: number) {
  return db
    .select()
    .from(invoicePayments)
    .where(eq(invoicePayments.invoiceId, invoiceId))
    .orderBy(desc(invoicePayments.paymentDate), desc(invoicePayments.id))
    .all();
}

export function getAmountPaid(invoiceId: number) {
  const row = db
    .select({ total: sql<number>`COALESCE(SUM(${invoicePayments.amount}), 0)` })
    .from(invoicePayments)
    .where(eq(invoicePayments.invoiceId, invoiceId))
    .get();
  return roundMoney(row?.total || 0);
}

export function getPaymentSummaryForInvoice(invoiceId: number, invoiceTotal?: number) {
  const invoice = db.select().from(invoices).where(eq(invoices.id, invoiceId)).get();
  if (!invoice) return null;

  const payments = getPaymentsForInvoice(invoiceId);
  const total = roundMoney(invoiceTotal ?? invoice.total ?? 0);
  const { amountPaid, balanceDue } = calculatePaymentSummary(total, payments);

  return { payments, amountPaid, balanceDue, invoiceTotal: total };
}

function parsePaymentDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function syncInvoicePaymentStatus(invoiceId: number) {
  const invoice = db.select().from(invoices).where(eq(invoices.id, invoiceId)).get();
  if (!invoice) return null;

  const payments = getPaymentsForInvoice(invoiceId);
  const invoiceTotal = roundMoney(invoice.total || 0);
  const { amountPaid, balanceDue } = calculatePaymentSummary(invoiceTotal, payments);
  const latest = payments[0];

  let status = invoice.status;
  if (invoice.status === "cancelled") {
    // keep cancelled
  } else if (invoiceTotal > 0 && amountPaid >= invoiceTotal) {
    status = "paid";
  } else if (amountPaid > 0) {
    status = "partial";
  } else if (status === "paid" || status === "partial") {
    status = invoice.status === "draft" ? "draft" : "sent";
  }

  const paidAt =
    status === "paid" && latest ? parsePaymentDate(latest.paymentDate) : null;

  db.update(invoices)
    .set({
      status,
      paidAt,
      paymentMethod: latest?.method || null,
      paymentReference: latest?.reference || null,
      updatedAt: new Date(),
    })
    .where(eq(invoices.id, invoiceId))
    .run();

  return { status, amountPaid, balanceDue, invoiceTotal, paidAt };
}

export function recordPayment(invoiceId: number, input: PaymentInput) {
  const amount = roundMoney(input.amount);
  if (!amount || amount <= 0) {
    throw new Error("Payment amount must be greater than zero");
  }
  if (!input.paymentDate) {
    throw new Error("Payment date is required");
  }

  const invoice = db.select().from(invoices).where(eq(invoices.id, invoiceId)).get();
  if (!invoice) throw new Error("Invoice not found");

  const currentPaid = getAmountPaid(invoiceId);
  const invoiceTotal = roundMoney(invoice.total || 0);
  const balanceDue = Math.max(0, roundMoney(invoiceTotal - currentPaid));

  if (amount > balanceDue) {
    throw new Error(
      balanceDue <= 0
        ? "This invoice is already fully paid"
        : `Payment exceeds balance due (${formatMoney(balanceDue, invoice.currency || "BDT")})`
    );
  }

  const result = db
    .insert(invoicePayments)
    .values({
      invoiceId,
      amount,
      paymentDate: input.paymentDate,
      method: input.method || null,
      reference: input.reference || null,
      notes: input.notes || null,
      createdAt: new Date(),
    })
    .run();

  const sync = syncInvoicePaymentStatus(invoiceId);
  const payment = db
    .select()
    .from(invoicePayments)
    .where(eq(invoicePayments.id, Number(result.lastInsertRowid)))
    .get();

  return { payment, ...sync };
}

export function deletePayment(paymentId: number) {
  const payment = db.select().from(invoicePayments).where(eq(invoicePayments.id, paymentId)).get();
  if (!payment) return null;

  db.delete(invoicePayments).where(eq(invoicePayments.id, paymentId)).run();
  const sync = syncInvoicePaymentStatus(payment.invoiceId);
  return { invoiceId: payment.invoiceId, ...sync };
}
