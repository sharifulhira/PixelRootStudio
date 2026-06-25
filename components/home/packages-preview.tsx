"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const easeOut = [0.22, 1, 0.36, 1] as const;

type PackagePreview = {
  id: number;
  name: string;
  slug: string;
  category: string;
  shortDescription: string | null;
  price: number | null;
  priceLabel: string | null;
  currency: string | null;
  duration: string | null;
  popular: boolean | null;
  features: string[];
  imageSrc: string | null;
};

type Props = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  packages: PackagePreview[];
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

export function PackagesPreview({ title, subtitle, ctaLabel, ctaHref, packages }: Props) {
  if (!packages || packages.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-[color:var(--bg)] border-t border-[color:var(--border)]">
      <div className="px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10 sm:mb-14"
        >
          <div>
            <span className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-amber-500 mb-2">
              Investment
            </span>
            <h2 className="hero-headline text-[1.9rem] sm:text-[2.4rem] font-bold text-[color:var(--text)] leading-tight tracking-[-0.02em]">
              {title || "Our Packages"}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-[color:var(--muted)] max-w-md leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          <Link
            href={ctaHref || "/packages"}
            className="inline-flex items-center gap-2 self-start sm:self-auto text-sm font-semibold text-[color:var(--primary)] hover:opacity-70 transition-opacity shrink-0"
          >
            {ctaLabel || "View All Packages"}
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>

        {/* Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, ease: easeOut, delay: i * 0.1 }}
            >
              <Link
                href={`/packages/${pkg.slug}`}
                className={`group relative block rounded-2xl border overflow-hidden ${
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

                <div className="p-5 sm:p-6">
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[color:var(--primary)] mb-3 block">
                    {categoryLabels[pkg.category] || pkg.category}
                  </span>

                  <h3 className="hero-headline text-lg sm:text-xl font-bold text-[color:var(--text)] leading-tight mb-1.5 group-hover:text-amber-500 transition-colors duration-200">
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

                  {/* Duration */}
                  {pkg.duration && (
                    <div className="flex items-center gap-2 text-xs text-[color:var(--muted)] mb-4">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {pkg.duration}
                    </div>
                  )}

                  {/* Features */}
                  <ul className="space-y-1.5 mb-5">
                    {pkg.features.slice(0, 4).map((feature: string, fi: number) => (
                      <li key={fi} className="flex items-start gap-2 text-xs text-[color:var(--text)]">
                        <span className="mt-1 w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {pkg.features.length > 4 && (
                      <li className="text-[10px] text-[color:var(--muted)] pl-3">
                        + {pkg.features.length - 4} more included
                      </li>
                    )}
                  </ul>

                  {/* CTA */}
                  <div className={`flex items-center justify-center py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    pkg.popular
                      ? "bg-amber-500 text-black group-hover:bg-amber-400"
                      : "bg-[color:var(--bg)] border border-[color:var(--border)] text-[color:var(--text)] group-hover:border-amber-500/50 group-hover:text-amber-500"
                  }`}>
                    Book Now
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
