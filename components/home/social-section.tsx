"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const easeOut = [0.22, 1, 0.36, 1] as const;

export type SocialLink = {
  id: string;
  label: string;
  url: string;
  handle?: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  links: SocialLink[];
};

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.127 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const platformIcons: Record<string, () => React.ReactNode> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
  linkedin: LinkedInIcon,
  twitter: XIcon,
};

export function SocialSection({
  title = "Follow Our Journey",
  subtitle = "Stay connected for behind-the-scenes content, latest work, and creative inspiration.",
  links,
}: Props) {
  if (!links.length) return null;

  return (
    <section className="py-16 sm:py-24 bg-[color:var(--bg)] border-t border-[color:var(--border)]">
      <div className="px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-[color:var(--primary)] mb-3">
            <span className="w-8 h-px bg-[color:var(--primary)]/40" />
            Social Media
            <span className="w-8 h-px bg-[color:var(--primary)]/40" />
          </span>
          <h2 className="hero-headline text-[clamp(1.6rem,4.5vw,2.6rem)] font-bold text-[color:var(--text)] leading-tight tracking-[-0.02em] mb-3">
            {title}
          </h2>
          <p className="text-sm sm:text-[15px] text-[color:var(--muted)] leading-relaxed max-w-xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Social Cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
          className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] overflow-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[color:var(--border)]">
            {links.map((link, i) => {
              const Icon = platformIcons[link.id];
              return (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: easeOut, delay: 0.05 * i }}
                >
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-5 sm:p-6 hover:bg-[color:var(--bg)] transition-colors duration-300"
                    aria-label={`Follow on ${link.label}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-[color:var(--bg)] border border-[color:var(--border)] flex items-center justify-center text-[color:var(--text)] group-hover:border-amber-500/40 group-hover:text-amber-400 transition-all duration-300 shrink-0">
                      {Icon ? <Icon /> : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[color:var(--text)] group-hover:text-amber-400 transition-colors">
                        {link.label}
                      </p>
                      {link.handle && (
                        <p className="text-xs text-[color:var(--muted)] truncate mt-0.5">{link.handle}</p>
                      )}
                    </div>
                    <svg
                      viewBox="0 0 12 12"
                      className="w-3.5 h-3.5 text-[color:var(--muted)] group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 10L10 2M10 2H4M10 2v6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Footer CTA */}
          <div className="px-5 sm:px-6 py-4 border-t border-[color:var(--border)] bg-[color:var(--bg)]/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[color:var(--muted)] text-center sm:text-left">
              {links.length} platform{links.length !== 1 ? "s" : ""} connected
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.1em] uppercase text-amber-500 hover:text-amber-400 transition-colors"
            >
              Work with us
              <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" aria-hidden="true">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
