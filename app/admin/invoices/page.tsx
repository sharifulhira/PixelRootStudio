"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { formatMoney } from "@/lib/invoices/calculations";

type Invoice = {
  id: number;
  invoiceNumber: string;
  clientName: string;
  clientEmail?: string | null;
  clientPhone?: string | null;
  issueDate: string;
  dueDate: string | null;
  status: string;
  total: number;
  currency: string;
  bookingId: number | null;
  paidAt?: string | Date | null;
};

type Accounting = {
  totalPaid: number;
  totalOutstanding: number;
  paidThisMonth: number;
  invoiceCount: number;
  draftCount: number;
  overdueCount: number;
};

const statusColors: Record<string, string> = {
  draft: "text-slate-400 bg-slate-400/10",
  sent: "text-blue-400 bg-blue-400/10",
  partial: "text-cyan-400 bg-cyan-400/10",
  paid: "text-green-400 bg-green-400/10",
  overdue: "text-red-400 bg-red-400/10",
  cancelled: "text-red-400/50 bg-red-400/5",
};

const filters = ["all", "draft", "sent", "partial", "paid", "overdue", "cancelled"];

const inputClass =
  "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 [color-scheme:dark]";

function matchesSearch(inv: Invoice, query: string) {
  if (!query) return true;
  const haystack = [
    inv.invoiceNumber,
    inv.clientName,
    inv.clientEmail,
    inv.clientPhone,
    inv.bookingId != null ? String(inv.bookingId) : "",
    inv.issueDate,
    inv.dueDate,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [accounting, setAccounting] = useState<Accounting | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await fetch("/api/admin/invoices");
    const data = await res.json();
    setInvoices(data.items || []);
    setAccounting(data.accounting || null);
    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this invoice?")) return;
    await fetch(`/api/admin/invoices?id=${id}`, { method: "DELETE" });
    load();
  }

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: invoices.length };
    for (const inv of invoices) {
      counts[inv.status] = (counts[inv.status] || 0) + 1;
    }
    return counts;
  }, [invoices]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return invoices.filter((inv) => {
      if (filter !== "all" && inv.status !== filter) return false;
      if (!matchesSearch(inv, q)) return false;
      if (dateFrom && inv.issueDate < dateFrom) return false;
      if (dateTo && inv.issueDate > dateTo) return false;
      return true;
    });
  }, [invoices, filter, search, dateFrom, dateTo]);

  const hasActiveFilters = filter !== "all" || search.trim() !== "" || dateFrom !== "" || dateTo !== "";

  function clearFilters() {
    setFilter("all");
    setSearch("");
    setDateFrom("");
    setDateTo("");
  }

  if (loading) return <div className="text-white/50">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Invoices</h1>
          <p className="text-sm text-white/50 mt-1">
            {filtered.length} shown · {invoices.length} total
          </p>
        </div>
        <Link
          href="/admin/invoices/new"
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg text-sm"
        >
          + New Invoice
        </Link>
      </div>

      {accounting && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <p className="text-lg font-bold text-green-400">{formatMoney(accounting.totalPaid)}</p>
            <p className="text-xs text-white/45 mt-1">Total collected</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <p className="text-lg font-bold text-amber-400">{formatMoney(accounting.totalOutstanding)}</p>
            <p className="text-xs text-white/45 mt-1">Outstanding</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <p className="text-lg font-bold text-blue-400">{formatMoney(accounting.paidThisMonth)}</p>
            <p className="text-xs text-white/45 mt-1">Paid this month</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-lg font-bold text-white">{accounting.invoiceCount}</p>
            <p className="text-xs text-white/45 mt-1">
              {accounting.draftCount} draft · {accounting.overdueCount} overdue
            </p>
          </div>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 space-y-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === f
                  ? "bg-amber-500 text-slate-900"
                  : "bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              {(statusCounts[f] ?? 0) > 0 && (
                <span
                  className={`ml-1.5 text-[9px] px-1.5 py-0.5 rounded ${
                    filter === f ? "bg-slate-900/20 text-slate-900" : "bg-white/10 text-white/40"
                  }`}
                >
                  {statusCounts[f]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="search"
            placeholder="Search invoice #, client, email, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} sm:col-span-2`}
          />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className={inputClass}
            aria-label="Issue date from"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className={inputClass}
            aria-label="Issue date to"
          />
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-white/40">
              {filtered.length} invoice{filtered.length === 1 ? "" : "s"} match your filters
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center text-white/50">
          {invoices.length === 0 ? (
            <>
              No invoices yet.{" "}
              <Link href="/admin/invoices/new" className="text-amber-400 hover:underline">
                Create one
              </Link>
            </>
          ) : (
            <>No invoices match your filters.</>
          )}
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {filtered.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.03]">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link href={`/admin/invoices/${inv.id}`} className="text-sm font-medium text-white hover:text-amber-400">
                      {inv.invoiceNumber}
                    </Link>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${statusColors[inv.status]}`}>
                      {inv.status}
                    </span>
                    {inv.bookingId && (
                      <Link
                        href={`/admin/bookings?highlight=${inv.bookingId}`}
                        className="text-[9px] text-white/30 hover:text-amber-400"
                      >
                        Booking #{inv.bookingId}
                      </Link>
                    )}
                  </div>
                  <p className="text-xs text-white/40">
                    {inv.clientName}
                    {inv.clientEmail ? ` · ${inv.clientEmail}` : ""}
                    {inv.clientPhone ? ` · ${inv.clientPhone}` : ""}
                    {" · "}
                    {inv.issueDate}
                    {inv.dueDate ? ` · Due ${inv.dueDate}` : ""}
                    {inv.status === "paid" && inv.paidAt
                      ? ` · Paid ${new Date(inv.paidAt).toISOString().slice(0, 10)}`
                      : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-sm font-semibold text-white">
                    {formatMoney(inv.total || 0, inv.currency || "BDT")}
                  </span>
                  <Link href={`/admin/invoices/${inv.id}`} className="text-xs text-amber-400 hover:underline">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(inv.id)} className="text-xs text-red-400 hover:text-red-300">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
