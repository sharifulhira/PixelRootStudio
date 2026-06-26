"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const easeOut = [0.22, 1, 0.36, 1] as const;

type Props = {
  packageId?: number;
  packageName?: string;
  onSuccess?: () => void;
};

export function BookingForm({ packageId, packageName, onSuccess }: Props) {
  const [form, setForm] = useState({
    clientName: "",
    email: "",
    phone: "",
    eventDate: "",
    eventType: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          packageId,
          packageName,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      setSuccess(true);
      setForm({ clientName: "", email: "", phone: "", eventDate: "", eventType: "", message: "" });
      onSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: easeOut }}
        className="text-center py-10"
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="hero-headline text-lg font-bold text-[color:var(--text)] mb-2">
          Booking Request Sent!
        </h3>
        <p className="text-xs text-[color:var(--muted)] leading-relaxed max-w-xs mx-auto">
          Thank you! We&apos;ll get back to you within 24 hours to confirm your booking.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-5 text-xs font-semibold text-amber-500 hover:text-amber-400 transition-colors"
        >
          Submit another request
        </button>
      </motion.div>
    );
  }

  const inputClass = "w-full px-3.5 py-2.5 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg)] text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)]/60 focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/50 outline-none transition-all duration-200";

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {packageName && packageName !== "Custom Inquiry" && (
        <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg px-3.5 py-2.5">
          <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-amber-500/70">Selected Package</p>
          <p className="text-sm font-semibold text-[color:var(--text)]">{packageName}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-[10px] font-semibold tracking-[0.1em] uppercase text-[color:var(--muted)] mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={form.clientName}
            onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            className={inputClass}
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold tracking-[0.1em] uppercase text-[color:var(--muted)] mb-1.5">
            Phone *
          </label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass}
            placeholder="+880 1XXX-XXXXXX"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-[10px] font-semibold tracking-[0.1em] uppercase text-[color:var(--muted)] mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
            placeholder="your@email.com (optional)"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold tracking-[0.1em] uppercase text-[color:var(--muted)] mb-1.5">
            Event Date
          </label>
          <input
            type="date"
            value={form.eventDate}
            onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-semibold tracking-[0.1em] uppercase text-[color:var(--muted)] mb-1.5">
          Event Type
        </label>
        <select
          value={form.eventType}
          onChange={(e) => setForm({ ...form, eventType: e.target.value })}
          className={inputClass}
        >
          <option value="">Select event type</option>
          <option value="wedding">Wedding</option>
          <option value="corporate">Corporate Event</option>
          <option value="fashion">Fashion Shoot</option>
          <option value="product">Product Photography</option>
          <option value="birthday">Birthday / Party</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-semibold tracking-[0.1em] uppercase text-[color:var(--muted)] mb-1.5">
          Tell us about your event
        </label>
        <textarea
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`${inputClass} resize-none`}
          placeholder="Details, requirements, or questions..."
        />
      </div>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-full bg-amber-500 text-black text-sm font-semibold hover:bg-amber-400 disabled:opacity-50 transition-colors duration-200"
      >
        {loading ? "Submitting..." : "Book Now"}
      </button>

      <p className="text-[10px] text-[color:var(--muted)] text-center leading-relaxed">
        We&apos;ll respond within 24 hours. No payment required at this stage.
      </p>
    </form>
  );
}
