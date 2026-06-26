import Link from "next/link";
import Image from "next/image";
import { getSiteSeo, getAbout, getSocialSection } from "@/lib/db/queries";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

function SocialIcon({ id }: { id: string }) {
  const className = "w-4 h-4";
  switch (id) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.127 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    default:
      return null;
  }
}

export function SiteFooter() {
  const siteSeo = getSiteSeo();
  const about = getAbout();
  const social = getSocialSection();

  const email = about?.contact?.emails?.[0] || siteSeo.organization?.email;
  const phone = about?.contact?.phones?.[0] || siteSeo.organization?.telephone;
  const tagline = about?.tagline || siteSeo.description;
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-[color:var(--border)] bg-[color:var(--surface)]">
      {/* Subtle top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      <div className="px-5 sm:px-10 lg:px-16 max-w-[1400px] mx-auto pt-12 sm:pt-16 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px)+2rem)] sm:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block group">
              {siteSeo.logo ? (
                <Image
                  src={siteSeo.logo}
                  alt={siteSeo.siteName}
                  width={160}
                  height={48}
                  className="h-8 sm:h-9 w-auto object-contain object-left"
                />
              ) : (
                <h2 className="hero-headline text-xl sm:text-2xl font-bold text-[color:var(--text)] tracking-tight group-hover:text-amber-500 transition-colors">
                  {siteSeo.siteName}
                </h2>
              )}
            </Link>
            {tagline && (
              <p className="mt-3 text-sm text-[color:var(--muted)] leading-relaxed max-w-sm">
                {tagline}
              </p>
            )}
            <p className="mt-4 text-[10px] font-semibold tracking-[0.15em] uppercase text-amber-500/80">
              Uncompromising Quality
            </p>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[color:var(--muted)] mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[color:var(--text)] hover:text-amber-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[color:var(--muted)] mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-2.5 text-sm text-[color:var(--text)] hover:text-amber-500 transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-full bg-[color:var(--bg)] border border-[color:var(--border)] flex items-center justify-center text-[color:var(--muted)] group-hover:border-amber-500/30 group-hover:text-amber-500 transition-all shrink-0">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M5 8.5A2.5 2.5 0 0 1 7.5 6h9A2.5 2.5 0 0 1 19 8.5v7a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 15.5v-7z" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="m6 8 6 4.5L18 8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="truncate">{email}</span>
                  </a>
                </li>
              )}
              {phone && (
                <li>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2.5 text-sm text-[color:var(--text)] hover:text-amber-500 transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-full bg-[color:var(--bg)] border border-[color:var(--border)] flex items-center justify-center text-[color:var(--muted)] group-hover:border-amber-500/30 group-hover:text-amber-500 transition-all shrink-0">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M6.5 4h3l1.5 5-2 1.5a11 11 0 0 0 5 5L17.5 13.5 22.5 15v3a2 2 0 0 1-2.2 2 17 17 0 0 1-15.3-15.3A2 2 0 0 1 6.5 4z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>{phone}</span>
                  </a>
                </li>
              )}
              <li>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.08em] uppercase text-amber-500 hover:text-amber-400 transition-colors mt-1"
                >
                  Get in touch
                  <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" aria-hidden="true">
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="lg:col-span-3">
            <h3 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[color:var(--muted)] mb-4">
              Follow Us
            </h3>
            {social?.links.length ? (
              <div className="flex flex-wrap gap-2">
                {social.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow on ${link.label}`}
                    className="w-10 h-10 rounded-full bg-[color:var(--bg)] border border-[color:var(--border)] flex items-center justify-center text-[color:var(--muted)] hover:border-amber-500/40 hover:text-amber-500 hover:bg-amber-500/5 transition-all duration-300"
                  >
                    <SocialIcon id={link.id} />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[color:var(--muted)]">Connect with us on social media.</p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[color:var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[color:var(--muted)] text-center sm:text-left">
            © {year} {siteSeo.siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-[color:var(--muted)]">
            <span className="hidden sm:inline text-[color:var(--border)]">|</span>
            <span className="text-[10px] font-medium tracking-[0.12em] uppercase">
              Photography · Video · Events
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
