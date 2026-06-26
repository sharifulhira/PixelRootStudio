"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { calculateInvoiceTotals, calculatePaymentSummary, formatMoney } from "@/lib/invoices/calculations";
import { InvoicePrintView } from "@/components/admin/invoice-print-view";
import { prepareInvoicePrint, cleanupInvoicePrint } from "@/lib/invoices/print-fit";
import { ImageUploader } from "@/components/admin/image-uploader";
import { InvoicePaymentsPanel, type InvoicePaymentRow } from "@/components/admin/invoice-payments-panel";
import type { InvoicePrintData } from "@/lib/invoices/qr-payload";

export type InvoiceLineItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type InvoiceFormData = {
  id?: number;
  invoiceNumber: string;
  bookingId?: number | null;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  issueDate: string;
  dueDate: string;
  status: string;
  currency: string;
  taxRate: number;
  discountType: "fixed" | "percent";
  discountValue: number;
  notes: string;
  terms: string;
  paymentMethod: string;
  paymentReference: string;
  items: InvoiceLineItem[];
  settings: {
    prefix: string;
    defaultTaxRate: number;
    defaultCurrency: string;
    defaultTerms: string;
    defaultNotes: string;
    companyName: string;
    companyEmail: string;
    companyPhone: string;
    companyAddress: string;
    signatureImage: string;
    paidSealImage: string;
  };
};

const inputClass =
  "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50";

const STATUS_OPTIONS = ["draft", "sent", "partial", "paid", "overdue", "cancelled"];

type Props = {
  invoiceId?: number;
  fromBookingId?: number;
};

const emptyItem = (): InvoiceLineItem => ({ description: "", quantity: 1, unitPrice: 0 });

export function InvoiceForm({ invoiceId, fromBookingId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const [siteUrl, setSiteUrl] = useState<string>();
  const [form, setForm] = useState<InvoiceFormData | null>(null);
  const [payments, setPayments] = useState<InvoicePaymentRow[]>([]);

  useEffect(() => {
    async function load() {
      try {
        let url = "/api/admin/invoices";
        if (invoiceId) url += `?id=${invoiceId}`;
        else if (fromBookingId) url += `?fromBooking=${fromBookingId}`;

        const [res, seoRes] = await Promise.all([
          fetch(url),
          fetch("/api/admin/seo").catch(() => null),
        ]);
        const data = await res.json();

        if (seoRes?.ok) {
          const seo = await seoRes.json();
          if (seo.siteUrl) setSiteUrl(seo.siteUrl);
        }

        if (invoiceId) {
          setForm({
            id: data.id,
            invoiceNumber: data.invoiceNumber,
            bookingId: data.bookingId,
            clientName: data.clientName,
            clientEmail: data.clientEmail || "",
            clientPhone: data.clientPhone || "",
            clientAddress: data.clientAddress || "",
            issueDate: data.issueDate,
            dueDate: data.dueDate || "",
            status: data.status,
            currency: data.currency || "BDT",
            taxRate: data.taxRate || 0,
            discountType: data.discountType || "fixed",
            discountValue: data.discountValue || 0,
            notes: data.notes || "",
            terms: data.terms || "",
            paymentMethod: data.paymentMethod || "",
            paymentReference: data.paymentReference || "",
            items: data.items?.length
              ? data.items.map((i: { description: string; quantity: number; unitPrice: number }) => ({
                  description: i.description,
                  quantity: i.quantity,
                  unitPrice: i.unitPrice,
                }))
              : [emptyItem()],
            settings: {
              prefix: "INV",
              defaultTaxRate: data.taxRate || 0,
              defaultCurrency: data.currency || "BDT",
              defaultTerms: data.terms || "",
              defaultNotes: data.notes || "",
              companyName: data.company?.name || "",
              companyEmail: data.company?.email || "",
              companyPhone: data.company?.phone || "",
              companyAddress: data.company?.address || "",
              signatureImage: data.company?.signatureImage || "",
              paidSealImage: data.company?.paidSealImage || "",
            },
          });
          setPayments(data.payments || []);
        } else if (fromBookingId) {
          if (data.alreadyInvoiced && data.existingInvoiceId) {
            router.replace(`/admin/invoices/${data.existingInvoiceId}`);
            return;
          }
          setForm({
            invoiceNumber: data.invoiceNumber,
            bookingId: data.bookingId,
            clientName: data.clientName,
            clientEmail: data.clientEmail || "",
            clientPhone: data.clientPhone || "",
            clientAddress: data.clientAddress || "",
            issueDate: data.issueDate,
            dueDate: data.dueDate || "",
            status: "draft",
            currency: data.currency || "BDT",
            taxRate: data.taxRate || 0,
            discountType: "fixed",
            discountValue: 0,
            notes: data.notes || "",
            terms: data.terms || "",
            paymentMethod: "",
            paymentReference: "",
            items: data.items || [emptyItem()],
            settings: {
              prefix: "INV",
              defaultTaxRate: data.taxRate || 0,
              defaultCurrency: data.currency || "BDT",
              defaultTerms: data.terms || "",
              defaultNotes: data.notes || "",
              companyName: data.company?.name || "",
              companyEmail: data.company?.email || "",
              companyPhone: data.company?.phone || "",
              companyAddress: data.company?.address || "",
              signatureImage: data.company?.signatureImage || "",
              paidSealImage: data.company?.paidSealImage || "",
            },
          });
        } else {
          const listRes = await fetch("/api/admin/invoices");
          const listData = await listRes.json();
          const s = listData.settings;
          const today = new Date().toISOString().slice(0, 10);
          const due = new Date();
          due.setDate(due.getDate() + 7);
          const prefix = s?.prefix || "INV";
          const year = new Date().getFullYear();
          const num = s?.nextNumber || 1001;

          setForm({
            invoiceNumber: `${prefix}-${year}-${num}`,
            clientName: "",
            clientEmail: "",
            clientPhone: "",
            clientAddress: "",
            issueDate: today,
            dueDate: due.toISOString().slice(0, 10),
            status: "draft",
            currency: s?.defaultCurrency || "BDT",
            taxRate: s?.defaultTaxRate || 0,
            discountType: "fixed",
            discountValue: 0,
            notes: s?.defaultNotes || "",
            terms: s?.defaultTerms || "",
            paymentMethod: "",
            paymentReference: "",
            items: [emptyItem()],
            settings: {
              prefix: s?.prefix || "INV",
              defaultTaxRate: s?.defaultTaxRate || 0,
              defaultCurrency: s?.defaultCurrency || "BDT",
              defaultTerms: s?.defaultTerms || "",
              defaultNotes: s?.defaultNotes || "",
              companyName: s?.companyName || "",
              companyEmail: s?.companyEmail || "",
              companyPhone: s?.companyPhone || "",
              companyAddress: s?.companyAddress || "",
              signatureImage: s?.signatureImage || "",
              paidSealImage: s?.paidSealImage || "",
            },
          });
        }
      } catch {
        alert("Failed to load invoice");
      }
      setLoading(false);
    }
    load();
  }, [invoiceId, fromBookingId]);

  const totals = useMemo(() => {
    if (!form) return null;
    return calculateInvoiceTotals({
      items: form.items,
      taxRate: form.taxRate,
      discountType: form.discountType,
      discountValue: form.discountValue,
    });
  }, [form]);

  const invoiceTotal = totals?.total || 0;
  const { amountPaid, balanceDue } = useMemo(
    () => calculatePaymentSummary(invoiceTotal, payments),
    [invoiceTotal, payments]
  );

  const printData = useMemo((): InvoicePrintData | null => {
    if (!form || !totals) return null;
    return {
      invoiceNumber: form.invoiceNumber,
      clientName: form.clientName,
      clientEmail: form.clientEmail || undefined,
      clientPhone: form.clientPhone || undefined,
      clientAddress: form.clientAddress || undefined,
      issueDate: form.issueDate,
      dueDate: form.dueDate || undefined,
      status: form.status,
      currency: form.currency,
      taxRate: form.taxRate,
      notes: form.notes || undefined,
      terms: form.terms || undefined,
      paymentMethod: form.paymentMethod || undefined,
      paymentReference: form.paymentReference || undefined,
      amountPaid,
      balanceDue,
      bookingId: form.bookingId ?? undefined,
      payments: payments.map((p) => ({
        amount: p.amount,
        paymentDate: p.paymentDate,
        method: p.method || undefined,
        reference: p.reference || undefined,
      })),
      company: {
        name: form.settings.companyName,
        email: form.settings.companyEmail,
        phone: form.settings.companyPhone,
        address: form.settings.companyAddress,
        signatureImage: form.settings.signatureImage || undefined,
        paidSealImage: form.settings.paidSealImage || undefined,
      },
      items: form.items
        .map((item, i) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: totals.lineAmounts[i] ?? item.quantity * item.unitPrice,
        }))
        .filter((i) => i.description.trim()),
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      discountAmount: totals.discountAmount,
      total: totals.total,
    };
  }, [form, totals, payments, amountPaid, balanceDue]);

  function handlePaymentsChange(
    updated: InvoicePaymentRow[],
    _newPaid: number,
    _newBalance: number,
    status: string
  ) {
    setPayments(updated);
    const latest = updated[0];
    setForm((f) =>
      f
        ? {
            ...f,
            status,
            paymentMethod: latest?.method || "",
            paymentReference: latest?.reference || "",
          }
        : f
    );
  }

  function updateItem(index: number, field: keyof InvoiceLineItem, value: string | number) {
    if (!form) return;
    const items = [...form.items];
    items[index] = { ...items[index], [field]: value };
    setForm({ ...form, items });
  }

  function addItem() {
    if (!form) return;
    setForm({ ...form, items: [...form.items, emptyItem()] });
  }

  function removeItem(index: number) {
    if (!form || form.items.length <= 1) return;
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
  }

  async function handleSave() {
    if (!form || !totals) return;
    setSaving(true);

    const payload = {
      ...form,
      items: form.items.filter((i) => i.description.trim()),
    };

    if (payload.items.length === 0) {
      alert("Add at least one line item");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/invoices", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (form.id) {
        router.push("/admin/invoices");
      } else {
        router.push(`/admin/invoices/${data.id}`);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    }
    setSaving(false);
  }

  function handlePrint() {
    prepareInvoicePrint();
    const onAfter = () => {
      cleanupInvoicePrint();
      window.removeEventListener("afterprint", onAfter);
    };
    window.addEventListener("afterprint", onAfter);
    window.print();
  }

  if (loading || !form || !printData) {
    return <div className="text-white/50">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto print:max-w-none print:m-0 print:p-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {form.id ? "Edit Invoice" : "New Invoice"}
          </h1>
          {form.bookingId && (
            <p className="text-xs text-white/40 mt-1">
              Linked to{" "}
              <Link
                href={`/admin/bookings?highlight=${form.bookingId}`}
                className="text-amber-400/80 hover:text-amber-400 hover:underline"
              >
                Booking #{form.bookingId}
              </Link>
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 text-sm text-white/70 border border-white/10 rounded-lg hover:bg-white/5"
          >
            Print
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-semibold rounded-lg text-sm"
          >
            {saving ? "Saving..." : "Save Invoice"}
          </button>
        </div>
      </div>

      {/* Edit form — hidden when printing */}
      <div className="print:hidden space-y-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Bill To</p>
            <input
              className={inputClass}
              placeholder="Client name *"
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Email"
              value={form.clientEmail}
              onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Phone"
              value={form.clientPhone}
              onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Address"
              value={form.clientAddress}
              onChange={(e) => setForm({ ...form, clientAddress: e.target.value })}
            />
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Invoice Details</p>
            <input
              className={inputClass}
              value={form.invoiceNumber}
              onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
              disabled={!!form.id}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                className={inputClass}
                value={form.issueDate}
                onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
              />
              <input
                type="date"
                className={inputClass}
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <select
              className={inputClass}
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            >
              <option value="BDT">BDT (৳)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
        </div>

        {/* Line items editor */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/40">
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold w-20 text-right">Qty</th>
                <th className="px-4 py-3 font-semibold w-28 text-right">Rate</th>
                <th className="px-4 py-3 font-semibold w-28 text-right">Amount</th>
                <th className="px-4 py-3 w-8" />
              </tr>
            </thead>
            <tbody>
              {form.items.map((item, index) => (
                <tr key={index} className="border-b border-white/5">
                  <td className="px-4 py-2">
                    <input
                      className="w-full bg-transparent border-0 text-sm text-white placeholder:text-white/30 focus:outline-none"
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                      placeholder="Service description"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      className="w-full bg-transparent text-right text-sm text-white focus:outline-none"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      className="w-full bg-transparent text-right text-sm text-white focus:outline-none"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="px-4 py-2 text-right text-sm text-white/80">
                    {formatMoney(totals?.lineAmounts[index] || 0, form.currency)}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-400 text-xs hover:text-red-300"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={addItem}
            className="px-4 py-3 text-xs text-amber-400 hover:text-amber-300"
          >
            + Add line item
          </button>
        </div>

        {/* Totals controls */}
        <div className="flex justify-end">
          <div className="w-full sm:w-72 space-y-3 text-sm">
            <div className="flex justify-between text-white/60">
              <span>Subtotal</span>
              <span>{formatMoney(totals?.subtotal || 0, form.currency)}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-white/60">Discount</span>
              <div className="flex gap-1">
                <select
                  className="text-xs bg-white/5 border border-white/10 rounded px-1 text-white"
                  value={form.discountType}
                  onChange={(e) =>
                    setForm({ ...form, discountType: e.target.value as "fixed" | "percent" })
                  }
                >
                  <option value="fixed">৳</option>
                  <option value="percent">%</option>
                </select>
                <input
                  type="number"
                  min={0}
                  className="w-20 text-right text-xs bg-white/5 border border-white/10 rounded px-1 text-white"
                  value={form.discountValue}
                  onChange={(e) =>
                    setForm({ ...form, discountValue: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-white/60">Tax %</span>
              <input
                type="number"
                min={0}
                max={100}
                className="w-20 text-right text-xs bg-white/5 border border-white/10 rounded px-1 text-white"
                value={form.taxRate}
                onChange={(e) => setForm({ ...form, taxRate: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="flex justify-between font-bold text-lg text-white border-t border-white/10 pt-2">
              <span>Total</span>
              <span className="text-amber-400">{formatMoney(totals?.total || 0, form.currency)}</span>
            </div>
          </div>
        </div>

        <InvoicePaymentsPanel
          invoiceId={form.id}
          currency={form.currency}
          invoiceTotal={invoiceTotal}
          amountPaid={amountPaid}
          balanceDue={balanceDue}
          payments={payments}
          onPaymentsChange={handlePaymentsChange}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-white/40 mb-2">Notes</p>
            <textarea
              rows={3}
              className={`${inputClass} resize-none`}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Thank you for your business..."
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-white/40 mb-2">Payment Terms</p>
            <textarea
              rows={3}
              className={`${inputClass} resize-none`}
              value={form.terms}
              onChange={(e) => setForm({ ...form, terms: e.target.value })}
            />
          </div>
        </div>

        {/* Company defaults */}
        <div>
          <button
            type="button"
            onClick={() => setShowCompany(!showCompany)}
            className="text-xs text-white/50 hover:text-white"
          >
            {showCompany ? "▼" : "▶"} Company & invoice defaults
          </button>
          {showCompany && (
            <div className="mt-3 bg-white/5 border border-white/10 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                className={inputClass}
                placeholder="Company name"
                value={form.settings.companyName}
                onChange={(e) =>
                  setForm({ ...form, settings: { ...form.settings, companyName: e.target.value } })
                }
              />
              <input
                className={inputClass}
                placeholder="Company email"
                value={form.settings.companyEmail}
                onChange={(e) =>
                  setForm({ ...form, settings: { ...form.settings, companyEmail: e.target.value } })
                }
              />
              <input
                className={inputClass}
                placeholder="Company phone"
                value={form.settings.companyPhone}
                onChange={(e) =>
                  setForm({ ...form, settings: { ...form.settings, companyPhone: e.target.value } })
                }
              />
              <input
                className={inputClass}
                placeholder="Invoice prefix"
                value={form.settings.prefix}
                onChange={(e) =>
                  setForm({ ...form, settings: { ...form.settings, prefix: e.target.value } })
                }
              />
              <input
                className={`${inputClass} sm:col-span-2`}
                placeholder="Company address"
                value={form.settings.companyAddress}
                onChange={(e) =>
                  setForm({ ...form, settings: { ...form.settings, companyAddress: e.target.value } })
                }
              />
              <textarea
                className={`${inputClass} sm:col-span-2 resize-none`}
                rows={2}
                placeholder="Default terms"
                value={form.settings.defaultTerms}
                onChange={(e) =>
                  setForm({ ...form, settings: { ...form.settings, defaultTerms: e.target.value } })
                }
              />
              <div className="sm:col-span-2 pt-2 border-t border-white/10">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                  Paid invoice assets
                </p>
                <p className="text-[11px] text-white/35 mb-3">
                  Shown on every invoice marked as Paid — upload a signature PNG and a paid seal/stamp PNG.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ImageUploader
                    label="Authorized signature"
                    folder="invoices"
                    aspectRatio="landscape"
                    value={form.settings.signatureImage}
                    onChange={(url) =>
                      setForm({ ...form, settings: { ...form.settings, signatureImage: url } })
                    }
                  />
                  <ImageUploader
                    label="Paid seal / stamp"
                    folder="invoices"
                    aspectRatio="square"
                    value={form.settings.paidSealImage}
                    onChange={(url) =>
                      setForm({ ...form, settings: { ...form.settings, paidSealImage: url } })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print preview — visible on screen & when printing */}
      <div className="print:mt-0">
        <p className="text-xs text-white/40 mb-3 print:hidden uppercase tracking-wider">Print preview</p>
        <InvoicePrintView data={printData} siteUrl={siteUrl} />
      </div>
    </div>
  );
}
