"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
};

export function ProjectGallery({ gallery }: { gallery: GalleryImage[] }) {
  if (!gallery || gallery.length === 0) return null;

  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(() => setActive((i) => (i === null ? null : (i - 1 + gallery.length) % gallery.length)), [gallery.length]);
  const next = useCallback(() => setActive((i) => (i === null ? null : (i + 1) % gallery.length)), [gallery.length]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, prev, next]);

  useEffect(() => {
    document.body.style.overflow = active !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [active]);

  const item = active !== null ? gallery[active] : null;

  return (
    <section className="py-12 sm:py-16 bg-[color:var(--surface)] border-t border-[color:var(--border)]">
      <div className="px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <span className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-[color:var(--primary)] mb-2">
            Gallery
          </span>
          <h2 className="hero-headline text-[1.6rem] sm:text-[2rem] font-bold text-[color:var(--text)] leading-tight tracking-[-0.02em]">
            Project Photos
          </h2>
        </div>

        {/* Grid */}
        <div className="gallery-masonry">
          {gallery.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: (i % 4) * 0.06 }}
              className="gallery-item group"
            >
              <button
                type="button"
                onClick={() => setActive(i)}
                className="relative block w-full overflow-hidden rounded-xl cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]"
                aria-label={`View photo: ${img.alt}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt || ""}
                  width={img.width || 800}
                  height={img.height || 600}
                  className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] rounded-xl"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 rounded-xl" />

                {/* Expand icon */}
                <div className="absolute top-3 right-3 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <svg viewBox="0 0 14 14" className="w-3.5 h-3.5 text-white" fill="none" aria-hidden="true">
                      <path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </button>

              {img.caption && (
                <p className="text-[11px] text-[color:var(--muted)] mt-2 text-center">{img.caption}</p>
              )}
            </motion.div>
          ))}
        </div>
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
            <button
              onClick={close}
              aria-label="Close lightbox"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[11px] font-semibold tracking-[0.18em] uppercase text-white/35 select-none">
              {active + 1} &nbsp;/&nbsp; {gallery.length}
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next image"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

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
                src={item.src}
                alt={item.alt || ""}
                width={item.width || 1200}
                height={item.height || 800}
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
              {item.caption && (
                <p className="mt-4 text-[13px] text-white/40 text-center">{item.caption}</p>
              )}
            </motion.div>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5" aria-hidden="true">
              {gallery.map((_, idx) => (
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
