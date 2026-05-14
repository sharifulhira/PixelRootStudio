"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const SERVICES = [
  { icon: "📸", label: "Fashion & Editorial" },
  { icon: "💍", label: "Weddings" },
  { icon: "🏢", label: "Corporate Events" },
  { icon: "📦", label: "Commercial Product" },
  { icon: "🎬", label: "Cinematic Video" },
  { icon: "🙋", label: "Model Portfolios" },
];

export function ServicesCta() {
  return (
    <section className="relative overflow-hidden bg-black pb-28 sm:pb-24">
      {/* Background */}
      <Image
        src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80&auto=format&fit=crop"
        alt=""
        fill
        className="object-cover opacity-20"
        sizes="100vw"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      <div className="relative z-10 px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto pt-16 sm:pt-20">

        {/* Services pills */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.55 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {SERVICES.map((s) => (
            <span
              key={s.label}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-white/50 border border-white/12 rounded-full px-4 py-1.5"
            >
              {s.label}
            </span>
          ))}
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="hero-headline text-[2.2rem] sm:text-[3rem] lg:text-[3.8rem] font-bold text-white leading-[1.05] tracking-[-0.025em]">
            Ready to Create<br />
            <em className="not-italic text-amber-400">Something Extraordinary?</em>
          </h2>
          <p className="mt-5 text-white/50 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Whether it&apos;s a once-in-a-lifetime wedding, a brand campaign, or a personal portfolio — let&apos;s build visuals that last forever.
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
          className="flex flex-wrap justify-center gap-3 mt-9"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-amber-500 text-black text-sm font-semibold tracking-wide hover:bg-amber-900 hover:text-black transition-colors duration-300"
          >
            Book a Session
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/25 text-white text-sm font-medium tracking-wide hover:border-white/55 hover:bg-white/8 transition-all duration-300"
          >
            View Portfolio
          </Link>
        </motion.div>

        {/* Divider + contact snippet */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8"
        >
          <a
            href="tel:+8801731722808"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors duration-200"
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
              <path d="M13.5 10.5c0 .3-.1.7-.2 1-.1.3-.3.6-.6.8-.5.5-1 .7-1.6.7-.4 0-.8-.1-1.2-.3C8.5 12 7.1 11.1 5.9 9.9 4.7 8.7 3.8 7.3 3.1 5.8c-.2-.4-.3-.8-.3-1.2 0-.6.2-1.1.6-1.5.2-.2.5-.4.8-.6.2-.1.5-.2.8-.2.1 0 .2 0 .4.1.1.1.3.2.4.4l1.2 1.7c.1.1.2.3.2.5 0 .2.1.3.1.5 0 .2 0 .3-.1.5-.1.2-.2.3-.3.4l-.5.5c0 .1-.1.1-.1.2s0 .2.1.3c.3.5.6.9.9 1.3.4.4.8.7 1.3.9.1 0 .2.1.3.1.1 0 .2-.1.2-.1l.5-.5c.1-.2.3-.3.4-.3.2-.1.3-.1.5-.1.2 0 .3 0 .5.1.2.1.3.1.5.2l1.7 1.1c.2.1.3.2.4.4.1.1.1.3.1.4z" stroke="currentColor" strokeWidth="0.9" />
            </svg>
            +880 1731-722808
          </a>
          <span className="hidden sm:block w-px h-4 bg-white/15" aria-hidden="true" />
          <a
            href="mailto:sharifulhira@gmail.com"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors duration-200"
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
              <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="0.9" />
              <path d="M2 5.5l6 4.5 6-4.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
            </svg>
            sharifulhira@gmail.com
          </a>
        </motion.div>
      </div>
    </section>
  );
}
