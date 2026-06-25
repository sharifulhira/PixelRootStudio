"use client";

import { useState, useEffect } from "react";

type Booking = {
  id: number;
  packageId: number | null;
  packageName: string | null;
  clientName: string;
  email: string;
  phone: string | null;
  eventDate: string | null;
  eventType: string | null;
  message: string | null;
  status: string;
  createdAt: string | null;
};

const statusColors: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10",
  confirmed: "text-blue-400 bg-blue-400/10",
  completed: "text-green-400 bg-green-400/10",
  cancelled: "text-red-400 bg-red-400/10",
};

const statusOptions = ["pending", "confirmed", "completed", "cancelled"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Booking | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    const res = await fetch("/api/admin/bookings");
    const data = await res.json();
    setBookings(data.items || []);
    setLoading(false);
  }

  async function updateStatus(id: number, status: string) {
    await fetch("/api/admin/bookings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    loadBookings();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this booking?")) return;
    await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" });
    setSelected(null);
    loadBookings();
  }

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  if (loading) {
    return <div className="text-white/50">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Booking Requests</h1>
        <p className="text-sm text-white/50 mt-1">
          {bookings.length} total • {pendingCount} pending
        </p>
      </div>

      {/* Filter Tabs */}
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
            {s.charAt(0).toUpperCase() + s.slice(1)}
            {s === "pending" && pendingCount > 0 && (
              <span className="ml-1.5 bg-yellow-400/20 text-yellow-400 text-[9px] px-1.5 py-0.5 rounded">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center text-white/50">
          No bookings {filter !== "all" ? `with status "${filter}"` : "yet"}
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {filtered.map((booking) => (
              <div
                key={booking.id}
                onClick={() => setSelected(booking)}
                className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.03] cursor-pointer transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-white truncate">{booking.clientName}</h3>
                    <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-white/40">
                    {booking.packageName && <span>{booking.packageName}</span>}
                    <span>{booking.email}</span>
                    {booking.eventDate && <span>{booking.eventDate}</span>}
                  </div>
                </div>
                <div className="text-[10px] text-white/30 whitespace-nowrap ml-4">
                  {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-white/10 rounded-xl p-6 w-full max-w-lg my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Booking Details</h3>
              <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Client Name</p>
                  <p className="text-sm text-white mt-0.5">{selected.clientName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Email</p>
                  <p className="text-sm text-white mt-0.5">{selected.email}</p>
                </div>
                {selected.phone && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Phone</p>
                    <p className="text-sm text-white mt-0.5">{selected.phone}</p>
                  </div>
                )}
                {selected.eventDate && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Event Date</p>
                    <p className="text-sm text-white mt-0.5">{selected.eventDate}</p>
                  </div>
                )}
                {selected.eventType && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Event Type</p>
                    <p className="text-sm text-white mt-0.5 capitalize">{selected.eventType}</p>
                  </div>
                )}
                {selected.packageName && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Package</p>
                    <p className="text-sm text-white mt-0.5">{selected.packageName}</p>
                  </div>
                )}
              </div>

              {selected.message && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1.5">Message</p>
                  <p className="text-sm text-white/70 bg-white/5 rounded-lg p-3">{selected.message}</p>
                </div>
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
                          ? statusColors[s] + " border-transparent"
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
          </div>
        </div>
      )}
    </div>
  );
}
