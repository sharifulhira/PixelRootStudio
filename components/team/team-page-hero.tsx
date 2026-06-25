"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function TeamPageHero() {
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
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-amber-400/90 mb-4">
            <span className="w-8 h-px bg-amber-400/40" />
            Our Team
            <span className="w-8 h-px bg-amber-400/40" />
          </span>
          <h1 className="hero-headline text-[clamp(2rem,5vw,3.2rem)] font-bold text-white leading-tight tracking-[-0.02em] mb-4">
            Meet the Creatives
          </h1>
          <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-xl mx-auto">
            The passionate professionals behind PixelRoot Studio — united by craft, vision, and an uncompromising standard of quality.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-semibold rounded-full transition-colors"
            >
              Work With Us
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/20 hover:border-white/40 text-white/80 hover:text-white text-sm font-medium rounded-full transition-colors"
            >
              About the Studio
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
