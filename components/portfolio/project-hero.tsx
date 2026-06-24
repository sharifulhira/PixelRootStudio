"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const easeOut = [0.22, 1, 0.36, 1] as const;

type Props = {
  title: string;
  coverImage: { src: string; alt: string };
  category: { name: string; slug: string };
  date?: string;
  client?: string;
};

export function ProjectHero({ title, coverImage, category, date, client: clientName }: Props) {
  return (
    <section className="relative min-h-[55vh] sm:min-h-[60vh] flex flex-col justify-end overflow-hidden bg-black">
      {/* Background */}
      <Image
        src={coverImage?.src || ""}
        alt={coverImage?.alt || title}
        fill
        priority
        quality={90}
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 px-5 sm:px-10 lg:px-16 pb-10 sm:pb-14 max-w-[1200px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="mb-4"
        >
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.16em] uppercase text-white/60 border border-white/15 rounded-full px-3.5 py-1 backdrop-blur-sm bg-white/[0.04]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            {category?.name || "Project"}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: easeOut, delay: 0.08 }}
          className="hero-headline text-[clamp(1.8rem,5.5vw,3.8rem)] font-bold text-white leading-[1.1] tracking-[-0.02em] mb-4 max-w-3xl"
        >
          {title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: easeOut, delay: 0.16 }}
          className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] font-semibold tracking-[0.12em] sm:tracking-[0.14em] uppercase text-white/45"
        >
          {date && (
            <span>
              {new Date(date).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          )}
          {clientName && (
            <>
              <span className="hidden sm:block w-px h-3.5 bg-white/20" />
              <span className="break-words">Client: {clientName}</span>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
