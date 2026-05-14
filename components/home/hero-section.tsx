"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import heroData from "@/data/hero.json";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-black">
      {/* Background photo */}
      <Image
        src={heroData.image.src}
        alt={heroData.image.alt}
        fill
        priority
        quality={90}
        className="object-cover object-center scale-[1.02]"
        sizes="100vw"
      />

      {/* Cinematic gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/15 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/20 to-transparent pointer-events-none" />

      {/* Vertical services strip — desktop right edge */}
      <div className="absolute right-7 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-5 items-center">
        <div className="w-px h-14 bg-white/15" />
        {heroData.services.map((service) => (
          <span
            key={service}
            className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white/35 [writing-mode:vertical-rl] rotate-180"
          >
            {service}
          </span>
        ))}
        <div className="w-px h-14 bg-white/15" />
      </div>

      {/* Main content — positioned at bottom-left */}
      <div className="relative z-10 flex flex-col justify-end flex-1 px-5 pb-12 pt-20 sm:px-10 sm:pb-16 lg:px-16 lg:pb-20 w-full max-w-[1200px] mx-auto">

        {/* Badge */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mb-5"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-white/60 border border-white/15 rounded-full px-4 py-1.5 backdrop-blur-sm bg-white/[0.04]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            {heroData.badge}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="hero-headline text-[clamp(2.8rem,9vw,7.5rem)] font-bold text-white leading-[1.0] tracking-[-0.025em] mb-5"
        >
          {heroData.headline[0]}
          <br />
          <em className="not-italic text-amber-400">{heroData.headline[1]}</em>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-[0.95rem] sm:text-[1rem] text-white/55 max-w-[30rem] leading-[1.8] mb-8"
        >
          {heroData.subheadline}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-3 mb-10 sm:mb-12"
        >
          <Link
            href={heroData.cta.primary.href}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-yellow-500 text-black text-sm font-semibold tracking-wide hover:bg-yellow-600 text-black transition-all duration-300"
          >
            {heroData.cta.primary.label}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <Link
            href={heroData.cta.secondary.href}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/30 text-white text-sm font-medium tracking-wide hover:border-white/60 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
          >
            {heroData.cta.secondary.label}
          </Link>
        </motion.div>

        {/* Stats card */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <div className="grid grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md w-full max-w-sm sm:max-w-xs">
            {heroData.stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 py-4 px-2 sm:py-5 sm:px-4"
              >
                <span className="hero-headline text-2xl sm:text-3xl font-bold text-white leading-none">
                  {stat.value}
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.14em] uppercase text-white/45 text-center leading-tight mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Service pills — mobile / tablet only */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-2 mt-6 lg:hidden"
        >
          {heroData.services.map((service) => (
            <span
              key={service}
              className="text-[10px] font-semibold tracking-[0.12em] uppercase text-white/32 border border-white/10 rounded-full px-3.5 py-1 backdrop-blur-sm"
            >
              {service}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white/28">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-px h-6 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
