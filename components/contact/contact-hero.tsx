"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function ContactHero() {
  return (
    <section className="relative h-[45vh] min-h-[280px] max-h-[420px] flex flex-col overflow-hidden bg-black">
      <Image
        src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1920&q=85&auto=format&fit=crop"
        alt="Contact PixelRoot Studio"
        fill
        priority
        quality={90}
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: easeOut, delay: 0.12 }}
        className="relative z-10 mt-auto px-5 pb-10 sm:px-10 lg:px-16 max-w-[1200px] mx-auto w-full"
      >
        <span className="block text-[11px] font-semibold tracking-[0.22em] uppercase text-white/50 mb-3">
          Get in Touch
        </span>
        <h1 className="hero-headline text-[clamp(2rem,7vw,3.8rem)] font-bold text-white leading-[1.05] tracking-[-0.025em]">
          Let&apos;s Create<br className="sm:hidden" />{" "}
          <em className="not-italic text-amber-400">Together</em>
        </h1>
        <p className="mt-3 text-white/55 text-sm sm:text-base max-w-md leading-relaxed">
          Book a session, discuss a project, or ask anything — we respond within 24 hours.
        </p>
      </motion.div>
    </section>
  );
}
