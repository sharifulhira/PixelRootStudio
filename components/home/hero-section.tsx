"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeOut, delay: 0.15 + i * 0.12 },
  }),
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

type HeroData = {
  badge?: string;
  headline?: string[];
  subheadline?: string;
  cta?: {
    primary?: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
  stats?: { value: string; label: string }[];
  services?: string[];
  image?: { src: string; alt: string; blurDataURL?: string };
  videoUrl?: string;
  backgroundVideo?: string;
};

function isDirectVideoUrl(url?: string): boolean {
  if (!url) return false;
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
  return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
}

export function HeroSection({ heroData }: { heroData: HeroData }) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-black"
    >
      {/* Background Media */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 scale-110"
      >
        {heroData?.backgroundVideo && isDirectVideoUrl(heroData.backgroundVideo) ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={heroData.backgroundVideo} type="video/mp4" />
          </video>
        ) : heroData?.image?.src ? (
          <Image
            src={heroData.image.src}
            alt={heroData.image.alt || "Hero background"}
            fill
            priority
            quality={90}
            placeholder={heroData.image.blurDataURL ? "blur" : "empty"}
            blurDataURL={heroData.image.blurDataURL}
            className="object-cover object-center"
            sizes="100vw"
          />
        ) : null}
      </motion.div>

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,transparent_0%,black_70%)] opacity-40 pointer-events-none" />
      
      {/* Grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vertical Services Strip — Desktop */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: easeOut, delay: 1 }}
        className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 items-center z-20"
      >
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-white/20" />
        {heroData?.services?.map((service: string) => (
          <span
            key={service}
            className="text-[9px] font-semibold tracking-[0.25em] uppercase text-white/25 [writing-mode:vertical-rl] rotate-180 hover:text-white/50 transition-colors cursor-default"
          >
            {service}
          </span>
        ))}
        <div className="w-px h-16 bg-gradient-to-b from-white/20 via-white/20 to-transparent" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex flex-col justify-end flex-1 px-5 pb-28 pt-24 sm:px-10 sm:pb-32 lg:px-16 lg:pb-28 w-full max-w-[1300px] mx-auto"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Badge */}
          {heroData?.badge && (
            <motion.div custom={0} variants={fadeUp}>
              <span className="inline-flex items-center gap-2.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-white/50 border border-white/10 rounded-full px-4 py-2 backdrop-blur-sm bg-white/[0.03] mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                </span>
                {heroData.badge}
              </span>
            </motion.div>
          )}

          {/* Headline */}
          <motion.h1
            custom={1}
            variants={fadeUp}
            className="hero-headline text-[clamp(2.5rem,8vw,6.5rem)] font-bold text-white leading-[0.95] tracking-[-0.03em] mb-6 max-w-4xl"
          >
            {heroData?.headline?.[0]}
            {heroData?.headline?.[1] && (
              <>
                <br />
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
                    {heroData.headline[1]}
                  </span>
                </span>
              </>
            )}
          </motion.h1>

          {/* Subheadline */}
          {heroData?.subheadline && (
            <motion.p
              custom={2}
              variants={fadeUp}
              className="text-[0.95rem] sm:text-[1.05rem] text-white/45 max-w-lg leading-[1.8] mb-10"
            >
              {heroData.subheadline}
            </motion.p>
          )}

          {/* CTA Buttons */}
          <motion.div
            custom={3}
            variants={fadeUp}
            className="flex flex-wrap gap-3 sm:gap-4 mb-12"
          >
            {heroData?.cta?.primary && (
              <Link
                href={heroData.cta.primary.href || "#"}
                className="group inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black text-sm font-semibold tracking-wide shadow-[0_0_40px_rgba(251,191,36,0.25)] hover:shadow-[0_0_60px_rgba(251,191,36,0.4)] transition-all duration-500"
              >
                {heroData.cta.primary.label}
                <svg 
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                  viewBox="0 0 16 16" 
                  fill="none"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            )}
            {heroData?.cta?.secondary && (
              <Link
                href={heroData.cta.secondary.href || "#"}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-white/20 text-white text-sm font-medium tracking-wide hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
              >
                {heroData.cta.secondary.label}
              </Link>
            )}
          </motion.div>

          {/* Stats */}
          {heroData?.stats && heroData.stats.length > 0 && (
            <motion.div custom={4} variants={fadeUp}>
              <div className="inline-flex divide-x divide-white/10 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden">
                {heroData.stats.map((stat: { value: string; label: string }) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center gap-1 py-5 px-5 sm:px-8"
                  >
                    <span className="hero-headline text-2xl sm:text-3xl font-bold text-white leading-none">
                      {stat.value}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.16em] uppercase text-white/40 text-center leading-tight">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Service Pills — Mobile */}
          {heroData?.services && heroData.services.length > 0 && (
            <motion.div
              custom={5}
              variants={fadeUp}
              className="flex flex-wrap gap-2 mt-8 lg:hidden"
            >
              {heroData.services.map((service: string) => (
                <span
                  key={service}
                  className="text-[10px] font-semibold tracking-[0.14em] uppercase text-white/25 border border-white/8 rounded-full px-3.5 py-1.5 backdrop-blur-sm bg-white/[0.02]"
                >
                  {service}
                </span>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-3 z-20"
      >
        <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-white/20">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-white/15 flex justify-center pt-1.5"
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1], scaleY: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-0.5 h-2 rounded-full bg-white/40"
          />
        </motion.div>
      </motion.div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l border-t border-white/5 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r border-b border-white/5 pointer-events-none" />
    </section>
  );
}
