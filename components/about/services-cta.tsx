"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import type { AboutCtaCopy } from "@/lib/about/page-copy";

export function ServicesCta({
  phone,
  email,
  cta,
}: {
  phone?: string;
  email?: string;
  cta: AboutCtaCopy;
}) {
  return (
    <section className="relative overflow-hidden bg-black pb-14 sm:pb-16">
      {/* Background */}
      {cta.image && (
      <Image
        src={cta.image}
        alt=""
        fill
        className="object-cover opacity-20"
        sizes="100vw"
        aria-hidden="true"
      />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      <div className="relative z-10 px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto pt-16 sm:pt-20">

        {/* Services pills */}
        {cta.services.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.55 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {cta.services.map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-white/50 border border-white/12 rounded-full px-4 py-1.5"
            >
              {label}
            </span>
          ))}
        </motion.div>
        )}

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="text-center max-w-2xl mx-auto"
        >
          {(cta.headline || cta.headlineAccent) && (
          <h2 className="hero-headline text-[2.2rem] sm:text-[3rem] lg:text-[3.8rem] font-bold text-white leading-[1.05] tracking-[-0.025em]">
            {cta.headline}
            {cta.headline && cta.headlineAccent && <br />}
            {cta.headlineAccent && (
              <em className="not-italic text-[color:var(--primary)]">{cta.headlineAccent}</em>
            )}
          </h2>
          )}
          {cta.subtext && (
          <p className="mt-5 text-white/50 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            {cta.subtext}
          </p>
          )}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
          className="flex flex-wrap justify-center gap-3 mt-9"
        >
          {cta.primaryLabel && (
          <Link
            href={cta.primaryHref || "/contact"}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[color:var(--primary)] text-white text-sm font-semibold tracking-wide hover:opacity-90 hover:text-white transition-colors duration-300"
          >
            {cta.primaryLabel}
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          )}
          {cta.secondaryLabel && (
          <Link
            href={cta.secondaryHref || "/portfolio"}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/25 text-white text-sm font-medium tracking-wide hover:border-white/55 hover:bg-white/8 transition-all duration-300"
          >
            {cta.secondaryLabel}
          </Link>
          )}
        </motion.div>

        {(phone || email) && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8"
        >
          {phone && (
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors duration-200"
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
              <path d="M13.5 10.5c0 .3-.1.7-.2 1-.1.3-.3.6-.6.8-.5.5-1 .7-1.6.7-.4 0-.8-.1-1.2-.3C8.5 12 7.1 11.1 5.9 9.9 4.7 8.7 3.8 7.3 3.1 5.8c-.2-.4-.3-.8-.3-1.2 0-.6.2-1.1.6-1.5.2-.2.5-.4.8-.6.2-.1.5-.2.8-.2.1 0 .2 0 .4.1.1.1.3.2.4.4l1.2 1.7c.1.1.2.3.2.5 0 .2.1.3.1.5 0 .2 0 .3-.1.5-.1.2-.2.3-.3.4l-.5.5c0 .1-.1.1-.1.2s0 .2.1.3c.3.5.6.9.9 1.3.4.4.8.7 1.3.9.1 0 .2.1.3.1.1 0 .2-.1.2-.1l.5-.5c.1-.2.3-.3.4-.3.2-.1.3-.1.5-.1.2 0 .3 0 .5.1.2.1.3.1.5.2l1.7 1.1c.2.1.3.2.4.4.1.1.1.3.1.4z" stroke="currentColor" strokeWidth="0.9" />
            </svg>
            {phone}
          </a>
          )}
          {phone && email && <span className="hidden sm:block w-px h-4 bg-white/15" aria-hidden="true" />}
          {email && (
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors duration-200"
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
              <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="0.9" />
              <path d="M2 5.5l6 4.5 6-4.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
            </svg>
            {email}
          </a>
          )}
        </motion.div>
        )}
      </div>
    </section>
  );
}
