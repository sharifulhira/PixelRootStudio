"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  service: string | null;
  message: string;
  status: string;
  createdAt: string | null;
  bookingId: number | null;
};

type Package = {
  id: number;
  name: string;
  active: boolean | null;
};

const statusColors: Record<string, string> = {
  new: "text-yellow-400 bg-yellow-400/10",
  contacted: "text-blue-400 bg-blue-400/10",
  converted: "text-emerald-400 bg-emerald-400/10",
  closed: "text-green-400 bg-green-400/10",
};

const statusOptions = ["new", "contacted", "converted", "closed"];

const serviceToEventType: Record<string, string> = {
  "Fashion & Editorial": "fashion",
  Weddings: "wedding",
  "Corporate Events": "corporate",
  "Commercial Product": "product",
  "Cinematic Video": "other",
  "Model Portfolios": "fashion",
};

const inputClass =
  "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [showConvert, setShowConvert] = useState(false);
  const [converting, setConverting] = useState(false);
  const [convertError, setConvertError] = useState("");
  const [convertForm, setConvertForm] = useState({
    packageId: "",
    eventDate: "",
    eventType: "",
  });

  useEffect(() => {
    loadLeads();
    fetch("/api/admin/packages")
      .then((res) => res.json())
      .then((data) => setPackages((data.items || []).filter((p: Package) => p.active !== false)));
  }, []);

  async function loadLeads() {
    const res = await fetch("/api/admin/leads");
    const data = await res.json();
    setLeads(data.items || []);
    setLoading(false);
  }

  async function updateStatus(id: number, status: string) {
    await fetch("/api/admin/leads", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    loadLeads();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this lead?")) return;
    await fetch(`/api/admin/leads?id=${id}`, { method: "DELETE" });
    setSelected(null);
    setShowConvert(false);
    loadLeads();
  }

  function openConvert(lead: Lead) {
    setConvertError("");
    setConvertForm({
      packageId: "",
      eventDate: "",
      eventType: lead.service ? serviceToEventType[lead.service] || "" : "",
    });
    setShowConvert(true);
  }

  async function handleConvert() {
    if (!selected) return;
    setConverting(true);
    setConvertError("");

    try {
      const res = await fetch("/api/admin/leads/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: selected.id,
          packageId: convertForm.packageId ? parseInt(convertForm.packageId) : null,
          eventDate: convertForm.eventDate || null,
          eventType: convertForm.eventType || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to convert");
      }

      setShowConvert(false);
      setSelected(null);
      await loadLeads();
      window.location.href = `/admin/bookings?highlight=${data.bookingId}`;
    } catch (err) {
      setConvertError(err instanceof Error ? err.message : "Conversion failed");
    } finally {
      setConverting(false);
    }
  }

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);
  const newCount = leads.filter((l) => l.status === "new").length;

  if (loading) {
    return <div className="text-white/50">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Leads</h1>
        <p className="text-sm text-white/50 mt-1">
          Contact form inquiries — {leads.length} total • {newCount} new
        </p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {["all", ...statusOptions].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === s
                ? "bg-amber-500 text-slate-900"
                : "bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/[0.08]"
            }`}
          >
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            {s === "new" && newCount > 0 && (
              <span className="ml-1.5 bg-yellow-400/20 text-yellow-400 text-[9px] px-1.5 py-0.5 rounded">
                {newCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center text-white/50">
          No leads {filter !== "all" ? `with status "${filter}"` : "yet"}
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {filtered.map((lead) => (
              <div
                key={lead.id}
                onClick={() => {
                  setSelected(lead);
                  setShowConvert(false);
                  setConvertError("");
                }}
                className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.03] cursor-pointer transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-white truncate">{lead.name}</h3>
                    <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${statusColors[lead.status] || statusColors.new}`}>
                      {lead.status}
                    </span>
                    {lead.bookingId && (
                      <span className="text-[9px] font-semibold text-emerald-400/80 uppercase tracking-wider">
                        → Booking #{lead.bookingId}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-white/40">
                    {lead.service && <span>{lead.service}</span>}
                    <span>{lead.phone}</span>
                    {lead.email && <span>{lead.email}</span>}
                  </div>
                </div>
                <div className="text-[10px] text-white/30 whitespace-nowrap ml-4">
                  {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-white/10 rounded-xl p-6 w-full max-w-lg my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                {showConvert ? "Convert to Booking" : "Lead Details"}
              </h3>
              <button
                onClick={() => {
                  setSelected(null);
                  setShowConvert(false);
                  setConvertError("");
                }}
                className="text-white/40 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {showConvert ? (
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white/70">
                  <p className="font-medium text-white">{selected.name}</p>
                  <p className="text-xs text-white/50 mt-1">{selected.phone}</p>
                  {selected.service && (
                    <p className="text-xs text-amber-400/80 mt-1">{selected.service}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-white/40 mb-1">Package (optional)</label>
                  <select
                    value={convertForm.packageId}
                    onChange={(e) => setConvertForm({ ...convertForm, packageId: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">Custom inquiry</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/40 mb-1">Event Date</label>
                    <input
                      type="date"
                      value={convertForm.eventDate}
                      onChange={(e) => setConvertForm({ ...convertForm, eventDate: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-1">Event Type</label>
                    <select
                      value={convertForm.eventType}
                      onChange={(e) => setConvertForm({ ...convertForm, eventType: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Auto from service</option>
                      <option value="wedding">Wedding</option>
                      <option value="corporate">Corporate</option>
                      <option value="fashion">Fashion</option>
                      <option value="product">Product</option>
                      <option value="birthday">Birthday / Party</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <p className="text-[11px] text-white/40 leading-relaxed">
                  Creates a pending booking with this lead&apos;s contact info and message. The lead will be marked as converted.
                </p>

                {convertError && (
                  <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                    {convertError}
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleConvert}
                    disabled={converting}
                    className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 text-sm font-semibold rounded-lg transition-colors"
                  >
                    {converting ? "Converting..." : "Create Booking"}
                  </button>
                  <button
                    onClick={() => {
                      setShowConvert(false);
                      setConvertError("");
                    }}
                    className="px-4 py-2.5 text-sm text-white/60 hover:text-white border border-white/10 rounded-lg"
                  >
                    Back
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Name</p>
                      <p className="text-sm text-white mt-0.5">{selected.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Phone</p>
                      <a href={`tel:${selected.phone.replace(/\s/g, "")}`} className="text-sm text-amber-400 hover:underline mt-0.5 block">
                        {selected.phone}
                      </a>
                    </div>
                    {selected.email && (
                      <div className="col-span-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Email</p>
                        <a href={`mailto:${selected.email}`} className="text-sm text-amber-400 hover:underline mt-0.5 block">
                          {selected.email}
                        </a>
                      </div>
                    )}
                    {selected.service && (
                      <div className="col-span-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Service</p>
                        <p className="text-sm text-white mt-0.5">{selected.service}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1.5">Message</p>
                    <p className="text-sm text-white/70 bg-white/5 rounded-lg p-3 whitespace-pre-wrap">{selected.message}</p>
                  </div>

                  {selected.bookingId ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                      <p className="text-xs text-emerald-400 font-medium">Converted to booking</p>
                      <Link
                        href={`/admin/bookings?highlight=${selected.bookingId}`}
                        className="text-xs text-emerald-300 hover:underline mt-1 inline-block"
                      >
                        View Booking #{selected.bookingId} →
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={() => openConvert(selected)}
                      className="w-full px-4 py-2.5 bg-amber-500/10 border border-amber-500/25 text-amber-400 hover:bg-amber-500/20 text-sm font-semibold rounded-lg transition-colors"
                    >
                      Convert to Booking
                    </button>
                  )}

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-2">Update Status</p>
                    <div className="flex gap-2 flex-wrap">
                      {statusOptions.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            updateStatus(selected.id, s);
                            setSelected({ ...selected, status: s });
                          }}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                            selected.status === s
                              ? (statusColors[s] || statusColors.new) + " border-transparent"
                              : "border-white/10 text-white/40 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6 pt-4 border-t border-white/5">
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="px-3 py-1.5 text-xs text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="px-4 py-2 text-sm text-white/60 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
