"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function TeamPageHero({
  eyebrow,
  title,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}) {
  return (
    <section className="relative overflow-hidden bg-black pt-20 sm:pt-24 pb-14 sm:pb-16">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,168,67,0.08),transparent_55%)]" />

      <div className="relative z-10 px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          {eyebrow && (
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-[color:var(--primary)]/90 mb-4">
            <span className="w-8 h-px bg-[color:var(--primary)]/40" />
            {eyebrow}
            <span className="w-8 h-px bg-[color:var(--primary)]/40" />
          </span>
          )}
          {title && (
          <h1 className="hero-headline text-[clamp(2rem,5vw,3.2rem)] font-bold text-white leading-tight tracking-[-0.02em] mb-4">
            {title}
          </h1>
          )}
          {subtitle && (
          <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-xl mx-auto">
            {subtitle}
          </p>
          )}
          {(primaryLabel || secondaryLabel) && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {primaryLabel && (
            <Link
              href={primaryHref || "/contact"}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[color:var(--primary)] hover:opacity-90 text-white text-sm font-semibold rounded-full transition-colors"
            >
              {primaryLabel}
            </Link>
            )}
            {secondaryLabel && (
            <Link
              href={secondaryHref || "/about"}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/20 hover:border-white/40 text-white/80 hover:text-white text-sm font-medium rounded-full transition-colors"
            >
              {secondaryLabel}
            </Link>
            )}
          </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
