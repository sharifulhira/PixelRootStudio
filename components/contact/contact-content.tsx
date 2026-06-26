"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.6, ease: easeOut, delay },
});

type ContactInfo = {
  phones?: string[];
  emails?: string[];
};

const SERVICES = [
  "Fashion & Editorial",
  "Weddings",
  "Corporate Events",
  "Commercial Product",
  "Cinematic Video",
  "Model Portfolios",
];

export function ContactContent({ contact }: { contact: ContactInfo }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const primaryEmail = contact.emails?.[0] || "sharifulhira@gmail.com";
  const phones = contact.phones?.length ? contact.phones : ["+880 1731-722808"];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitted(true);
      setForm({ name: "", phone: "", email: "", service: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-14 sm:py-20 bg-[color:var(--bg)]">
      <div className="px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-start">

          {/* Contact info */}
          <motion.div {...fadeUp(0)}>
            <span className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-[color:var(--primary)] mb-2">
              Contact Details
            </span>
            <h2 className="hero-headline text-[1.6rem] sm:text-[2rem] font-bold text-[color:var(--text)] leading-tight tracking-[-0.02em] mb-4">
              Reach Out Directly
            </h2>
            <p className="text-sm text-[color:var(--muted)] leading-relaxed mb-8 max-w-md">
              Prefer a quick call or email? Use any of the channels below — we&apos;re happy to discuss your vision before you book.
            </p>

            <div className="flex flex-col gap-4">
              {phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5 hover:border-[color:var(--primary)]/40 transition-colors duration-200 group"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[color:var(--primary)]/10 text-[color:var(--primary)]">
                    <svg viewBox="0 0 16 16" className="h-5 w-5" fill="none" aria-hidden="true">
                      <path d="M13.5 10.5c0 .3-.1.7-.2 1-.1.3-.3.6-.6.8-.5.5-1 .7-1.6.7-.4 0-.8-.1-1.2-.3C8.5 12 7.1 11.1 5.9 9.9 4.7 8.7 3.8 7.3 3.1 5.8c-.2-.4-.3-.8-.3-1.2 0-.6.2-1.1.6-1.5.2-.2.5-.4.8-.6.2-.1.5-.2.8-.2.1 0 .2 0 .4.1.1.1.3.2.4.4l1.2 1.7c.1.1.2.3.2.5 0 .2.1.3.1.5 0 .2 0 .3-.1.5-.1.2-.2.3-.3.4l-.5.5c0 .1-.1.1-.1.2s0 .2.1.3c.3.5.6.9.9 1.3.4.4.8.7 1.3.9.1 0 .2.1.3.1.1 0 .2-.1.2-.1l.5-.5c.1-.2.3-.3.4-.3.2-.1.3-.1.5-.1.2 0 .3 0 .5.1.2.1.3.1.5.2l1.7 1.1c.2.1.3.2.4.4.1.1.1.3.1.4z" stroke="currentColor" strokeWidth="0.9" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[color:var(--muted)] mb-0.5">Phone</p>
                    <p className="text-sm sm:text-base font-semibold text-[color:var(--text)] group-hover:text-[color:var(--primary)] transition-colors truncate">
                      {phone}
                    </p>
                  </div>
                </a>
              ))}

              {(contact.emails || [primaryEmail]).map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="flex items-center gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5 hover:border-[color:var(--primary)]/40 transition-colors duration-200 group"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[color:var(--primary)]/10 text-[color:var(--primary)]">
                    <svg viewBox="0 0 16 16" className="h-5 w-5" fill="none" aria-hidden="true">
                      <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="0.9" />
                      <path d="M2 5.5l6 4.5 6-4.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[color:var(--muted)] mb-0.5">Email</p>
                    <p className="text-sm sm:text-base font-semibold text-[color:var(--text)] group-hover:text-[color:var(--primary)] transition-colors break-all">
                      {email}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[color:var(--muted)] mb-3">
                Services
              </p>
              <div className="flex flex-wrap gap-2">
                {SERVICES.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] font-medium text-[color:var(--text)] border border-[color:var(--border)] rounded-full px-3 py-1.5 bg-[color:var(--surface)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div {...fadeUp(0.1)}>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-8">
              <h3 className="hero-headline text-xl sm:text-2xl font-bold text-[color:var(--text)] mb-1">
                Send a Message
              </h3>
              <p className="text-sm text-[color:var(--muted)] mb-6">
                Fill in the form and we&apos;ll get back to you as soon as possible.
              </p>

              {submitted ? (
                <div className="rounded-xl border border-[color:var(--primary)]/25 bg-[color:var(--primary)]/5 p-6 text-center">
                  <p className="text-sm font-semibold text-[color:var(--text)] mb-1">Message sent!</p>
                  <p className="text-xs text-[color:var(--muted)]">
                    Thank you for reaching out. We&apos;ll review your inquiry and respond soon.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-xs text-[color:var(--primary)] underline underline-offset-2"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {error && (
                    <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-3 text-xs text-red-600 dark:text-red-400">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[color:var(--muted)]">
                        Name *
                      </span>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--bg)] px-4 py-3 text-sm text-[color:var(--text)] outline-none focus:border-[color:var(--primary)] transition-colors"
                        placeholder="Your name"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[color:var(--muted)]">
                        Phone *
                      </span>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--bg)] px-4 py-3 text-sm text-[color:var(--text)] outline-none focus:border-[color:var(--primary)] transition-colors"
                        placeholder="+880 1XXX-XXXXXX"
                      />
                    </label>
                  </div>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[color:var(--muted)]">
                      Email
                    </span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--bg)] px-4 py-3 text-sm text-[color:var(--text)] outline-none focus:border-[color:var(--primary)] transition-colors"
                      placeholder="you@email.com (optional)"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[color:var(--muted)]">
                      Service Type
                    </span>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--bg)] px-4 py-3 text-sm text-[color:var(--text)] outline-none focus:border-[color:var(--primary)] transition-colors"
                    >
                      <option value="">Select a service (optional)</option>
                      {SERVICES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[color:var(--muted)]">
                      Message *
                    </span>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full resize-y min-h-[120px] rounded-xl border border-[color:var(--border)] bg-[color:var(--bg)] px-4 py-3 text-sm text-[color:var(--text)] outline-none focus:border-[color:var(--primary)] transition-colors"
                      placeholder="Tell us about your project, date, location, and vision…"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-full bg-[color:var(--primary)] text-white text-sm font-semibold tracking-wide hover:opacity-90 disabled:opacity-60 transition-opacity duration-200 mt-1"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
