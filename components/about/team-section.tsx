"use client";

import { motion } from "framer-motion";
import Image from "next/image";
// import teamData from "@/data/team.json";

export function TeamSection({
  teamData,
  showHeader = true,
  badge = "Our Team",
  title = "The People Behind\nEvery Great Shot",
  subtitle = "A tight-knit team of creatives united by one goal — delivering visuals that exceed every expectation.",
}: {
  teamData: any[];
  showHeader?: boolean;
  badge?: string;
  title?: string;
  subtitle?: string;
}) {
  if (!teamData?.length) return null;

  const titleLines = title.split("\n");

  return (
    <section className="py-16 sm:py-20 bg-[color:var(--surface)] border-b border-[color:var(--border)]">
      <div className="px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto">

        {/* Header */}
        {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 sm:mb-14"
        >
          <span className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-[color:var(--primary)] mb-2">
            {badge}
          </span>
          <h2 className="hero-headline text-[1.9rem] sm:text-[2.4rem] font-bold text-[color:var(--text)] leading-tight tracking-[-0.02em]">
            {titleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < titleLines.length - 1 && <br className="hidden sm:block" />}
              </span>
            ))}
          </h2>
          <p className="mt-3 text-sm text-[color:var(--muted)] max-w-md leading-relaxed">
            {subtitle}
          </p>
        </motion.div>
        )}

        {/* Team grid */}
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
          {teamData.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.09 }}
              className="group"
            >
              {/* Photo */}
              <div className={`relative aspect-square rounded-2xl overflow-hidden mb-4 ${member.isFounder ? "ring-2 ring-amber-400/40 ring-offset-2 ring-offset-[color:var(--surface)]" : ""}`}>
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 16vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />

                {/* Founder badge */}
                {member.isFounder && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-[0.16em] uppercase text-black bg-amber-400 rounded-full px-2.5 py-1">
                      Founder
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <h3 className="text-sm sm:text-[0.95rem] font-bold text-[color:var(--text)] leading-tight">
                  {member.name}
                </h3>
                <p className="text-[11px] sm:text-xs font-semibold tracking-[0.1em] uppercase text-[color:var(--primary)] mt-0.5 mb-2">
                  {member.role}
                </p>
                <p className="text-[11px] sm:text-xs text-[color:var(--muted)] leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
