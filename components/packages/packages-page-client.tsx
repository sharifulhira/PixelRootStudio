"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const easeOut = [0.22, 1, 0.36, 1] as const;

type PackageData = {
  id: number;
  name: string;
  slug: string;
  category: string;
  shortDescription: string | null;
  description: string | null;
  features: string[];
  price: number | null;
  priceLabel: string | null;
  currency: string | null;
  duration: string | null;
  deliverables: string | null;
  popular: boolean | null;
  imageSrc: string | null;
};

type Props = {
  packages: PackageData[];
  categories: string[];
};

const categoryLabels: Record<string, string> = {
  wedding: "Wedding",
  corporate: "Corporate",
  fashion: "Fashion",
  product: "Product",
  event: "Events",
};

function formatPrice(price: number | null, currency: string | null) {
  if (!price) return "Contact Us";
  const c = currency || "BDT";
  if (c === "BDT") return `৳${price.toLocaleString()}`;
  return `$${price.toLocaleString()}`;
}

export function PackagesPageClient({ packages, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered =
    activeCategory === "all"
      ? packages
      : packages.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[color:var(--bg)]">
      {/* Hero Section — Cinematic Dark */}
      <section className="relative py-28 sm:py-36 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,168,67,0.06)_0%,transparent_60%)] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            <span className="inline-flex items-center gap-2.5 text-[10px] font-semibold tracking-[0.2em] uppercase text-amber-400/70 mb-5">
              <span className="w-8 h-px bg-amber-400/30" />
              Investment
              <span className="w-8 h-px bg-amber-400/30" />
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
            className="hero-headline text-[clamp(2.2rem,6vw,4.5rem)] font-bold text-white leading-[0.95] tracking-[-0.03em] mb-5"
          >
            Photography Packages
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.2 }}
            className="text-sm sm:text-[15px] text-white/45 leading-relaxed max-w-xl mx-auto"
          >
            Premium photography services tailored to capture your most important moments with cinematic excellence.
          </motion.p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 border-b border-[color:var(--border)] sticky top-0 z-20 bg-[color:var(--bg)]/95 backdrop-blur-md">
        <div className="px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                activeCategory === "all"
                  ? "bg-amber-500 text-black"
                  : "border border-[color:var(--border)] text-[color:var(--muted)] hover:text-[color:var(--text)] hover:border-[color:var(--text)]/30"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-amber-500 text-black"
                    : "border border-[color:var(--border)] text-[color:var(--muted)] hover:text-[color:var(--text)] hover:border-[color:var(--text)]/30"
                }`}
              >
                {categoryLabels[cat] || cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-14 sm:py-20">
        <div className="px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: easeOut, delay: i * 0.08 }}
              >
                <Link
                  href={`/packages/${pkg.slug}`}
                  className={`group relative block rounded-2xl border overflow-hidden h-full ${
                    pkg.popular
                      ? "border-amber-500/30"
                      : "border-[color:var(--border)]"
                  } bg-[color:var(--surface)] hover:border-amber-500/30 transition-colors duration-300`}
                >
                  {pkg.popular && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.15em] uppercase bg-amber-500 text-black px-2.5 py-1 rounded-full">
                        Popular
                      </span>
                    </div>
                  )}

                  {/* Cover Image */}
                  {pkg.imageSrc && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={pkg.imageSrc}
                        alt={pkg.name}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                  )}

                  <div className="p-5 sm:p-6 flex flex-col h-full">
                    <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[color:var(--primary)] mb-3 block">
                      {categoryLabels[pkg.category] || pkg.category}
                    </span>

                    <h3 className="hero-headline text-xl font-bold text-[color:var(--text)] leading-tight mb-1.5 group-hover:text-amber-500 transition-colors duration-200">
                      {pkg.name}
                    </h3>

                    {pkg.shortDescription && (
                      <p className="text-xs text-[color:var(--muted)] leading-relaxed mb-4">
                        {pkg.shortDescription}
                      </p>
                    )}

                    {/* Price */}
                    <div className="mb-4">
                      {pkg.priceLabel && (
                        <span className="text-[10px] text-[color:var(--muted)] uppercase tracking-wider">{pkg.priceLabel}</span>
                      )}
                      <div className="text-2xl font-bold text-[color:var(--text)] tracking-tight">
                        {formatPrice(pkg.price, pkg.currency)}
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      {pkg.duration && (
                        <span className="flex items-center gap-1.5 text-[10px] text-[color:var(--muted)]">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {pkg.duration}
                        </span>
                      )}
                      {pkg.deliverables && (
                        <span className="flex items-center gap-1.5 text-[10px] text-[color:var(--muted)]">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                          </svg>
                          {pkg.deliverables}
                        </span>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-1.5 mb-6 flex-1">
                      {pkg.features.slice(0, 5).map((feature: string, fi: number) => (
                        <li key={fi} className="flex items-start gap-2 text-xs text-[color:var(--text)]">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {pkg.features.length > 5 && (
                        <li className="text-[10px] text-[color:var(--muted)] pl-3">
                          + {pkg.features.length - 5} more included
                        </li>
                      )}
                    </ul>

                    {/* CTA */}
                    <div className={`flex items-center justify-center py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                      pkg.popular
                        ? "bg-amber-500 text-black group-hover:bg-amber-400"
                        : "bg-[color:var(--bg)] border border-[color:var(--border)] text-[color:var(--text)] group-hover:border-amber-500/50 group-hover:text-amber-500"
                    }`}>
                      Book This Package
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[color:var(--muted)] text-sm">No packages found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Custom Quote CTA */}
      <section className="relative py-20 sm:py-28 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(212,168,67,0.05)_0%,transparent_60%)] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
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
              Custom Solutions
              <span className="w-8 h-px bg-amber-400/30" />
            </span>

            <h2 className="hero-headline text-[clamp(1.8rem,5vw,3rem)] font-bold text-white leading-tight tracking-[-0.02em] mb-4">
              Need a Custom Package?
            </h2>
            <p className="text-sm sm:text-[15px] text-white/45 leading-relaxed max-w-lg mx-auto mb-8">
              Every project is unique. Let&apos;s discuss your specific requirements and create a tailored solution.
            </p>

            <Link
              href="/packages/custom-inquiry"
              className="inline-flex items-center gap-2.5 px-7 py-3 bg-amber-500 text-black text-sm font-semibold rounded-full hover:bg-amber-400 transition-colors duration-200"
            >
              Get Custom Quote
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
