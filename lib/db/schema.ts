import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// ─────────────────────────────────────────────────────────────
// Admin Users
// ─────────────────────────────────────────────────────────────
export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
});

// ─────────────────────────────────────────────────────────────
// Site Settings (SEO + Organization)
// ─────────────────────────────────────────────────────────────
export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  siteName: text("site_name").notNull().default("PixelRoot Studio"),
  siteUrl: text("site_url").notNull().default("https://example.com"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  locale: text("locale").default("en_US"),
  twitterHandle: text("twitter_handle"),
  keywords: text("keywords"), // JSON array stored as text
  
  // Organization
  orgName: text("org_name"),
  orgEmail: text("org_email"),
  orgPhone: text("org_phone"),
  orgAddress: text("org_address"),
  
  // Social links
  socialFacebook: text("social_facebook"),
  socialInstagram: text("social_instagram"),
  socialYoutube: text("social_youtube"),
  socialLinkedin: text("social_linkedin"),
  
  ogImage: text("og_image"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─────────────────────────────────────────────────────────────
// Hero Section
// ─────────────────────────────────────────────────────────────
export const hero = sqliteTable("hero", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  badge: text("badge"),
  headline: text("headline"), // JSON array
  subheadline: text("subheadline"),
  ctaPrimaryLabel: text("cta_primary_label"),
  ctaPrimaryHref: text("cta_primary_href"),
  ctaSecondaryLabel: text("cta_secondary_label"),
  ctaSecondaryHref: text("cta_secondary_href"),
  stats: text("stats"), // JSON array
  services: text("services"), // JSON array
  imageSrc: text("image_src"),
  imageAlt: text("image_alt"),
  videoUrl: text("video_url"),
  videoTitle: text("video_title"),
  videoSubtitle: text("video_subtitle"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─────────────────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────────────────
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageSrc: text("image_src"),
  color: text("color"),
  featured: integer("featured", { mode: "boolean" }).default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─────────────────────────────────────────────────────────────
// Gallery Items (Homepage gallery)
// ─────────────────────────────────────────────────────────────
export const galleryItems = sqliteTable("gallery_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("category_id").references(() => categories.id),
  src: text("src").notNull(),
  alt: text("alt").notNull(),
  aspect: text("aspect").default("landscape"), // portrait | landscape | square
  featured: integer("featured", { mode: "boolean" }).default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─────────────────────────────────────────────────────────────
// About
// ─────────────────────────────────────────────────────────────
export const about = sqliteTable("about", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  shortName: text("short_name"),
  title: text("title"),
  tagline: text("tagline"),
  bio: text("bio"), // JSON array of paragraphs
  vision: text("vision"),
  stats: text("stats"), // JSON array
  skills: text("skills"), // JSON array
  experience: text("experience"), // JSON array
  photoSrc: text("photo_src"),
  bannerSrc: text("banner_src"),
  contactPhones: text("contact_phones"), // JSON array
  contactEmails: text("contact_emails"), // JSON array
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─────────────────────────────────────────────────────────────
// Team Members
// ─────────────────────────────────────────────────────────────
export const teamMembers = sqliteTable("team_members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role"),
  bio: text("bio"),
  photoSrc: text("photo_src"),
  isFounder: integer("is_founder", { mode: "boolean" }).default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─────────────────────────────────────────────────────────────
// Projects
// ─────────────────────────────────────────────────────────────
export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary"),
  body: text("body"), // JSON array of paragraphs
  date: text("date"), // ISO date string
  client: text("client"),
  featured: integer("featured", { mode: "boolean" }).default(false),
  
  // Cover image
  coverSrc: text("cover_src"),
  coverAlt: text("cover_alt"),
  
  // Category reference
  categoryId: integer("category_id").references(() => categories.id),
  
  // SEO override
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─────────────────────────────────────────────────────────────
// Project Gallery (images within a project)
// ─────────────────────────────────────────────────────────────
export const projectGallery = sqliteTable("project_gallery", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  src: text("src").notNull(),
  alt: text("alt").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").default(0),
});

// ─────────────────────────────────────────────────────────────
// Project Team (junction table)
// ─────────────────────────────────────────────────────────────
export const projectTeam = sqliteTable("project_team", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  teamMemberId: integer("team_member_id").notNull().references(() => teamMembers.id, { onDelete: "cascade" }),
});

// ─────────────────────────────────────────────────────────────
// Gear Showcase
// ─────────────────────────────────────────────────────────────
export const gear = sqliteTable("gear", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(), // Camera, Lens, Lighting, Accessory, etc.
  description: text("description"),
  imageSrc: text("image_src"),
  featured: integer("featured", { mode: "boolean" }).default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Gear Section Settings
export const gearSettings = sqliteTable("gear_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").default("Our Gear"),
  subtitle: text("subtitle"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─────────────────────────────────────────────────────────────
// Type exports for convenience
// ─────────────────────────────────────────────────────────────
export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type Hero = typeof hero.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type About = typeof about.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type ProjectGalleryImage = typeof projectGallery.$inferSelect;
export type Gear = typeof gear.$inferSelect;
export type GearSettings = typeof gearSettings.$inferSelect;
