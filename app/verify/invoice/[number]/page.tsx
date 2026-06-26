import type { Metadata } from "next";
import Link from "next/link";
import { getInvoiceByNumber } from "@/lib/invoices/queries";
import { formatMoney } from "@/lib/invoices/calculations";

export const metadata: Metadata = {
  title: "Verify Invoice — PixelRoot Studio",
  robots: { index: false, follow: false },
};

const statusLabel: Record<string, string> = {
  draft: "Draft",
  sent: "Issued",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

export default async function VerifyInvoicePage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const invoiceNumber = decodeURIComponent(number);
  const invoice = getInvoiceByNumber(invoiceNumber);

  return (
    <main className="min-h-screen bg-[#0f1419] text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        {invoice ? (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400/90 mb-2">
              Authentic invoice
            </p>
            <h1 className="text-2xl font-bold mb-1">Verified</h1>
            <p className="text-sm text-white/50 mb-6">
              This invoice was issued by {invoice.company.name || "PixelRoot Studio"}.
            </p>

            <dl className="rounded-xl border border-white/10 bg-black/20 text-left text-sm divide-y divide-white/5">
              <div className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-white/50">Invoice number</dt>
                <dd className="font-mono font-semibold text-amber-400">{invoice.invoiceNumber}</dd>
              </div>
              <div className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-white/50">Issue date</dt>
                <dd>{invoice.issueDate}</dd>
              </div>
              {invoice.dueDate && (
                <div className="flex justify-between gap-4 px-4 py-3">
                  <dt className="text-white/50">Due date</dt>
                  <dd>{invoice.dueDate}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-white/50">Status</dt>
                <dd>{statusLabel[invoice.status] || invoice.status}</dd>
              </div>
              <div className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-white/50">Amount</dt>
                <dd className="font-semibold">
                  {formatMoney(invoice.total || 0, invoice.currency || "BDT")}
                </dd>
              </div>
            </dl>
          </>
        ) : (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 text-red-400">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-400/90 mb-2">
              Not found
            </p>
            <h1 className="text-2xl font-bold mb-2">Verification failed</h1>
            <p className="text-sm text-white/50 mb-4">
              No invoice matches <span className="font-mono text-white/70">{invoiceNumber}</span>.
            </p>
            <p className="text-xs text-white/40">
              This document may be invalid or the invoice number may be incorrect.
            </p>
          </>
        )}

        <Link
          href="/"
          className="mt-8 inline-block text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back to PixelRoot Studio
        </Link>
      </div>
    </main>
  );
}
