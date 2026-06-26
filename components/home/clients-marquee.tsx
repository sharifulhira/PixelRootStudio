"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";

export type ClientLogo = {
  id: number;
  name: string;
  logoSrc: string;
  websiteUrl?: string;
};

type Props = {
  title: string;
  subtitle?: string;
  clients: ClientLogo[];
};

function ClientLogoCard({ client }: { client: ClientLogo }) {
  const inner = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={client.logoSrc}
        alt={client.name}
        className="h-8 sm:h-10 w-auto max-w-[140px] sm:max-w-[180px] object-contain object-center grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
        loading="lazy"
        draggable={false}
      />
      <span className="sr-only">{client.name}</span>
    </>
  );

  if (client.websiteUrl) {
    return (
      <a
        href={client.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex shrink-0 items-center justify-center px-6 sm:px-10"
        title={client.name}
      >
        {inner}
      </a>
    );
  }

  return (
    <div className="group flex shrink-0 items-center justify-center px-6 sm:px-10" title={client.name}>
      {inner}
    </div>
  );
}

/** Repeat logos so each strip is wide enough for a seamless loop on large screens. */
function expandForMarquee(clients: ClientLogo[], minItems = 12) {
  if (clients.length >= minItems) return clients;
  const expanded: ClientLogo[] = [];
  while (expanded.length < minItems) {
    expanded.push(...clients);
  }
  return expanded;
}

export function ClientsMarquee({ title, subtitle, clients }: Props) {
  if (!clients.length) return null;

  const strip = expandForMarquee(clients);
  const duration = Math.max(28, strip.length * 3.5);

  return (
    <section className="py-12 sm:py-16 bg-[#0a0a0a] border-y border-white/[0.06] overflow-hidden">
      <div className="px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto mb-8 sm:mb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-amber-400/80 mb-2">
            Our Clients
          </span>
          <h2 className="hero-headline text-[1.6rem] sm:text-[2rem] font-bold text-white leading-tight tracking-[-0.02em]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm sm:text-base text-white/45 mt-3 max-w-xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />

        <div
          className="clients-marquee-track flex w-max flex-nowrap items-center"
          style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
        >
          {[0, 1].map((group) => (
            <div
              key={group}
              className="clients-marquee-group flex shrink-0 flex-nowrap items-center"
              aria-hidden={group === 1}
            >
              {strip.map((client, index) => (
                <ClientLogoCard key={`${group}-${client.id}-${index}`} client={client} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
