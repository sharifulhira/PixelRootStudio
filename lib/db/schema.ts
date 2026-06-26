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
  socialTiktok: text("social_tiktok"),
  socialTitle: text("social_title"),
  socialSubtitle: text("social_subtitle"),

  // Brand assets
  logo: text("logo"),
  favicon: text("favicon"),
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
// Corporate Clients (homepage logo marquee)
// ─────────────────────────────────────────────────────────────
export const corporateClients = sqliteTable("corporate_clients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  logoSrc: text("logo_src").notNull(),
  websiteUrl: text("website_url"),
  published: integer("published", { mode: "boolean" }).default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const corporateClientsSettings = sqliteTable("corporate_clients_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").default("Trusted by Leading Brands"),
  subtitle: text("subtitle"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─────────────────────────────────────────────────────────────
// Packages
// ─────────────────────────────────────────────────────────────
export const packages = sqliteTable("packages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(), // wedding, corporate, fashion, product, event
  shortDescription: text("short_description"),
  description: text("description"),
  features: text("features"), // JSON array of strings
  price: real("price"),
  priceLabel: text("price_label"), // e.g. "Starting from" or "From ৳"
  currency: text("currency").default("BDT"),
  duration: text("duration"), // e.g. "4-6 hours", "Full day"
  deliverables: text("deliverables"), // e.g. "50 edited photos"
  popular: integer("popular", { mode: "boolean" }).default(false),
  active: integer("active", { mode: "boolean" }).default(true),
  imageSrc: text("image_src"),
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─────────────────────────────────────────────────────────────
// Leads (contact form inquiries)
// ─────────────────────────────────────────────────────────────
export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  service: text("service"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"), // new, contacted, converted, closed
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─────────────────────────────────────────────────────────────
// Bookings (package booking requests)
// ─────────────────────────────────────────────────────────────
export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  leadId: integer("lead_id").references(() => leads.id),
  packageId: integer("package_id").references(() => packages.id),
  packageName: text("package_name"), // denormalized for quick display
  clientName: text("client_name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  eventDate: text("event_date"),
  eventType: text("event_type"),
  message: text("message"),
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  invoiceId: integer("invoice_id"),
  invoiceNumber: text("invoice_number"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─────────────────────────────────────────────────────────────
// Invoices & Accounting
// ─────────────────────────────────────────────────────────────
export const invoiceSettings = sqliteTable("invoice_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  prefix: text("prefix").default("INV"),
  nextNumber: integer("next_number").default(1001),
  defaultTaxRate: real("default_tax_rate").default(0),
  defaultCurrency: text("default_currency").default("BDT"),
  defaultTerms: text("default_terms"),
  defaultNotes: text("default_notes"),
  companyName: text("company_name"),
  companyEmail: text("company_email"),
  companyPhone: text("company_phone"),
  companyAddress: text("company_address"),
  signatureImage: text("signature_image"),
  paidSealImage: text("paid_seal_image"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const invoices = sqliteTable("invoices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  invoiceNumber: text("invoice_number").notNull().unique(),
  bookingId: integer("booking_id").references(() => bookings.id),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email"),
  clientPhone: text("client_phone"),
  clientAddress: text("client_address"),
  issueDate: text("issue_date").notNull(),
  dueDate: text("due_date"),
  status: text("status").notNull().default("draft"), // draft, sent, paid, overdue, cancelled
  currency: text("currency").default("BDT"),
  subtotal: real("subtotal").default(0),
  taxRate: real("tax_rate").default(0),
  taxAmount: real("tax_amount").default(0),
  discountType: text("discount_type").default("fixed"), // fixed | percent
  discountValue: real("discount_value").default(0),
  discountAmount: real("discount_amount").default(0),
  total: real("total").default(0),
  notes: text("notes"),
  terms: text("terms"),
  paidAt: integer("paid_at", { mode: "timestamp" }),
  paymentMethod: text("payment_method"),
  paymentReference: text("payment_reference"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const invoicePayments = sqliteTable("invoice_payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  invoiceId: integer("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(),
  paymentDate: text("payment_date").notNull(),
  method: text("method"),
  reference: text("reference"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const invoiceItems = sqliteTable("invoice_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  invoiceId: integer("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: real("quantity").default(1),
  unitPrice: real("unit_price").default(0),
  amount: real("amount").default(0),
  sortOrder: integer("sort_order").default(0),
});

// ─────────────────────────────────────────────────────────────
// Page Views (visitor analytics)
// ─────────────────────────────────────────────────────────────
export const pageViews = sqliteTable("page_views", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  path: text("path").notNull(),
  referrer: text("referrer"),
  source: text("source").notNull().default("direct"),
  sessionId: text("session_id").notNull(),
  device: text("device"),
  browser: text("browser"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─────────────────────────────────────────────────────────────
// Package Settings (section heading on homepage)
// ─────────────────────────────────────────────────────────────
export const packageSettings = sqliteTable("package_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").default("Our Packages"),
  subtitle: text("subtitle"),
  ctaLabel: text("cta_label").default("View All Packages"),
  ctaHref: text("cta_href").default("/packages"),
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
export type CorporateClient = typeof corporateClients.$inferSelect;
export type CorporateClientsSettings = typeof corporateClientsSettings.$inferSelect;
export type Package = typeof packages.$inferSelect;
export type NewPackage = typeof packages.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type PackageSettings = typeof packageSettings.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type InvoicePayment = typeof invoicePayments.$inferSelect;
export type InvoiceSettings = typeof invoiceSettings.$inferSelect;
export type PageView = typeof pageViews.$inferSelect;
export type NewPageView = typeof pageViews.$inferInsert;
