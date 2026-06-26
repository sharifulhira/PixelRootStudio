export type InvoicePrintData = {
  invoiceNumber: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  issueDate: string;
  dueDate?: string;
  status: string;
  currency: string;
  taxRate: number;
  notes?: string;
  terms?: string;
  paymentMethod?: string;
  paymentReference?: string;
  amountPaid?: number;
  balanceDue?: number;
  bookingId?: number | null;
  payments?: { amount: number; paymentDate: string; method?: string; reference?: string }[];
  company: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    signatureImage?: string | null;
    paidSealImage?: string | null;
  };
  items: { description: string; quantity: number; unitPrice: number; amount: number }[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
};

/** QR encodes invoice number + verification URL for authenticity checks (not payment). */
export function buildInvoiceQrPayload(
  data: Pick<InvoicePrintData, "invoiceNumber" | "issueDate">,
  siteUrl?: string
): string {
  if (siteUrl) {
    const base = siteUrl.replace(/\/$/, "");
    return `${base}/verify/invoice/${encodeURIComponent(data.invoiceNumber)}`;
  }

  return JSON.stringify({
    type: "pixelroot-invoice",
    inv: data.invoiceNumber,
    issued: data.issueDate,
  });
}
