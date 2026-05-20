"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import aboutData from "@/data/about.json";

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.65, ease: easeOut, delay },
});

export function AboutIntro() {
  return (
    <>
      {/* ── Banner ── */}
      <section className="relative h-[58vh] min-h-[320px] max-h-[520px] flex flex-col overflow-hidden bg-black">
        <Image
          src={aboutData.bannerImage}
          alt="Photographer at work — Hira Photography"
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.15 }}
          className="relative z-10 mt-auto px-5 pb-10 sm:px-10 lg:px-16 max-w-[1200px] mx-auto w-full"
        >
          <span className="block text-[11px] font-semibold tracking-[0.22em] uppercase text-white/50 mb-3">
            About the Studio
          </span>
          <h1 className="hero-headline text-[2.6rem] sm:text-[3.5rem] lg:text-[4.5rem] font-bold text-white leading-[1.0] tracking-[-0.025em]">
            Behind the Lens
          </h1>
          <p className="mt-3 text-white/55 text-sm sm:text-base max-w-sm">
            {aboutData.tagline}
          </p>
        </motion.div>
      </section>

      {/* ── Bio ── */}
      <section className="py-16 sm:py-20 bg-[color:var(--surface)] border-b border-[color:var(--border)]">
        <div className="px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 lg:gap-16 items-start">

            {/* Portrait */}
            <motion.div {...fadeUp(0)} className="lg:sticky lg:top-8">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden max-w-sm mx-auto lg:max-w-none">
                <Image
                  src={aboutData.photo}
                  alt={aboutData.name}
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 80vw, 380px"
                />
                {/* Founder badge */}
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] uppercase text-white bg-black/55 backdrop-blur-sm border border-amber-400/30 rounded-full px-4 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Founder
                  </span>
                </div>
              </div>

              {/* Contact chips */}
              <div className="mt-5 flex flex-wrap gap-2">
                {aboutData.contact.phones.map((p) => (
                  <a
                    key={p}
                    href={`tel:${p.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[color:var(--muted)] border border-[color:var(--border)] rounded-full px-3 py-1.5 hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] transition-colors duration-200"
                  >
                    <svg viewBox="0 0 14 14" className="w-3 h-3" fill="none" aria-hidden="true">
                      <path d="M12 9.5c0 .3-.1.6-.2.9-.1.3-.3.5-.5.7-.4.4-.8.6-1.3.6-.3 0-.7-.1-1-.2-1.2-.5-2.3-1.2-3.3-2.2C4.7 8.3 4 7.2 3.5 6c-.1-.3-.2-.6-.2-1 0-.4.2-.9.5-1.2.2-.2.4-.4.7-.5.2-.1.5-.2.7-.2.1 0 .2 0 .3.1.1 0 .2.1.3.3l1 1.5c.1.1.1.3.2.4 0 .1.1.3.1.4 0 .1 0 .3-.1.4-.1.1-.1.2-.3.3l-.4.4c0 .1-.1.1-.1.2 0 .1 0 .1.1.2.2.4.4.7.7 1 .3.3.6.6 1 .7.1 0 .2.1.2.1.1 0 .1 0 .2-.1l.4-.4c.1-.1.2-.2.3-.2.1-.1.3-.1.4-.1.1 0 .3 0 .4.1.1 0 .3.1.4.2l1.5 1c.2.1.3.2.3.3.1.1.1.2.1.3z" stroke="currentColor" strokeWidth="0.8" fill="none" />
                    </svg>
                    {p}
                  </a>
                ))}
                {aboutData.contact.emails.slice(0, 1).map((e) => (
                  <a
                    key={e}
                    href={`mailto:${e}`}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[color:var(--muted)] border border-[color:var(--border)] rounded-full px-3 py-1.5 hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] transition-colors duration-200"
                  >
                    <svg viewBox="0 0 14 14" className="w-3 h-3" fill="none" aria-hidden="true">
                      <rect x="1.5" y="3" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="0.9" />
                      <path d="M1.5 4.5l5.5 4 5.5-4" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
                    </svg>
                    {e}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Bio text */}
            <div>
              <motion.div {...fadeUp(0.08)}>
                <span className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-[color:var(--primary)] mb-3">
                  The Photographer
                </span>
                <h2 className="hero-headline text-[1.8rem] sm:text-[2.2rem] font-bold text-[color:var(--text)] leading-tight tracking-[-0.02em] mb-1">
                  {aboutData.name}
                </h2>
                <p className="text-[color:var(--muted)] text-sm font-medium mb-7">
                  {aboutData.title}
                </p>
              </motion.div>

              {aboutData.bio.map((para, i) => (
                <motion.p
                  key={i}
                  {...fadeUp(0.1 + i * 0.07)}
                  className="text-[color:var(--text)] text-[0.95rem] leading-[1.85] mb-4 opacity-85"
                >
                  {para}
                </motion.p>
              ))}

              {/* Skills */}
              <motion.div {...fadeUp(0.32)} className="mt-8">
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[color:var(--muted)] mb-3">
                  Expertise
                </p>
                <div className="flex flex-wrap gap-2">
                  {aboutData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] font-medium text-[color:var(--text)] border border-[color:var(--border)] rounded-full px-3 py-1.5 bg-[color:var(--bg)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Experience timeline */}
              <motion.div {...fadeUp(0.38)} className="mt-10">
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[color:var(--muted)] mb-4">
                  Professional Journey
                </p>
                <div className="flex flex-col gap-3">
                  {aboutData.experience.map((exp) => (
                    <div
                      key={exp.company}
                      className="flex items-start gap-3 py-3 border-b border-[color:var(--border)] last:border-0"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[color:var(--text)] leading-tight">
                          {exp.role}
                        </p>
                        <p className="text-[12px] text-[color:var(--muted)] mt-0.5">
                          {exp.company}
                        </p>
                      </div>
                      <span className="text-[11px] text-[color:var(--muted)] shrink-0 pt-0.5">
                        {exp.period}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="py-12 bg-[color:var(--bg)] border-b border-[color:var(--border)]">
        <div className="px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto">
          <motion.div
            {...fadeUp(0)}
            className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[color:var(--border)] rounded-2xl overflow-hidden"
          >
            {aboutData.stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center gap-1 py-8 px-4 bg-[color:var(--surface)]"
              >
                <span className="hero-headline text-[2.4rem] sm:text-[3rem] font-bold text-[color:var(--text)] leading-none">
                  {stat.value}
                </span>
                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[color:var(--muted)] text-center">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Vision ── */}
      <section className="py-16 sm:py-20 bg-black overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <Image
            src={aboutData.bannerImage}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            aria-hidden="true"
          />
        </div>
        <div className="relative z-10 px-5 sm:px-10 lg:px-16 max-w-[900px] mx-auto text-center">
          <motion.div {...fadeUp(0)}>
            <span className="block text-[11px] font-semibold tracking-[0.22em] uppercase text-amber-400/80 mb-6">
              My Vision
            </span>
            <blockquote className="hero-headline text-[1.5rem] sm:text-[2rem] lg:text-[2.4rem] font-bold text-white leading-[1.3] tracking-[-0.01em]">
              &ldquo;{aboutData.vision}&rdquo;
            </blockquote>
            <p className="mt-6 text-white/40 text-sm font-medium">
              — {aboutData.shortName}, Founder of Hira Photography
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
