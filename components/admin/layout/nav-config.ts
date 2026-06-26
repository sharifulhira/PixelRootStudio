export type NavItem = {
  href: string;
  label: string;
  icon: string;
  description?: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

/** Top-level dashboard link — not inside a collapsible group */
export const dashboardNavItem: NavItem = {
  href: "/admin",
  label: "Dashboard",
  icon: "dashboard",
};

/**
 * Admin sidebar groups — mirrors the public site structure:
 *
 * Business     → Leads (contact) & Bookings (packages) & pricing
 * Homepage     → Sections on the landing page (/)
 * Portfolio    → Case studies & work categories (/portfolio)
 * Pages        → Standalone site pages (/about, /team)
 * Settings     → Global SEO, social, site metadata
 */
export const adminNavGroups: NavGroup[] = [
  {
    title: "Business",
    items: [
      {
        href: "/admin/analytics",
        label: "Analytics",
        icon: "analytics",
        description: "Visitors, pages & traffic sources",
      },
      {
        href: "/admin/leads",
        label: "Leads",
        icon: "leads",
        description: "Contact form inquiries",
      },
      {
        href: "/admin/booking-calendar",
        label: "Booking Calendar",
        icon: "calendar",
        description: "Schedule view with filters",
      },
      {
        href: "/admin/invoices",
        label: "Invoices",
        icon: "invoices",
        description: "Billing & light accounting",
      },
      {
        href: "/admin/bookings",
        label: "Bookings",
        icon: "bookings",
        description: "Package booking requests",
      },
      {
        href: "/admin/packages",
        label: "Packages",
        icon: "packages",
        description: "Pricing & service packages",
      },
    ],
  },
  {
    title: "Homepage",
    items: [
      {
        href: "/admin/hero",
        label: "Hero & Video",
        icon: "hero",
        description: "Banner, headline, video highlight",
      },
      {
        href: "/admin/categories",
        label: "Categories",
        icon: "categories",
        description: "Explore-by-category slider",
      },
      {
        href: "/admin/clients",
        label: "Corporate Clients",
        icon: "clients",
        description: "Homepage logo marquee",
      },
      {
        href: "/admin/gallery",
        label: "Gallery Highlights",
        icon: "gallery",
        description: "Featured work on homepage",
      },
      {
        href: "/admin/gear",
        label: "Gear Showcase",
        icon: "gear",
        description: "Equipment section",
      },
    ],
  },
  {
    title: "Portfolio",
    items: [
      {
        href: "/admin/projects",
        label: "Projects",
        icon: "projects",
        description: "Portfolio case studies",
      },
    ],
  },
  {
    title: "Pages",
    items: [
      {
        href: "/admin/about",
        label: "About",
        icon: "about",
        description: "Photographer bio & contact",
      },
      {
        href: "/admin/team",
        label: "Team",
        icon: "team",
        description: "Team members page",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        href: "/admin/performance",
        label: "Site Health",
        icon: "performance",
        description: "SEO & performance audit",
      },
      {
        href: "/admin/seo",
        label: "Site Settings",
        icon: "seo",
        description: "Logo, favicon, SEO, social meta",
      },
    ],
  },
];

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getPageTitle(pathname: string): string {
  if (pathname === "/admin/projects/new") return "Add Project";
  if (/^\/admin\/projects\/[^/]+$/.test(pathname) && pathname !== "/admin/projects/new") {
    return "Edit Project";
  }
  if (pathname === "/admin/invoices/new") return "New Invoice";
  if (/^\/admin\/invoices\/[^/]+$/.test(pathname) && pathname !== "/admin/invoices/new") {
    return "Edit Invoice";
  }

  if (pathname === dashboardNavItem.href) return dashboardNavItem.label;

  for (const group of adminNavGroups) {
    for (const item of group.items) {
      if (isNavItemActive(pathname, item.href)) return item.label;
    }
  }
  return "Admin";
}

export function getPageGroup(pathname: string): string | null {
  if (pathname === dashboardNavItem.href) return null;

  for (const group of adminNavGroups) {
    for (const item of group.items) {
      if (isNavItemActive(pathname, item.href)) return group.title;
    }
  }
  return null;
}
