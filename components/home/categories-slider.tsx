"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
// import categoriesData from "@/data/categories.json";

import "swiper/swiper.css";

// 3× ensures loop has enough originals for the largest slidesPerView breakpoint (5.4 → needs ≥12)
export function CategoriesSlider({ categoriesData }: { categoriesData: any[] }) {
  const items = categoriesData ?? [];
  const loopSlides = items.length ? [...items, ...items, ...items] : [];
  const swiperRef = useRef<SwiperClass | null>(null);

  if (!items.length) return null;

  return (
    <section className="py-14 sm:py-20 bg-[color:var(--surface)] border-t border-[color:var(--border)]">
      {/* ── Section header ── */}
      <div className="px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto mb-8 sm:mb-10">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-end justify-between gap-4"
        >
          <div>
            <span className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-[color:var(--primary)] mb-2">
              What I Shoot
            </span>
            <h2 className="hero-headline text-[1.9rem] sm:text-[2.4rem] font-bold text-[color:var(--text)] leading-tight tracking-[-0.02em]">
              Explore by Category
            </h2>
          </div>

          {/* Arrow controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous category"
              className="w-10 h-10 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text)] flex items-center justify-center hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] transition-colors duration-200"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next category"
              className="w-10 h-10 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text)] flex items-center justify-center hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] transition-colors duration-200"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── Swiper ── */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
      >
        <Swiper
          modules={[Autoplay]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          /*
           * Fixed slidesPerView per breakpoint lets Swiper correctly
           * compute clone counts for seamless infinite loop.
           */
          slidesPerView={1.5}
          centeredSlides={true}
          loop={true}
          spaceBetween={14}
          grabCursor={true}
          autoplay={{
            delay: 2600,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            480:  { slidesPerView: 2.3, spaceBetween: 16 },
            640:  { slidesPerView: 2.8, spaceBetween: 18 },
            900:  { slidesPerView: 3.8, spaceBetween: 20 },
            1200: { slidesPerView: 4.6, spaceBetween: 20 },
            1440: { slidesPerView: 5.4, spaceBetween: 20 },
          }}
          className="w-full !pb-2"
        >
          {loopSlides.map((cat, i) => {
            const imageSrc = typeof cat.image === "string" ? cat.image : cat.image?.src || "";
            const categorySlug = cat.slug || cat.href?.replace(/^\/?portfolio\?cat=/, "") || cat.id;

            return (
            <SwiperSlide key={`${cat.id ?? categorySlug}-${i}`}>
              <Link
                href={`/portfolio?cat=${categorySlug}`}
                className="relative block rounded-2xl overflow-hidden group"
                aria-label={`View ${cat.name} portfolio`}
              >
                {/* 3:4 portrait aspect */}
                <div className="aspect-[3/4] relative">
                  <Image
                    src={imageSrc}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07]"
                    sizes="(max-width: 480px) 55vw, (max-width: 900px) 38vw, (max-width: 1200px) 28vw, 22vw"
                  />

                  {/* Cinematic gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/20 to-black/5 transition-opacity duration-300 group-hover:from-black/92" />

                  {/* Hover arrow badge */}
                  <div className="absolute top-3 right-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <svg viewBox="0 0 12 12" className="w-3 h-3 text-white" fill="none" aria-hidden="true">
                        <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  {/* Category label */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-[10px] font-medium tracking-[0.14em] uppercase text-white/50 mb-0.5">
                      {cat.description}
                    </p>
                    <h3 className="hero-headline text-lg sm:text-xl font-bold text-white leading-tight">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
            );
          })}
        </Swiper>
      </motion.div>
    </section>
  );
}
