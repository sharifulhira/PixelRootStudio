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
 * Admin sidebar groups follow the public site:
 * Homepage, About page, Portfolio, Packages, then studio operations and settings.
 */
export const adminNavGroups: NavGroup[] = [
  {
    title: "Homepage",
    items: [
      {
        href: "/admin/hero",
        label: "Hero & Video",
        icon: "hero",
        description: "Top banner on the homepage",
      },
      {
        href: "/admin/categories",
        label: "Categories",
        icon: "categories",
        description: "Category slider on the homepage",
      },
      {
        href: "/admin/clients",
        label: "Corporate Clients",
        icon: "clients",
        description: "Logo marquee on the homepage",
      },
      {
        href: "/admin/gallery",
        label: "Gallery Highlights",
        icon: "gallery",
        description: "Featured work on the homepage",
      },
      {
        href: "/admin/gear",
        label: "Gear Showcase",
        icon: "gear",
        description: "Equipment section on the homepage",
      },
    ],
  },
  {
    title: "About page",
    items: [
      {
        href: "/admin/about/founder",
        label: "Founder",
        icon: "about",
        description: "Banner and portrait at the top of /about",
      },
      {
        href: "/admin/about/experience",
        label: "Experience",
        icon: "experience",
        description: "Bio, expertise, and journey on /about",
      },
      {
        href: "/admin/about/team",
        label: "Team",
        icon: "team",
        description: "People grid on /about and the Team page",
      },
      {
        href: "/admin/about/details",
        label: "Other details",
        icon: "details",
        description: "Stats, vision, closing band, and SEO",
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
        description: "Case studies on /portfolio",
      },
    ],
  },
  {
    title: "Packages",
    items: [
      {
        href: "/admin/packages",
        label: "Packages",
        icon: "packages",
        description: "Pricing on /packages and the homepage preview",
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        href: "/admin/analytics",
        label: "Analytics",
        icon: "analytics",
        description: "Visitors, pages, and traffic",
      },
      {
        href: "/admin/leads",
        label: "Leads",
        icon: "leads",
        description: "Messages from the contact form",
      },
      {
        href: "/admin/booking-calendar",
        label: "Booking Calendar",
        icon: "calendar",
        description: "Schedule of bookings",
      },
      {
        href: "/admin/bookings",
        label: "Bookings",
        icon: "bookings",
        description: "Package booking requests",
      },
      {
        href: "/admin/invoices",
        label: "Invoices",
        icon: "invoices",
        description: "Billing and payments",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        href: "/admin/contact",
        label: "Contact Settings",
        icon: "contact",
        description: "Footer, contact page, and social links",
      },
      {
        href: "/admin/performance",
        label: "Site Health",
        icon: "performance",
        description: "SEO and performance audit",
      },
      {
        href: "/admin/seo",
        label: "Site Settings",
        icon: "seo",
        description: "Site name, logo, favicon, and SEO",
      },
      {
        href: "/admin/tags",
        label: "SEO & Tags",
        icon: "tags",
        description: "Analytics, Search Console, and ad pixels",
      },
      {
        href: "/admin/backup",
        label: "Backup & Restore",
        icon: "backup",
        description: "Database and image backup",
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
