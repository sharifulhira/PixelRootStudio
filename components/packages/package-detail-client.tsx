"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BookingForm } from "./booking-form";

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
  pkg: PackageData | null;
  relatedPackages?: PackageData[];
  isCustomInquiry?: boolean;
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

export function PackageDetailClient({ pkg, relatedPackages = [], isCustomInquiry }: Props) {
  if (isCustomInquiry) {
    return (
      <div className="min-h-screen bg-[color:var(--bg)]">
        {/* Hero */}
        <section className="relative py-24 sm:py-32 bg-black overflow-hidden">
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
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-amber-400/70 mb-5">
                <span className="w-8 h-px bg-amber-400/30" />
                Custom Solutions
                <span className="w-8 h-px bg-amber-400/30" />
              </span>
              <h1 className="hero-headline text-[clamp(2rem,5vw,3.5rem)] font-bold text-white leading-[0.95] tracking-[-0.03em] mb-4">
                Custom Quote
              </h1>
              <p className="text-sm sm:text-[15px] text-white/45 leading-relaxed max-w-lg mx-auto">
                Tell us about your project and we&apos;ll create a tailored package just for you.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <div className="px-5 sm:px-10 lg:px-16 max-w-2xl mx-auto">
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 sm:p-8">
              <BookingForm packageName="Custom Inquiry" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!pkg) return null;

  return (
    <div className="min-h-screen bg-[color:var(--bg)]">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 bg-black overflow-hidden">
        {/* Background Image */}
        {pkg.imageSrc && (
          <Image
            src={pkg.imageSrc}
            alt={pkg.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
          >
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.1em] uppercase text-white/30 hover:text-white/60 transition-colors mb-8"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              All Packages
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-amber-400/70">
                {categoryLabels[pkg.category] || pkg.category}
              </span>
              {pkg.popular && (
                <span className="inline-flex items-center text-[9px] font-bold tracking-[0.15em] uppercase bg-amber-500 text-black px-2.5 py-0.5 rounded-full">
                  Popular
                </span>
              )}
            </div>

            <h1 className="hero-headline text-[clamp(2rem,6vw,4rem)] font-bold text-white leading-[0.95] tracking-[-0.03em] mb-4">
              {pkg.name}
            </h1>

            {pkg.shortDescription && (
              <p className="text-sm sm:text-[15px] text-white/45 leading-relaxed max-w-2xl">
                {pkg.shortDescription}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-14 sm:py-20">
        <div className="px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
            {/* Left: Details */}
            <div className="lg:col-span-3 space-y-10">
              {/* Price & Meta */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}
                className="flex flex-wrap items-end gap-6 pb-8 border-b border-[color:var(--border)]"
              >
                <div>
                  {pkg.priceLabel && (
                    <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[color:var(--muted)]">{pkg.priceLabel}</span>
                  )}
                  <div className="text-3xl sm:text-4xl font-bold text-[color:var(--text)] tracking-tight">
                    {formatPrice(pkg.price, pkg.currency)}
                  </div>
                </div>
                {pkg.duration && (
                  <div className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {pkg.duration}
                  </div>
                )}
                {pkg.deliverables && (
                  <div className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {pkg.deliverables}
                  </div>
                )}
              </motion.div>

              {/* Description */}
              {pkg.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: easeOut, delay: 0.25 }}
                >
                  <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[color:var(--primary)] mb-3">
                    About This Package
                  </h2>
                  <p className="text-sm text-[color:var(--muted)] leading-relaxed">{pkg.description}</p>
                </motion.div>
              )}

              {/* Features */}
              {pkg.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: easeOut, delay: 0.3 }}
                >
                  <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[color:var(--primary)] mb-4">
                    What&apos;s Included
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {pkg.features.map((feature: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-[color:var(--surface)] border border-[color:var(--border)]"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="text-sm text-[color:var(--text)]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right: Booking Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: easeOut, delay: 0.35 }}
                className="sticky top-24 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 sm:p-7"
              >
                <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[color:var(--primary)] mb-5">
                  Book This Package
                </h3>
                <BookingForm packageId={pkg.id} packageName={pkg.name} />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Packages */}
      {relatedPackages.length > 0 && (
        <section className="py-14 border-t border-[color:var(--border)]">
          <div className="px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto">
            <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[color:var(--primary)] mb-6">
              Similar Packages
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPackages.map((rPkg) => (
                <Link
                  key={rPkg.id}
                  href={`/packages/${rPkg.slug}`}
                  className="group flex flex-col p-5 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] hover:border-amber-500/30 transition-colors duration-300"
                >
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[color:var(--primary)]">
                    {categoryLabels[rPkg.category] || rPkg.category}
                  </span>
                  <h3 className="hero-headline text-lg font-bold text-[color:var(--text)] mt-1 group-hover:text-amber-500 transition-colors">
                    {rPkg.name}
                  </h3>
                  <p className="text-xs text-[color:var(--muted)] mt-1">{rPkg.shortDescription}</p>
                  <div className="text-xl font-bold text-[color:var(--text)] tracking-tight mt-3">
                    {formatPrice(rPkg.price, rPkg.currency)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
