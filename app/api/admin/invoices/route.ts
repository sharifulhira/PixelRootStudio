import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { invoices, invoiceItems, invoiceSettings } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { calculateInvoiceTotals } from "@/lib/invoices/calculations";
import { getInvoiceSettings, getNextInvoiceNumber, incrementInvoiceNumber } from "@/lib/invoices/settings";
import { getInvoiceWithItems, getAccountingSummary, buildInvoiceFromBooking } from "@/lib/invoices/queries";
import { linkInvoiceToBooking, unlinkBookingByInvoiceId } from "@/lib/invoices/booking-link";
import { syncInvoicePaymentStatus, getPaymentsForInvoice } from "@/lib/invoices/payments";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const fromBooking = searchParams.get("fromBooking");

    if (fromBooking) {
      const bookingId = parseInt(fromBooking);
      const draft = buildInvoiceFromBooking(bookingId);
      if (!draft) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }
      if (draft.existingInvoiceId) {
        return NextResponse.json({
          ...draft,
          alreadyInvoiced: true,
        });
      }
      return NextResponse.json(draft);
    }

    if (id) {
      const invoice = getInvoiceWithItems(parseInt(id));
      if (!invoice) {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
      }
      return NextResponse.json(invoice);
    }

    const items = db.select().from(invoices).orderBy(desc(invoices.createdAt)).all();
    const settings = getInvoiceSettings();
    const accounting = getAccountingSummary();

    return NextResponse.json({ items, settings, accounting });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

type InvoicePayload = {
  id?: number;
  invoiceNumber?: string;
  bookingId?: number | null;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  issueDate: string;
  dueDate?: string;
  status: string;
  currency?: string;
  taxRate?: number;
  discountType?: string;
  discountValue?: number;
  notes?: string;
  terms?: string;
  paymentMethod?: string;
  paymentReference?: string;
  items: { description: string; quantity: number; unitPrice: number }[];
  settings?: {
    prefix?: string;
    defaultTaxRate?: number;
    defaultCurrency?: string;
    defaultTerms?: string;
    defaultNotes?: string;
    companyName?: string;
    companyEmail?: string;
    companyPhone?: string;
    companyAddress?: string;
    signatureImage?: string;
    paidSealImage?: string;
  };
};

function saveInvoiceItems(invoiceId: number, items: InvoicePayload["items"], taxRate: number, discountType: string, discountValue: number) {
  db.delete(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId)).run();

  const totals = calculateInvoiceTotals({
    items,
    taxRate,
    discountType: discountType as "fixed" | "percent",
    discountValue,
  });

  items.forEach((item, index) => {
    db.insert(invoiceItems)
      .values({
        invoiceId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: totals.lineAmounts[index] || 0,
        sortOrder: index,
      })
      .run();
  });

  return totals;
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data: InvoicePayload = await request.json();

    if (!data.clientName || !data.issueDate || !data.items?.length) {
      return NextResponse.json({ error: "Client, date, and line items required" }, { status: 400 });
    }

    if (data.settings) {
      const existing = getInvoiceSettings();
      db.update(invoiceSettings)
        .set({
          prefix: data.settings.prefix ?? existing.prefix,
          defaultTaxRate: data.settings.defaultTaxRate ?? existing.defaultTaxRate,
          defaultCurrency: data.settings.defaultCurrency ?? existing.defaultCurrency,
          defaultTerms: data.settings.defaultTerms ?? existing.defaultTerms,
          defaultNotes: data.settings.defaultNotes ?? existing.defaultNotes,
          companyName: data.settings.companyName ?? existing.companyName,
          companyEmail: data.settings.companyEmail ?? existing.companyEmail,
          companyPhone: data.settings.companyPhone ?? existing.companyPhone,
          companyAddress: data.settings.companyAddress ?? existing.companyAddress,
          signatureImage: data.settings.signatureImage ?? existing.signatureImage,
          paidSealImage: data.settings.paidSealImage ?? existing.paidSealImage,
          updatedAt: new Date(),
        })
        .where(eq(invoiceSettings.id, existing.id))
        .run();
    }

    const invoiceNumber = data.invoiceNumber || getNextInvoiceNumber();
    const totals = calculateInvoiceTotals({
      items: data.items,
      taxRate: data.taxRate || 0,
      discountType: (data.discountType as "fixed" | "percent") || "fixed",
      discountValue: data.discountValue || 0,
    });

    const result = db
      .insert(invoices)
      .values({
        invoiceNumber,
        bookingId: data.bookingId || null,
        clientName: data.clientName,
        clientEmail: data.clientEmail || "",
        clientPhone: data.clientPhone || "",
        clientAddress: data.clientAddress || "",
        issueDate: data.issueDate,
        dueDate: data.dueDate || null,
        status: data.status || "draft",
        currency: data.currency || "BDT",
        subtotal: totals.subtotal,
        taxRate: data.taxRate || 0,
        taxAmount: totals.taxAmount,
        discountType: data.discountType || "fixed",
        discountValue: data.discountValue || 0,
        discountAmount: totals.discountAmount,
        total: totals.total,
        notes: data.notes || "",
        terms: data.terms || "",
        paidAt: data.status === "paid" ? new Date() : null,
        paymentMethod: data.paymentMethod || null,
        paymentReference: data.paymentReference || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .run();

    saveInvoiceItems(Number(result.lastInsertRowid), data.items, data.taxRate || 0, data.discountType || "fixed", data.discountValue || 0);
    incrementInvoiceNumber();

    const newInvoiceId = Number(result.lastInsertRowid);
    if (data.bookingId) {
      linkInvoiceToBooking(data.bookingId, newInvoiceId, invoiceNumber);
    }

    return NextResponse.json({ success: true, id: newInvoiceId });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data: InvoicePayload = await request.json();
    if (!data.id) {
      return NextResponse.json({ error: "Invoice ID required" }, { status: 400 });
    }

    const existing = db.select().from(invoices).where(eq(invoices.id, data.id)).get();
    if (!existing) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (data.settings) {
      const settings = getInvoiceSettings();
      db.update(invoiceSettings)
        .set({
          prefix: data.settings.prefix ?? settings.prefix,
          defaultTaxRate: data.settings.defaultTaxRate ?? settings.defaultTaxRate,
          defaultCurrency: data.settings.defaultCurrency ?? settings.defaultCurrency,
          defaultTerms: data.settings.defaultTerms ?? settings.defaultTerms,
          defaultNotes: data.settings.defaultNotes ?? settings.defaultNotes,
          companyName: data.settings.companyName ?? settings.companyName,
          companyEmail: data.settings.companyEmail ?? settings.companyEmail,
          companyPhone: data.settings.companyPhone ?? settings.companyPhone,
          companyAddress: data.settings.companyAddress ?? settings.companyAddress,
          signatureImage: data.settings.signatureImage ?? settings.signatureImage,
          paidSealImage: data.settings.paidSealImage ?? settings.paidSealImage,
          updatedAt: new Date(),
        })
        .where(eq(invoiceSettings.id, settings.id))
        .run();
    }

    const totals = calculateInvoiceTotals({
      items: data.items,
      taxRate: data.taxRate || 0,
      discountType: (data.discountType as "fixed" | "percent") || "fixed",
      discountValue: data.discountValue || 0,
    });

    const hasPayments = getPaymentsForInvoice(data.id).length > 0;

    const invoiceUpdate: Record<string, unknown> = {
      clientName: data.clientName,
      clientEmail: data.clientEmail || "",
      clientPhone: data.clientPhone || "",
      clientAddress: data.clientAddress || "",
      issueDate: data.issueDate,
      dueDate: data.dueDate || null,
      currency: data.currency || "BDT",
      subtotal: totals.subtotal,
      taxRate: data.taxRate || 0,
      taxAmount: totals.taxAmount,
      discountType: data.discountType || "fixed",
      discountValue: data.discountValue || 0,
      discountAmount: totals.discountAmount,
      total: totals.total,
      notes: data.notes || "",
      terms: data.terms || "",
      updatedAt: new Date(),
    };

    if (!hasPayments) {
      invoiceUpdate.status = data.status;
      invoiceUpdate.paidAt = data.status === "paid" ? existing.paidAt || new Date() : null;
      invoiceUpdate.paymentMethod = data.paymentMethod || null;
      invoiceUpdate.paymentReference = data.paymentReference || null;
    }

    db.update(invoices)
      .set(invoiceUpdate)
      .where(eq(invoices.id, data.id))
      .run();

    saveInvoiceItems(data.id, data.items, data.taxRate || 0, data.discountType || "fixed", data.discountValue || 0);

    if (hasPayments) {
      syncInvoicePaymentStatus(data.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    db.delete(invoiceItems).where(eq(invoiceItems.invoiceId, parseInt(id))).run();
    unlinkBookingByInvoiceId(parseInt(id));
    db.delete(invoices).where(eq(invoices.id, parseInt(id))).run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
  }
}
