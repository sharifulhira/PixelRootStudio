"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

type NavItem = {
  href: string;
  label: string;
  icon: (isActive: boolean) => React.ReactNode;
};

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: (isActive) => (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1v-8.5z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={isActive ? "currentColor" : "none"}
        />
      </svg>
    ),
  },
  {
    href: "/about",
    label: "About",
    icon: () => (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <circle cx="12" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M5 20a7 7 0 0 1 14 0"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/portfolio",
    label: "Portfolio",
    icon: () => (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M4 8.5A2.5 2.5 0 0 1 6.5 6h11A2.5 2.5 0 0 1 20 8.5v9A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-9z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M9 6V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/contact",
    label: "Contact",
    icon: () => (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M5 8.5A2.5 2.5 0 0 1 7.5 6h9A2.5 2.5 0 0 1 19 8.5v7a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 15.5v-7z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="m6 8 6 4.5L18 8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function FloatingNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:bottom-6"
      aria-label="Primary navigation"
    >
      <motion.ul
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto relative flex w-full max-w-md items-center justify-between gap-1 rounded-full border border-[color:var(--nav-border)] bg-[color:var(--nav-bg)] px-2 py-1.5 shadow-[0_20px_45px_-24px_rgba(11,58,117,0.62),inset_0_1px_0_var(--nav-highlight)] backdrop-blur-xl"
      >
        {navItems.map((item) => {
          const active = isNavItemActive(pathname, item.href);

          return (
            <li key={item.href} className="relative flex-1">
              <Link
                href={item.href}
                className="group relative flex h-12 w-full flex-col items-center justify-center rounded-full text-[color:var(--nav-text)] transition-colors duration-300 hover:text-[color:var(--primary)]"
                aria-current={active ? "page" : undefined}
              >
                {active && (
                  <motion.span
                    layoutId="floating-nav-active-pill"
                    className="absolute inset-0 rounded-full border border-[color:var(--nav-active-border)] bg-[color:var(--nav-active-bg)] shadow-[0_8px_18px_-10px_var(--primary-shadow)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                  />
                )}

                <motion.span
                  whileHover={{ y: -1.5, scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="relative z-10 flex flex-col items-center gap-0.5"
                >
                  <span className={active ? "text-[color:var(--primary)]" : ""}>
                    {item.icon(active)}
                  </span>
                  <span
                    className={`text-[0.62rem] font-medium leading-none tracking-[0.01em] ${
                      active ? "text-[color:var(--primary)]" : "text-[color:var(--nav-text)]"
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.span>
              </Link>
            </li>
          );
        })}
      </motion.ul>
    </nav>
  );
}
