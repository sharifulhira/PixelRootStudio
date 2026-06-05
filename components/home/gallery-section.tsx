"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
// import galleryData from "@/data/gallery.json";

const ASPECT: Record<string, string> = {
  portrait:  "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square:    "aspect-square",
};

export function GallerySection({ galleryData }: { galleryData: any[] }) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev  = useCallback(() => setActive(i => i === null ? null : (i - 1 + galleryData.length) % galleryData.length), []);
  const next  = useCallback(() => setActive(i => i === null ? null : (i + 1) % galleryData.length), []);

  /* Keyboard navigation */
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")      close();
      if (e.key === "ArrowLeft")   prev();
      if (e.key === "ArrowRight")  next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, prev, next]);

  /* Lock body scroll while lightbox is open */
  useEffect(() => {
    document.body.style.overflow = active !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [active]);

  const item = active !== null ? galleryData[active] : null;

  return (
    <section className="py-14 sm:py-20 bg-[color:var(--bg)]">
      {/* ── Header ── */}
      <div className="px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto mb-10 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5"
        >
          <div>
            <span className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-[color:var(--primary)] mb-2">
              Selected Work
            </span>
            <h2 className="hero-headline text-[1.9rem] sm:text-[2.4rem] font-bold text-[color:var(--text)] leading-tight tracking-[-0.02em]">
              Highlights
            </h2>
            <p className="mt-2 text-sm text-[color:var(--muted)] max-w-xs leading-relaxed">
              A curated selection across every discipline I cover.
            </p>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 self-start sm:self-auto text-sm font-semibold text-[color:var(--primary)] hover:opacity-70 transition-opacity shrink-0"
          >
            View full portfolio
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* ── Masonry grid ── */}
      <div className="px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="gallery-masonry"
        >
          {galleryData.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: (i % 4) * 0.07 }}
              className="gallery-item group"
            >
              <button
                type="button"
                onClick={() => setActive(i)}
                className="relative block w-full overflow-hidden rounded-xl cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]"
                aria-label={`Open lightbox: ${g.alt}`}
              >
                <div className={`relative ${ASPECT[g.aspect] ?? "aspect-square"}`}>
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {/* Tint */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-300" />
                  {/* Category pill */}
                  <div className="absolute bottom-3 left-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase text-white bg-black/55 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1">
                      <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                      {g.category}
                    </span>
                  </div>
                  {/* Expand icon */}
                  <div className="absolute top-3 right-3 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                    <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <svg viewBox="0 0 14 14" className="w-3.5 h-3.5 text-white" fill="none" aria-hidden="true">
                        <path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Mobile CTA ── */}
      <div className="mt-10 px-5 flex justify-center sm:hidden">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[color:var(--border)] text-sm font-semibold text-[color:var(--text)] hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] transition-colors duration-200"
        >
          View full portfolio
          <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {item && active !== null && (
          <motion.div
            key="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={close}
          >
            {/* ── Close ── */}
            <button
              onClick={close}
              aria-label="Close lightbox"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            {/* ── Counter ── */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[11px] font-semibold tracking-[0.18em] uppercase text-white/35 select-none">
              {active + 1} &nbsp;/&nbsp; {galleryData.length}
            </div>

            {/* ── Prev arrow ── */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* ── Next arrow ── */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next image"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* ── Image + caption ── */}
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.93 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center px-16 sm:px-20 max-w-full"
            >
              <Image
                src={item.src.replace("w=800", "w=1600").replace("q=85", "q=90")}
                alt={item.alt}
                width={1200}
                height={1600}
                priority
                className="rounded-xl shadow-2xl block"
                style={{
                  maxHeight: "80vh",
                  maxWidth: "min(88vw, 900px)",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                }}
              />

              {/* Caption bar */}
              <div className="mt-4 flex items-center gap-3 flex-wrap justify-center">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase text-white/50 border border-white/12 rounded-full px-3 py-1">
                  <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                  {item.category}
                </span>
                <span className="text-[13px] text-white/35 text-center leading-snug max-w-sm">
                  {item.alt}
                </span>
              </div>
            </motion.div>

            {/* ── Dot indicators ── */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5" aria-hidden="true">
              {galleryData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setActive(idx); }}
                  className={`h-1 rounded-full transition-all duration-300 ${idx === active ? "w-5 bg-white" : "w-1 bg-white/25 hover:bg-white/50"}`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
