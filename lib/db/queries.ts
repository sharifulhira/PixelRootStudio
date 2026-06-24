import { db } from "./index";
import { eq } from "drizzle-orm";
import * as schema from "./schema";

// ─────────────────────────────────────────────────────────────
// Site Settings
// ─────────────────────────────────────────────────────────────
export function getSiteSettings() {
  const result = db.select().from(schema.siteSettings).get();
  if (!result) return null;
  
  return {
    ...result,
    keywords: result.keywords ? JSON.parse(result.keywords) : [],
  };
}

// Helper to convert null to undefined
function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

// ─────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────
export function getHero() {
  const result = db.select().from(schema.hero).get();
  if (!result) return null;
  
  const HERO_PLACEHOLDER = "https://images.unsplash.com/photo-1541516160071-4bb0c5af65ba?w=1920&q=85&auto=format&fit=crop";
  
  return {
    badge: nullToUndefined(result.badge),
    headline: result.headline ? JSON.parse(result.headline) : [],
    subheadline: nullToUndefined(result.subheadline),
    cta: {
      primary: { label: result.ctaPrimaryLabel || "", href: result.ctaPrimaryHref || "" },
      secondary: { label: result.ctaSecondaryLabel || "", href: result.ctaSecondaryHref || "" },
    },
    stats: result.stats ? JSON.parse(result.stats) : [],
    services: result.services ? JSON.parse(result.services) : [],
    image: {
      src: result.imageSrc || HERO_PLACEHOLDER,
      alt: result.imageAlt || "PixelRoot Studio",
    },
    videoUrl: nullToUndefined(result.videoUrl),
    videoTitle: nullToUndefined(result.videoTitle),
    videoSubtitle: nullToUndefined(result.videoSubtitle),
  };
}

// ─────────────────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────────────────
export function getCategories() {
  return db.select().from(schema.categories).orderBy(schema.categories.sortOrder).all();
}

export function getFeaturedCategories() {
  const PLACEHOLDER = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80&auto=format&fit=crop";
  
  return db.select()
    .from(schema.categories)
    .where(eq(schema.categories.featured, true))
    .orderBy(schema.categories.sortOrder)
    .all()
    .map(cat => ({
      id: cat.slug,
      name: cat.name,
      description: nullToUndefined(cat.description),
      href: `/portfolio?cat=${cat.slug}`,
      image: cat.imageSrc || PLACEHOLDER,
    }));
}

export function getCategoryBySlug(slug: string) {
  return db.select().from(schema.categories).where(eq(schema.categories.slug, slug)).get();
}

// ─────────────────────────────────────────────────────────────
// Gallery
// ─────────────────────────────────────────────────────────────
export function getGalleryItems() {
  const items = db.select({
    id: schema.galleryItems.id,
    src: schema.galleryItems.src,
    alt: schema.galleryItems.alt,
    aspect: schema.galleryItems.aspect,
    categoryName: schema.categories.name,
  })
    .from(schema.galleryItems)
    .leftJoin(schema.categories, eq(schema.galleryItems.categoryId, schema.categories.id))
    .orderBy(schema.galleryItems.sortOrder)
    .all();
  
  return items.filter(item => item.src).map(item => ({
    id: `g${item.id}`,
    src: item.src,
    alt: item.alt,
    aspect: item.aspect || "landscape",
    category: item.categoryName,
  }));
}

export function getFeaturedGalleryItems() {
  const items = db.select({
    id: schema.galleryItems.id,
    src: schema.galleryItems.src,
    alt: schema.galleryItems.alt,
    aspect: schema.galleryItems.aspect,
    categoryName: schema.categories.name,
  })
    .from(schema.galleryItems)
    .leftJoin(schema.categories, eq(schema.galleryItems.categoryId, schema.categories.id))
    .where(eq(schema.galleryItems.featured, true))
    .orderBy(schema.galleryItems.sortOrder)
    .all();
  
  return items.filter(item => item.src).map(item => ({
    id: `g${item.id}`,
    src: item.src,
    alt: item.alt,
    aspect: item.aspect || "landscape",
    category: item.categoryName,
  }));
}

// ─────────────────────────────────────────────────────────────
// About
// ─────────────────────────────────────────────────────────────
export function getAbout() {
  const result = db.select().from(schema.about).get();
  if (!result) return null;
  
  const PHOTO_PLACEHOLDER = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=85&auto=format&fit=crop&crop=faces";
  const BANNER_PLACEHOLDER = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1920&q=85&auto=format&fit=crop";
  
  return {
    name: result.name,
    shortName: nullToUndefined(result.shortName),
    title: nullToUndefined(result.title),
    tagline: nullToUndefined(result.tagline),
    bio: result.bio ? JSON.parse(result.bio) : [],
    vision: nullToUndefined(result.vision),
    stats: result.stats ? JSON.parse(result.stats) : [],
    skills: result.skills ? JSON.parse(result.skills) : [],
    experience: result.experience ? JSON.parse(result.experience) : [],
    photo: result.photoSrc || PHOTO_PLACEHOLDER,
    bannerImage: result.bannerSrc || BANNER_PLACEHOLDER,
    contact: {
      phones: result.contactPhones ? JSON.parse(result.contactPhones) : [],
      emails: result.contactEmails ? JSON.parse(result.contactEmails) : [],
    },
  };
}

// ─────────────────────────────────────────────────────────────
// Team
// ─────────────────────────────────────────────────────────────
export function getTeamMembers() {
  const PHOTO_PLACEHOLDER = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=85&auto=format&fit=crop&crop=faces";
  
  return db.select()
    .from(schema.teamMembers)
    .orderBy(schema.teamMembers.sortOrder)
    .all()
    .map(member => ({
      id: `t${member.id}`,
      name: member.name,
      role: member.role || "",
      bio: member.bio || "",
      photo: member.photoSrc || PHOTO_PLACEHOLDER,
      isFounder: member.isFounder ?? false,
    }));
}

// ─────────────────────────────────────────────────────────────
// Projects
// ─────────────────────────────────────────────────────────────
export function getProjects() {
  const COVER_PLACEHOLDER = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=85&auto=format&fit=crop";
  
  const projects = db.select({
    id: schema.projects.id,
    title: schema.projects.title,
    slug: schema.projects.slug,
    summary: schema.projects.summary,
    date: schema.projects.date,
    client: schema.projects.client,
    featured: schema.projects.featured,
    coverSrc: schema.projects.coverSrc,
    coverAlt: schema.projects.coverAlt,
    categoryId: schema.categories.id,
    categoryName: schema.categories.name,
    categorySlug: schema.categories.slug,
  })
    .from(schema.projects)
    .leftJoin(schema.categories, eq(schema.projects.categoryId, schema.categories.id))
    .orderBy(schema.projects.sortOrder)
    .all();
  
  return projects.map(p => ({
    id: `p${p.id}`,
    title: p.title,
    slug: p.slug,
    summary: p.summary || "",
    date: p.date || "",
    client: p.client || "",
    featured: p.featured ?? false,
    coverImage: {
      src: p.coverSrc || COVER_PLACEHOLDER,
      alt: p.coverAlt || p.title,
    },
    category: {
      id: p.categorySlug || "",
      name: p.categoryName || "",
      slug: p.categorySlug || "",
    },
  }));
}

export function getProjectBySlug(slug: string) {
  const project = db.select({
    id: schema.projects.id,
    title: schema.projects.title,
    slug: schema.projects.slug,
    summary: schema.projects.summary,
    body: schema.projects.body,
    date: schema.projects.date,
    client: schema.projects.client,
    featured: schema.projects.featured,
    coverSrc: schema.projects.coverSrc,
    coverAlt: schema.projects.coverAlt,
    seoTitle: schema.projects.seoTitle,
    seoDescription: schema.projects.seoDescription,
    categoryName: schema.categories.name,
    categorySlug: schema.categories.slug,
  })
    .from(schema.projects)
    .leftJoin(schema.categories, eq(schema.projects.categoryId, schema.categories.id))
    .where(eq(schema.projects.slug, slug))
    .get();
  
  if (!project) return null;
  
  // Get gallery
  const gallery = db.select()
    .from(schema.projectGallery)
    .where(eq(schema.projectGallery.projectId, project.id))
    .orderBy(schema.projectGallery.sortOrder)
    .all()
    .map(img => ({
      id: `g${img.id}`,
      src: img.src,
      alt: img.alt,
      caption: nullToUndefined(img.caption),
    }));
  
  // Get team
  const teamJoin = db.select({
    memberId: schema.teamMembers.id,
    name: schema.teamMembers.name,
    role: schema.teamMembers.role,
    photo: schema.teamMembers.photoSrc,
  })
    .from(schema.projectTeam)
    .innerJoin(schema.teamMembers, eq(schema.projectTeam.teamMemberId, schema.teamMembers.id))
    .where(eq(schema.projectTeam.projectId, project.id))
    .all();
  
  const team = teamJoin.map(t => ({
    id: `t${t.memberId}`,
    name: t.name,
    role: t.role || "",
    photo: t.photo || "",
  }));
  
  const COVER_PLACEHOLDER = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=85&auto=format&fit=crop";
  
  return {
    id: `p${project.id}`,
    title: project.title,
    slug: project.slug,
    summary: nullToUndefined(project.summary),
    body: project.body ? JSON.parse(project.body) : [],
    date: nullToUndefined(project.date),
    client: nullToUndefined(project.client),
    featured: project.featured,
    coverImage: {
      src: project.coverSrc || COVER_PLACEHOLDER,
      alt: project.coverAlt || project.title,
    },
    category: {
      name: project.categoryName || "",
      slug: project.categorySlug || "",
    },
    seo: {
      metaTitle: nullToUndefined(project.seoTitle),
      metaDescription: nullToUndefined(project.seoDescription),
    },
    gallery,
    team,
  };
}

export function getProjectSlugs() {
  return db.select({ slug: schema.projects.slug })
    .from(schema.projects)
    .all();
}

export function getPortfolioCategories() {
  return db.select({
    id: schema.categories.slug,
    name: schema.categories.name,
    slug: schema.categories.slug,
  })
    .from(schema.categories)
    .orderBy(schema.categories.name)
    .all();
}

// ─────────────────────────────────────────────────────────────
// Gear
// ─────────────────────────────────────────────────────────────
export function getGearSettings() {
  const result = db.select().from(schema.gearSettings).get();
  if (!result) {
    return {
      title: "Our Gear",
      subtitle: "Professional equipment for exceptional results.",
    };
  }
  return {
    title: result.title || "Our Gear",
    subtitle: nullToUndefined(result.subtitle),
  };
}

export function getGearItems() {
  const GEAR_PLACEHOLDER = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=85&auto=format&fit=crop";
  
  return db
    .select()
    .from(schema.gear)
    .orderBy(schema.gear.sortOrder, schema.gear.id)
    .all()
    .map((g) => ({
      id: `gear-${g.id}`,
      name: g.name,
      category: g.category,
      description: g.description || "",
      image: g.imageSrc || GEAR_PLACEHOLDER,
      featured: g.featured ?? false,
    }));
}

// ─────────────────────────────────────────────────────────────
// SEO helpers
// ─────────────────────────────────────────────────────────────
export function getSiteSeo() {
  const settings = getSiteSettings();
  if (!settings) {
    return {
      siteName: "PixelRoot Studio",
      siteUrl: "https://example.com",
      title: "PixelRoot Studio",
      description: "",
      locale: "en_US",
      twitterHandle: "",
      keywords: [],
      organization: {
        name: "PixelRoot Studio",
        email: "",
        telephone: "",
      },
    };
  }
  
  return {
    siteName: settings.siteName,
    siteUrl: settings.siteUrl,
    title: settings.metaTitle || settings.siteName,
    description: settings.metaDescription || "",
    locale: settings.locale || "en_US",
    twitterHandle: settings.twitterHandle || "",
    keywords: settings.keywords || [],
    organization: {
      name: settings.orgName || settings.siteName,
      email: settings.orgEmail || "",
      telephone: settings.orgPhone || "",
      address: nullToUndefined(settings.orgAddress),
    },
    social: {
      facebook: nullToUndefined(settings.socialFacebook),
      instagram: nullToUndefined(settings.socialInstagram),
      youtube: nullToUndefined(settings.socialYoutube),
      linkedin: nullToUndefined(settings.socialLinkedin),
    },
  };
}
