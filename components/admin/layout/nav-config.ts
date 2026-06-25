export type NavItem = {
  href: string;
  label: string;
  icon: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const adminNavGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: "dashboard" },
    ],
  },
  {
    title: "Bookings",
    items: [
      { href: "/admin/bookings", label: "Booking Requests", icon: "bookings" },
      { href: "/admin/packages", label: "Packages", icon: "packages" },
    ],
  },
  {
    title: "Homepage",
    items: [
      { href: "/admin/hero", label: "Hero Section", icon: "hero" },
      { href: "/admin/categories", label: "Categories", icon: "categories" },
      { href: "/admin/gallery", label: "Gallery", icon: "gallery" },
      { href: "/admin/gear", label: "Gear Showcase", icon: "gear" },
    ],
  },
  {
    title: "Portfolio",
    items: [
      { href: "/admin/projects", label: "Projects", icon: "projects" },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/about", label: "About Page", icon: "about" },
      { href: "/admin/team", label: "Team Members", icon: "team" },
    ],
  },
  {
    title: "Settings",
    items: [
      { href: "/admin/seo", label: "SEO & Social", icon: "seo" },
    ],
  },
];

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getPageTitle(pathname: string): string {
  for (const group of adminNavGroups) {
    for (const item of group.items) {
      if (isNavItemActive(pathname, item.href)) return item.label;
    }
  }
  return "Admin";
}
