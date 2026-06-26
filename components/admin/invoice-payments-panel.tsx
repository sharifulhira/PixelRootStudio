"use client";

import { useState } from "react";
import { formatMoney, calculatePaymentSummary } from "@/lib/invoices/calculations";

export type InvoicePaymentRow = {
  id: number;
  amount: number;
  paymentDate: string;
  method: string | null;
  reference: string | null;
  notes: string | null;
};

type Props = {
  invoiceId?: number;
  currency: string;
  invoiceTotal: number;
  amountPaid: number;
  balanceDue: number;
  payments: InvoicePaymentRow[];
  onPaymentsChange: (payments: InvoicePaymentRow[], amountPaid: number, balanceDue: number, status: string) => void;
};

const inputClass =
  "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50";

const METHODS = ["Cash", "bKash", "Nagad", "Bank Transfer", "Card", "Other"];

export function InvoicePaymentsPanel({
  invoiceId,
  currency,
  invoiceTotal,
  amountPaid,
  balanceDue,
  payments,
  onPaymentsChange,
}: Props) {
  const [recording, setRecording] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [method, setMethod] = useState("bKash");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  const historySum = calculatePaymentSummary(invoiceTotal, payments).amountPaid;

  async function handleRecordPayment() {
    if (!invoiceId) {
      alert("Save the invoice first before recording a payment.");
      return;
    }

    const payAmount = parseFloat(amount);
    if (!payAmount || payAmount <= 0) {
      alert("Enter a valid payment amount");
      return;
    }

    if (payAmount > balanceDue) {
      alert(`Amount cannot exceed balance due (${formatMoney(balanceDue, currency)})`);
      return;
    }

    setRecording(true);
    try {
      const res = await fetch("/api/admin/invoices/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId,
          amount: payAmount,
          paymentDate,
          method,
          reference,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const newPayment = data.payment as InvoicePaymentRow;
      const updated = [newPayment, ...payments];
      const summary = calculatePaymentSummary(invoiceTotal, updated);
      onPaymentsChange(updated, summary.amountPaid, summary.balanceDue, data.status);

      setAmount(summary.balanceDue > 0 ? String(summary.balanceDue) : "");
      setReference("");
      setNotes("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to record payment");
    }
    setRecording(false);
  }

  async function handleDeletePayment(paymentId: number) {
    if (!confirm("Remove this payment record?")) return;

    try {
      const res = await fetch(`/api/admin/invoices/payments?id=${paymentId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const updated = payments.filter((p) => p.id !== paymentId);
      const summary = calculatePaymentSummary(invoiceTotal, updated);
      onPaymentsChange(updated, summary.amountPaid, summary.balanceDue, data.status);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete payment");
    }
  }

  function fillBalance() {
    if (balanceDue > 0) setAmount(String(balanceDue));
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Payments</p>
          <p className="text-[11px] text-white/35 mt-1">Paid total is the sum of all payment records below</p>
        </div>
        <div className="flex gap-3 sm:gap-5 text-sm">
          <div className="text-right">
            <p className="text-white/40 text-xs">Invoice total</p>
            <p className="font-semibold text-white">{formatMoney(invoiceTotal, currency)}</p>
          </div>
          <div className="text-right">
            <p className="text-white/40 text-xs">Paid</p>
            <p className="font-semibold text-emerald-400">{formatMoney(amountPaid, currency)}</p>
          </div>
          <div className="text-right">
            <p className="text-white/40 text-xs">Balance</p>
            <p className="font-semibold text-amber-400">{formatMoney(balanceDue, currency)}</p>
          </div>
        </div>
      </div>

      {!invoiceId ? (
        <p className="text-sm text-white/40 py-2">Save the invoice first to record payments.</p>
      ) : balanceDue <= 0 && amountPaid > 0 ? (
        <p className="text-sm text-emerald-400/80 py-2">Fully paid — invoice total matches payment records.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-[11px] text-white/40 mb-1 block">Amount *</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  max={balanceDue}
                  step={0.01}
                  className={inputClass}
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                {balanceDue > 0 && (
                  <button
                    type="button"
                    onClick={fillBalance}
                    className="shrink-0 px-2 py-1 text-[10px] text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/10"
                  >
                    Full
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="text-[11px] text-white/40 mb-1 block">Payment date *</label>
              <input
                type="date"
                className={inputClass}
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[11px] text-white/40 mb-1 block">Method</label>
              <select className={inputClass} value={method} onChange={(e) => setMethod(e.target.value)}>
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-white/40 mb-1 block">Reference / TXN ID</label>
              <input
                className={inputClass}
                placeholder="Transaction reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] text-white/40 mb-1 block">Notes</label>
              <input
                className={inputClass}
                placeholder="Optional payment note"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleRecordPayment}
            disabled={recording || balanceDue <= 0}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-lg text-sm"
          >
            {recording ? "Recording..." : "+ Record Payment"}
          </button>
        </>
      )}

      {payments.length > 0 && (
        <div className="mt-5 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/35">Payment history</p>
            <p className="text-[11px] text-white/40">
              Sum: <span className="text-emerald-400 font-medium">{formatMoney(historySum, currency)}</span>
            </p>
          </div>
          <div className="space-y-2">
            {payments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-black/20 border border-white/5 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">
                    {formatMoney(p.amount, currency)}
                    <span className="text-white/40 font-normal ml-2">{p.paymentDate}</span>
                  </p>
                  <p className="text-xs text-white/40 truncate">
                    {[p.method, p.reference, p.notes].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
                {invoiceId && (
                  <button
                    type="button"
                    onClick={() => handleDeletePayment(p.id)}
                    className="text-xs text-red-400 hover:text-red-300 shrink-0"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
