"use client";

import { useMemo, useEffect } from "react";
import QRCode from "react-qr-code";
import { formatMoney } from "@/lib/invoices/calculations";
import { buildInvoiceQrPayload, type InvoicePrintData } from "@/lib/invoices/qr-payload";
import { prepareInvoicePrint, cleanupInvoicePrint } from "@/lib/invoices/print-fit";

const statusPrint: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-slate-100 text-slate-600" },
  sent: { label: "Due", className: "bg-amber-100 text-amber-800" },
  partial: { label: "Partial", className: "bg-blue-100 text-blue-800" },
  paid: { label: "Paid", className: "bg-emerald-100 text-emerald-800" },
  overdue: { label: "Overdue", className: "bg-red-100 text-red-800" },
  cancelled: { label: "Cancelled", className: "bg-slate-100 text-slate-400" },
};

type Props = {
  data: InvoicePrintData;
  siteUrl?: string;
};

export function InvoicePrintView({ data, siteUrl }: Props) {
  const qrValue = useMemo(() => buildInvoiceQrPayload(data, siteUrl), [data, siteUrl]);
  const status = statusPrint[data.status] || statusPrint.draft;
  const isPaidInFull =
    data.status === "paid" ||
    ((data.balanceDue ?? 0) <= 0 && (data.amountPaid ?? 0) > 0);
  const footerLabel = isPaidInFull ? "Paid in full" : "Balance due";
  const footerAmount = isPaidInFull
    ? data.amountPaid ?? data.total
    : (data.balanceDue ?? 0) > 0
      ? data.balanceDue!
      : data.total;

  useEffect(() => {
    function onBeforePrint() {
      prepareInvoicePrint();
    }
    function onAfterPrint() {
      cleanupInvoicePrint();
    }
    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("afterprint", onAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("afterprint", onAfterPrint);
      cleanupInvoicePrint();
    };
  }, [data]);

  return (
    <div
      id="invoice-print"
      className="invoice-a4 bg-white text-slate-900 text-sm mx-auto shadow-xl rounded-xl overflow-hidden print:mx-0 print:shadow-none print:rounded-none print:overflow-hidden"
    >
      <div className="invoice-print-scale">
        <header className="invoice-print-header invoice-header-band bg-[#0f1419] text-white px-8 sm:px-10 py-6 sm:py-8">
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-400/90 mb-2">
                Photography Studio
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                {data.company.name || "PixelRoot Studio"}
              </h1>
              <div className="mt-2 space-y-0.5 text-sm text-white/65">
                {data.company.address && <p>{data.company.address}</p>}
                {data.company.email && <p>{data.company.email}</p>}
                {data.company.phone && <p>{data.company.phone}</p>}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-3xl sm:text-4xl font-bold tracking-tight text-white/95">INVOICE</p>
              <p className="text-sm font-mono text-amber-400 mt-2">{data.invoiceNumber}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${status.className}`}
              >
                {status.label}
              </span>
            </div>
          </div>
        </header>

        <div className="invoice-print-body px-8 sm:px-10 py-5 sm:py-6">
          <div className="invoice-print-content">
            <div className="invoice-print-meta grid grid-cols-2 gap-4 mb-5">
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">Bill To</p>
                <p className="text-base sm:text-lg font-semibold text-slate-900">{data.clientName || "—"}</p>
                {data.clientEmail && <p className="text-sm text-slate-600 mt-1">{data.clientEmail}</p>}
                {data.clientPhone && <p className="text-sm text-slate-600">{data.clientPhone}</p>}
                {data.clientAddress && <p className="text-sm text-slate-600 mt-1">{data.clientAddress}</p>}
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">Invoice Details</p>
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Issue date</dt>
                    <dd className="font-medium text-slate-900">{data.issueDate}</dd>
                  </div>
                  {data.dueDate && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-500">Due date</dt>
                      <dd className="font-medium text-slate-900">{data.dueDate}</dd>
                    </div>
                  )}
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Currency</dt>
                  <dd className="font-medium text-slate-900">{data.currency}</dd>
                </div>
                {data.bookingId && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Booking ref</dt>
                    <dd className="font-medium text-slate-900 font-mono">#{data.bookingId}</dd>
                  </div>
                )}
                {data.status === "paid" && data.paymentMethod && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Payment</dt>
                    <dd className="font-medium text-slate-900">{data.paymentMethod}</dd>
                  </div>
                )}
                {(data.status === "paid" || data.status === "partial") && data.payments && data.payments.length > 0 && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Paid on</dt>
                    <dd className="font-medium text-slate-900">{data.payments[0].paymentDate}</dd>
                  </div>
                )}
                {typeof data.amountPaid === "number" && data.amountPaid > 0 && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Amount paid</dt>
                    <dd className="font-medium text-emerald-700">{formatMoney(data.amountPaid, data.currency)}</dd>
                  </div>
                )}
                {typeof data.balanceDue === "number" && data.balanceDue > 0 && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Balance due</dt>
                    <dd className="font-medium text-amber-700">{formatMoney(data.balanceDue, data.currency)}</dd>
                  </div>
                )}
                </dl>
              </div>
            </div>

            <table className="invoice-print-table w-full mb-5 border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-left">
                  <th className="py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider">Description</th>
                  <th className="py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-right w-16">Qty</th>
                  <th className="py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-right w-28">Rate</th>
                  <th className="py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-right w-28">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, i) => (
                  <tr
                    key={i}
                    className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}
                  >
                    <td className="py-2.5 px-3 text-sm text-slate-800">{item.description || "—"}</td>
                    <td className="py-2.5 px-3 text-sm text-right text-slate-600 tabular-nums">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-sm text-right text-slate-600 tabular-nums">
                      {formatMoney(item.unitPrice, data.currency)}
                    </td>
                    <td className="py-2.5 px-3 text-sm text-right font-medium text-slate-900 tabular-nums">
                      {formatMoney(item.amount, data.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="invoice-print-bottom flex gap-5 justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                <div className="invoice-print-qr p-2 bg-white border border-slate-200 rounded-lg shrink-0">
                  <QRCode value={qrValue} size={80} level="M" viewBox="0 0 256 256" />
                </div>
                <div className="text-xs text-slate-500 max-w-[170px] leading-relaxed">
                  <p className="font-semibold text-slate-700 mb-1 text-sm">Invoice verification</p>
                  <p className="mb-1">Scan to verify authenticity.</p>
                  <p className="font-mono text-xs font-semibold text-slate-800">{data.invoiceNumber}</p>
                </div>
              </div>

              <div className="w-60 sm:w-72 rounded-lg border border-slate-200 overflow-hidden shrink-0">
                <div className="px-4 py-2.5 space-y-1.5 text-sm border-b border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="tabular-nums">{formatMoney(data.subtotal, data.currency)}</span>
                  </div>
                  {data.discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount</span>
                      <span className="tabular-nums">-{formatMoney(data.discountAmount, data.currency)}</span>
                    </div>
                  )}
                  {data.taxAmount > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Tax ({data.taxRate}%)</span>
                      <span className="tabular-nums">{formatMoney(data.taxAmount, data.currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-slate-800 pt-1 border-t border-slate-200">
                    <span>Invoice total</span>
                    <span className="tabular-nums">{formatMoney(data.total, data.currency)}</span>
                  </div>
                  {(data.amountPaid ?? 0) > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Paid</span>
                      <span className="tabular-nums">-{formatMoney(data.amountPaid ?? 0, data.currency)}</span>
                    </div>
                  )}
                </div>
                <div className="px-4 py-3.5 bg-[#0f1419] text-white flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
                    {footerLabel}
                  </span>
                  <span className="text-xl font-bold text-amber-400 tabular-nums">
                    {formatMoney(footerAmount, data.currency)}
                  </span>
                </div>
              </div>
            </div>

            {(data.notes || data.terms) && (
              <div className="invoice-print-notes grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                {data.notes && (
                  <div>
                    <p className="invoice-print-notes-label text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-1.5">Notes</p>
                    <p className="invoice-print-notes-body text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{data.notes}</p>
                  </div>
                )}
                {data.terms && (
                  <div>
                    <p className="invoice-print-notes-label text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-1.5">Payment Terms</p>
                    <p className="invoice-print-notes-body text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{data.terms}</p>
                  </div>
                )}
              </div>
            )}

            {data.payments && data.payments.length > 0 && (
              <div className="invoice-print-payments mt-4 pt-3 border-t border-slate-200">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">
                  Payment Records
                </p>
                <div className="space-y-1">
                  {data.payments.map((p, i) => (
                    <div key={i} className="flex justify-between gap-4 text-sm text-slate-700">
                      <span>
                        {p.paymentDate}
                        {p.method ? ` · ${p.method}` : ""}
                        {p.reference ? ` · ${p.reference}` : ""}
                      </span>
                      <span className="font-medium tabular-nums">{formatMoney(p.amount, data.currency)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(data.company.signatureImage || data.company.paidSealImage) && (
              <div className="invoice-print-signatures mt-6 pt-4 border-t border-slate-200 flex justify-end">
                <div className="relative inline-flex flex-col items-end">
                  <div className="relative pr-2 pb-1 min-h-[5.5rem] min-w-[10rem] flex items-end justify-end">
                    {data.company.signatureImage && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={data.company.signatureImage}
                        alt="Authorized signature"
                        className="invoice-print-signature block w-auto h-auto max-h-16 sm:max-h-[72px] max-w-[70mm] object-contain object-right"
                      />
                    )}
                    {data.status === "paid" && data.company.paidSealImage && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={data.company.paidSealImage}
                        alt="Paid seal"
                        className={`invoice-print-seal object-contain -rotate-12 drop-shadow-sm pointer-events-none ${
                          data.company.signatureImage
                            ? "absolute right-14 sm:right-20 top-1/2 -translate-y-1/2 z-10 max-h-28 sm:max-h-32 max-w-28 sm:max-w-32 w-auto h-auto"
                            : "max-h-28 sm:max-h-32 max-w-28 sm:max-w-32 w-auto h-auto"
                        }`}
                      />
                    )}
                  </div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 mt-1 pr-1">
                    Authorized Signature
                  </p>
                </div>
              </div>
            )}
          </div>

          <footer className="invoice-print-footer">
            <p className="text-center text-xs text-slate-400 tracking-wide">
              Thank you for your business · {data.company.name || "PixelRoot Studio"}
            </p>
            <p className="text-center text-[11px] text-slate-300 mt-1 font-mono">{data.invoiceNumber}</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
