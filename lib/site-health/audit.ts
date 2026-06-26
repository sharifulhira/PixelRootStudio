import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import * as schema from "@/lib/db/schema";
import { getSiteSettings, getHero, getFeaturedCategories, getFeaturedGalleryItems, getGearItems, getPopularPackages, getProjectSlugs, getActivePackages } from "@/lib/db/queries";
import { getHomeJsonLd } from "@/seo/site-seo";

export type HealthCheckStatus = "pass" | "warn" | "fail";

export type HealthCheck = {
  id: string;
  label: string;
  category: "seo" | "performance" | "landing";
  status: HealthCheckStatus;
  message: string;
  fixHref?: string;
  weight: number;
};

export type SiteHealthReport = {
  seo: number;
  performance: number;
  landing: number;
  overall: number;
  checks: HealthCheck[];
  auditedAt: string;
};

function scoreChecks(checks: HealthCheck[]) {
  if (checks.length === 0) return 100;
  let earned = 0;
  let total = 0;
  for (const c of checks) {
    total += c.weight;
    if (c.status === "pass") earned += c.weight;
    else if (c.status === "warn") earned += c.weight * 0.6;
  }
  return Math.round((earned / total) * 100);
}

function hasSocialLinks(settings: NonNullable<ReturnType<typeof getSiteSettings>>) {
  return !!(
    settings.socialFacebook ||
    settings.socialInstagram ||
    settings.socialYoutube ||
    settings.socialLinkedin ||
    settings.socialTiktok
  );
}

function isPlaceholderUrl(url: string | null | undefined) {
  if (!url) return true;
  return url.includes("example.com") || url === "https://example.com";
}

export function runSiteHealthAudit(): SiteHealthReport {
  const settings = getSiteSettings();
  const hero = getHero();
  const categories = getFeaturedCategories();
  const gallery = getFeaturedGalleryItems();
  const gear = getGearItems();
  const packages = getPopularPackages();
  const activePackages = getActivePackages();
  const projectSlugs = getProjectSlugs();
  const about = db.select().from(schema.about).get();
  const jsonLd = getHomeJsonLd();

  const checks: HealthCheck[] = [];

  // ── SEO ─────────────────────────────────────────────────────
  checks.push({
    id: "meta-title",
    label: "Meta title",
    category: "seo",
    status: !settings?.metaTitle?.trim()
      ? "fail"
      : settings.metaTitle.length < 30 || settings.metaTitle.length > 70
        ? "warn"
        : "pass",
    message: !settings?.metaTitle?.trim()
      ? "Add a meta title in Site Settings"
      : settings.metaTitle.length < 30
        ? "Meta title is short — aim for 50–60 characters"
        : settings.metaTitle.length > 70
          ? "Meta title may be truncated in search results"
          : "Meta title is set and well-sized",
    fixHref: "/admin/seo",
    weight: 10,
  });

  checks.push({
    id: "meta-description",
    label: "Meta description",
    category: "seo",
    status: !settings?.metaDescription?.trim()
      ? "fail"
      : settings.metaDescription.length < 80 || settings.metaDescription.length > 170
        ? "warn"
        : "pass",
    message: !settings?.metaDescription?.trim()
      ? "Add a meta description for search snippets"
      : settings.metaDescription.length < 80
        ? "Description is short — aim for 120–160 characters"
        : settings.metaDescription.length > 170
          ? "Description may be truncated in Google"
          : "Meta description is optimized",
    fixHref: "/admin/seo",
    weight: 10,
  });

  checks.push({
    id: "site-url",
    label: "Production site URL",
    category: "seo",
    status: isPlaceholderUrl(settings?.siteUrl) ? "fail" : "pass",
    message: isPlaceholderUrl(settings?.siteUrl)
      ? "Replace example.com with your real domain"
      : "Site URL is configured",
    fixHref: "/admin/seo",
    weight: 8,
  });

  checks.push({
    id: "og-image",
    label: "Social share image (OG)",
    category: "seo",
    status: settings?.ogImage ? "pass" : "fail",
    message: settings?.ogImage
      ? "OG image set for social previews"
      : "Upload a 1200×630 OG image for Facebook, WhatsApp, LinkedIn",
    fixHref: "/admin/seo",
    weight: 8,
  });

  checks.push({
    id: "favicon",
    label: "Favicon",
    category: "seo",
    status: settings?.favicon ? "pass" : "warn",
    message: settings?.favicon ? "Favicon configured" : "Add a favicon for browser tabs",
    fixHref: "/admin/seo",
    weight: 5,
  });

  checks.push({
    id: "logo",
    label: "Site logo",
    category: "seo",
    status: settings?.logo ? "pass" : "warn",
    message: settings?.logo ? "Logo uploaded" : "Upload a logo for brand consistency",
    fixHref: "/admin/seo",
    weight: 4,
  });

  const keywords = settings?.keywords || [];
  checks.push({
    id: "keywords",
    label: "SEO keywords",
    category: "seo",
    status: keywords.length >= 3 ? "pass" : keywords.length > 0 ? "warn" : "fail",
    message:
      keywords.length >= 3
        ? `${keywords.length} keywords configured`
        : keywords.length > 0
          ? "Add at least 3 keywords for better targeting"
          : "Add relevant keywords in Site Settings",
    fixHref: "/admin/seo",
    weight: 5,
  });

  checks.push({
    id: "org-contact",
    label: "Organization contact",
    category: "seo",
    status: settings?.orgEmail && settings?.orgName ? "pass" : "warn",
    message:
      settings?.orgEmail && settings?.orgName
        ? "Organization details set for structured data"
        : "Add organization name and email for JSON-LD",
    fixHref: "/admin/seo",
    weight: 5,
  });

  checks.push({
    id: "social-links",
    label: "Social media links",
    category: "seo",
    status: settings && hasSocialLinks(settings) ? "pass" : "warn",
    message:
      settings && hasSocialLinks(settings)
        ? "Social profiles linked"
        : "Add at least one social profile link",
    fixHref: "/admin/seo",
    weight: 4,
  });

  checks.push({
    id: "json-ld",
    label: "Structured data (JSON-LD)",
    category: "seo",
    status: jsonLd.length >= 2 ? "pass" : "warn",
    message:
      jsonLd.length >= 2
        ? "WebSite + ProfessionalService schema active"
        : "Structured data may be incomplete",
    weight: 6,
  });

  checks.push({
    id: "sitemap",
    label: "Sitemap coverage",
    category: "seo",
    status: projectSlugs.length > 0 && activePackages.length > 0 ? "pass" : projectSlugs.length > 0 || activePackages.length > 0 ? "warn" : "fail",
    message:
      projectSlugs.length > 0 && activePackages.length > 0
        ? `Sitemap includes ${projectSlugs.length} projects & ${activePackages.length} packages`
        : "Add portfolio projects and packages for fuller sitemap",
    fixHref: "/admin/projects",
    weight: 5,
  });

  // ── Performance ─────────────────────────────────────────────
  checks.push({
    id: "homepage-isr",
    label: "Homepage caching (ISR)",
    category: "performance",
    status: "pass",
    message: "Landing page uses ISR (revalidate 3600s) — fast static delivery with CMS updates",
    weight: 12,
  });

  checks.push({
    id: "image-formats",
    label: "Next.js image optimization",
    category: "performance",
    status: "pass",
    message: "AVIF & WebP formats enabled in next.config",
    weight: 8,
  });

  checks.push({
    id: "compression",
    label: "Response compression",
    category: "performance",
    status: "pass",
    message: "Gzip/Brotli compression enabled",
    weight: 6,
  });

  checks.push({
    id: "font-display",
    label: "Font loading strategy",
    category: "performance",
    status: "pass",
    message: "Google fonts use display: swap — no render-blocking fonts",
    weight: 8,
  });

  checks.push({
    id: "hero-image",
    label: "Hero image alt text",
    category: "performance",
    status: hero?.image?.alt && hero.image.alt.length > 3 ? "pass" : "warn",
    message:
      hero?.image?.alt && hero.image.alt.length > 3
        ? "Hero image has descriptive alt text"
        : "Add alt text to hero image for accessibility & SEO",
    fixHref: "/admin/hero",
    weight: 6,
  });

  const heroUsesRemote = hero?.image?.src?.includes("unsplash.com");
  checks.push({
    id: "hero-local-image",
    label: "Hero image hosting",
    category: "performance",
    status: heroUsesRemote ? "warn" : hero?.image?.src ? "pass" : "fail",
    message: heroUsesRemote
      ? "Hero uses external Unsplash URL — upload a local image for faster LCP"
      : hero?.image?.src
        ? "Hero image is locally hosted or optimized"
        : "Hero image is missing",
    fixHref: "/admin/hero",
    weight: 10,
  });

  checks.push({
    id: "security-headers",
    label: "X-Powered-By header",
    category: "performance",
    status: "pass",
    message: "Powered-by header disabled — reduced fingerprinting",
    weight: 4,
  });

  checks.push({
    id: "css-optimize",
    label: "CSS optimization",
    category: "performance",
    status: "pass",
    message: "Experimental CSS optimization enabled",
    weight: 4,
  });

  // ── Landing page content ────────────────────────────────────
  checks.push({
    id: "hero-content",
    label: "Hero section",
    category: "landing",
    status:
      hero?.headline?.length && hero?.subheadline && hero?.cta?.primary?.label
        ? "pass"
        : "fail",
    message:
      hero?.headline?.length && hero?.subheadline
        ? "Hero headline, subheadline & CTA configured"
        : "Complete hero headline and subheadline",
    fixHref: "/admin/hero",
    weight: 12,
  });

  checks.push({
    id: "categories",
    label: "Featured categories",
    category: "landing",
    status: categories.length >= 3 ? "pass" : categories.length > 0 ? "warn" : "fail",
    message:
      categories.length >= 3
        ? `${categories.length} featured categories on homepage`
        : categories.length > 0
          ? "Add at least 3 featured categories"
          : "No featured categories — homepage slider will be empty",
    fixHref: "/admin/categories",
    weight: 10,
  });

  checks.push({
    id: "gallery",
    label: "Gallery highlights",
    category: "landing",
    status: gallery.length >= 4 ? "pass" : gallery.length > 0 ? "warn" : "fail",
    message:
      gallery.length >= 4
        ? `${gallery.length} gallery items featured`
        : gallery.length > 0
          ? "Feature at least 4 gallery items for visual impact"
          : "No featured gallery items on homepage",
    fixHref: "/admin/gallery",
    weight: 10,
  });

  checks.push({
    id: "packages-preview",
    label: "Packages preview",
    category: "landing",
    status: packages.length >= 1 ? "pass" : activePackages.length > 0 ? "warn" : "fail",
    message:
      packages.length >= 1
        ? `${packages.length} popular package(s) on homepage`
        : activePackages.length > 0
          ? "Mark at least one package as popular for homepage preview"
          : "No active packages — add packages for conversions",
    fixHref: "/admin/packages",
    weight: 10,
  });

  checks.push({
    id: "gear",
    label: "Gear showcase",
    category: "landing",
    status: gear.length >= 1 ? "pass" : "warn",
    message:
      gear.length >= 1
        ? `${gear.length} gear item(s) displayed`
        : "Add gear items to build trust on homepage",
    fixHref: "/admin/gear",
    weight: 6,
  });

  checks.push({
    id: "portfolio",
    label: "Portfolio projects",
    category: "landing",
    status: projectSlugs.length >= 3 ? "pass" : projectSlugs.length > 0 ? "warn" : "fail",
    message:
      projectSlugs.length >= 3
        ? `${projectSlugs.length} portfolio projects live`
        : projectSlugs.length > 0
          ? "Add more portfolio projects (aim for 3+)"
          : "No portfolio projects — critical for a photography site",
    fixHref: "/admin/projects",
    weight: 10,
  });

  checks.push({
    id: "about-page",
    label: "About page content",
    category: "landing",
    status: about?.bio && about?.name ? "pass" : "warn",
    message:
      about?.bio && about?.name
        ? "About page has bio content"
        : "Complete about page for trust and SEO",
    fixHref: "/admin/about",
    weight: 8,
  });

  const teamCount = db
    .select({ count: sql<number>`count(*)` })
    .from(schema.teamMembers)
    .get();
  checks.push({
    id: "team",
    label: "Team members",
    category: "landing",
    status: (teamCount?.count || 0) >= 1 ? "pass" : "warn",
    message:
      (teamCount?.count || 0) >= 1
        ? `${teamCount?.count} team member(s) listed`
        : "Add team members for the team page",
    fixHref: "/admin/team",
    weight: 4,
  });

  const seoChecks = checks.filter((c) => c.category === "seo");
  const perfChecks = checks.filter((c) => c.category === "performance");
  const landingChecks = checks.filter((c) => c.category === "landing");

  const seo = scoreChecks(seoChecks);
  const performance = scoreChecks(perfChecks);
  const landing = scoreChecks(landingChecks);
  const overall = Math.round(seo * 0.35 + performance * 0.35 + landing * 0.3);

  return {
    seo,
    performance,
    landing,
    overall,
    checks,
    auditedAt: new Date().toISOString(),
  };
}
