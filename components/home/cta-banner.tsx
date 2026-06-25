"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const easeOut = [0.22, 1, 0.36, 1] as const;

type Props = {
  headline?: string;
  subtext?: string;
  ctaLabel?: string;
  ctaHref?: string;
  variant?: "dark" | "light";
};

export function CtaBanner({
  headline = "Ready to Create Something Beautiful?",
  subtext = "Let's discuss your vision and bring it to life with stunning visuals.",
  ctaLabel = "Book Your Session",
  ctaHref = "/packages",
  variant = "dark",
}: Props) {
  if (variant === "dark") {
    return (
      <section className="relative py-20 sm:py-28 bg-black overflow-hidden">
        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,67,0.04)_0%,transparent_70%)] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-amber-400/70 mb-5">
              <span className="w-8 h-px bg-amber-400/30" />
              Let&apos;s Work Together
              <span className="w-8 h-px bg-amber-400/30" />
            </span>

            <h2 className="hero-headline text-[clamp(1.8rem,5vw,3rem)] font-bold text-white leading-tight tracking-[-0.02em] mb-4">
              {headline}
            </h2>
            <p className="text-sm sm:text-[15px] text-white/50 leading-relaxed max-w-lg mx-auto mb-8">
              {subtext}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2.5 px-7 py-3 bg-amber-500 text-black text-sm font-semibold rounded-full hover:bg-amber-400 transition-colors duration-200"
              >
                {ctaLabel}
                <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/packages/custom-inquiry"
                className="text-sm font-medium text-white/40 hover:text-white/70 transition-colors"
              >
                Or get a custom quote →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 bg-[color:var(--surface)] border-t border-b border-[color:var(--border)]">
      <div className="px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-[color:var(--primary)] mb-4">
            <span className="w-8 h-px bg-[color:var(--primary)]/40" />
            Get Started
            <span className="w-8 h-px bg-[color:var(--primary)]/40" />
          </span>

          <h2 className="hero-headline text-[clamp(1.6rem,4.5vw,2.6rem)] font-bold text-[color:var(--text)] leading-tight tracking-[-0.02em] mb-3">
            {headline}
          </h2>
          <p className="text-sm sm:text-[15px] text-[color:var(--muted)] leading-relaxed max-w-lg mx-auto mb-7">
            {subtext}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2.5 px-7 py-3 bg-[color:var(--primary)] text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity duration-200"
            >
              {ctaLabel}
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/packages/custom-inquiry"
              className="text-sm font-medium text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors"
            >
              Or get a custom quote →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
