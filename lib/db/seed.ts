import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { hash } from "bcryptjs";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

// Data imports
import heroData from "../../data/hero.json";
import categoriesData from "../../data/categories.json";
import galleryData from "../../data/gallery.json";
import aboutData from "../../data/about.json";
import teamData from "../../data/team.json";
import seoData from "../../data/seo.json";
import projectsData from "../../data/projects.json";

const DB_PATH = path.join(process.cwd(), "data", "pixelroot.db");

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Delete existing database to start fresh
if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
  console.log("Deleted existing database");
}

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");

const db = drizzle(sqlite, { schema });

async function seed() {
  console.log("🌱 Seeding database...\n");

  // ─────────────────────────────────────────────────────────────
  // Create tables
  // ─────────────────────────────────────────────────────────────
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT,
      created_at INTEGER,
      last_login_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      site_name TEXT NOT NULL DEFAULT 'PixelRoot Studio',
      site_url TEXT NOT NULL DEFAULT 'https://example.com',
      meta_title TEXT,
      meta_description TEXT,
      locale TEXT DEFAULT 'en_US',
      twitter_handle TEXT,
      keywords TEXT,
      org_name TEXT,
      org_email TEXT,
      org_phone TEXT,
      org_address TEXT,
      social_facebook TEXT,
      social_instagram TEXT,
      social_youtube TEXT,
      social_linkedin TEXT,
      og_image TEXT,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS hero (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      badge TEXT,
      headline TEXT,
      subheadline TEXT,
      cta_primary_label TEXT,
      cta_primary_href TEXT,
      cta_secondary_label TEXT,
      cta_secondary_href TEXT,
      stats TEXT,
      services TEXT,
      image_src TEXT,
      image_alt TEXT,
      video_url TEXT,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      image_src TEXT,
      color TEXT,
      featured INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      created_at INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS gallery_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER REFERENCES categories(id),
      src TEXT NOT NULL,
      alt TEXT NOT NULL,
      aspect TEXT DEFAULT 'landscape',
      featured INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS about (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      short_name TEXT,
      title TEXT,
      tagline TEXT,
      bio TEXT,
      vision TEXT,
      stats TEXT,
      skills TEXT,
      experience TEXT,
      photo_src TEXT,
      banner_src TEXT,
      contact_phones TEXT,
      contact_emails TEXT,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT,
      bio TEXT,
      photo_src TEXT,
      is_founder INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      summary TEXT,
      body TEXT,
      date TEXT,
      client TEXT,
      featured INTEGER DEFAULT 0,
      cover_src TEXT,
      cover_alt TEXT,
      category_id INTEGER REFERENCES categories(id),
      seo_title TEXT,
      seo_description TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS project_gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      src TEXT NOT NULL,
      alt TEXT NOT NULL,
      caption TEXT,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS project_team (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      team_member_id INTEGER NOT NULL REFERENCES team_members(id) ON DELETE CASCADE
    );
  `);

  console.log("✓ Tables created");

  // ─────────────────────────────────────────────────────────────
  // Seed Admin User
  // ─────────────────────────────────────────────────────────────
  const adminPassword = "admin123"; // Change this!
  const passwordHash = await hash(adminPassword, 12);
  
  db.insert(schema.adminUsers).values({
    email: "admin@pixelroot.studio",
    passwordHash,
    name: "Admin",
    createdAt: new Date(),
  }).run();
  
  console.log("✓ Admin user created (email: admin@pixelroot.studio, password: admin123)");

  // ─────────────────────────────────────────────────────────────
  // Seed Site Settings
  // ─────────────────────────────────────────────────────────────
  db.insert(schema.siteSettings).values({
    siteName: seoData.siteName,
    siteUrl: seoData.siteUrl,
    metaTitle: seoData.title,
    metaDescription: seoData.description,
    locale: seoData.locale,
    twitterHandle: seoData.twitterHandle,
    keywords: JSON.stringify(seoData.keywords),
    orgName: seoData.organization.name,
    orgEmail: seoData.organization.email,
    orgPhone: seoData.organization.telephone,
    updatedAt: new Date(),
  }).run();
  
  console.log("✓ Site settings seeded");

  // ─────────────────────────────────────────────────────────────
  // Seed Hero
  // ─────────────────────────────────────────────────────────────
  db.insert(schema.hero).values({
    badge: heroData.badge,
    headline: JSON.stringify(heroData.headline),
    subheadline: heroData.subheadline,
    ctaPrimaryLabel: heroData.cta.primary.label,
    ctaPrimaryHref: heroData.cta.primary.href,
    ctaSecondaryLabel: heroData.cta.secondary.label,
    ctaSecondaryHref: heroData.cta.secondary.href,
    stats: JSON.stringify(heroData.stats),
    services: JSON.stringify(heroData.services),
    imageSrc: heroData.image.src,
    imageAlt: heroData.image.alt,
    updatedAt: new Date(),
  }).run();
  
  console.log("✓ Hero seeded");

  // ─────────────────────────────────────────────────────────────
  // Seed Categories
  // ─────────────────────────────────────────────────────────────
  const categoryMap: Record<string, number> = {};
  
  for (let i = 0; i < categoriesData.length; i++) {
    const cat = categoriesData[i];
    const result = db.insert(schema.categories).values({
      name: cat.name,
      slug: cat.id,
      description: cat.description,
      imageSrc: cat.image,
      featured: true,
      sortOrder: i,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning().get();
    
    categoryMap[cat.id] = result.id;
  }
  
  console.log(`✓ ${categoriesData.length} categories seeded`);

  // ─────────────────────────────────────────────────────────────
  // Seed Gallery Items
  // ─────────────────────────────────────────────────────────────
  for (let i = 0; i < galleryData.length; i++) {
    const item = galleryData[i];
    const categorySlug = item.category.toLowerCase();
    
    db.insert(schema.galleryItems).values({
      categoryId: categoryMap[categorySlug] || null,
      src: item.src,
      alt: item.alt,
      aspect: item.aspect,
      featured: true,
      sortOrder: i,
      createdAt: new Date(),
    }).run();
  }
  
  console.log(`✓ ${galleryData.length} gallery items seeded`);

  // ─────────────────────────────────────────────────────────────
  // Seed About
  // ─────────────────────────────────────────────────────────────
  db.insert(schema.about).values({
    name: aboutData.name,
    shortName: aboutData.shortName,
    title: aboutData.title,
    tagline: aboutData.tagline,
    bio: JSON.stringify(aboutData.bio),
    vision: aboutData.vision,
    stats: JSON.stringify(aboutData.stats),
    skills: JSON.stringify(aboutData.skills),
    experience: JSON.stringify(aboutData.experience),
    photoSrc: aboutData.photo,
    bannerSrc: aboutData.bannerImage,
    contactPhones: JSON.stringify(aboutData.contact.phones),
    contactEmails: JSON.stringify(aboutData.contact.emails),
    updatedAt: new Date(),
  }).run();
  
  console.log("✓ About seeded");

  // ─────────────────────────────────────────────────────────────
  // Seed Team Members
  // ─────────────────────────────────────────────────────────────
  const teamMap: Record<string, number> = {};
  
  for (let i = 0; i < teamData.length; i++) {
    const member = teamData[i];
    const result = db.insert(schema.teamMembers).values({
      name: member.name,
      role: member.role,
      bio: member.bio,
      photoSrc: member.photo,
      isFounder: member.isFounder,
      sortOrder: i,
      createdAt: new Date(),
    }).returning().get();
    
    teamMap[member.id] = result.id;
  }
  
  console.log(`✓ ${teamData.length} team members seeded`);

  // ─────────────────────────────────────────────────────────────
  // Seed Projects
  // ─────────────────────────────────────────────────────────────
  for (let i = 0; i < projectsData.length; i++) {
    const project = projectsData[i];
    const categorySlug = project.category.slug;
    
    const result = db.insert(schema.projects).values({
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      body: JSON.stringify(project.body),
      date: project.date,
      client: project.client,
      featured: project.featured,
      coverSrc: project.coverImage.src,
      coverAlt: project.coverImage.alt,
      categoryId: categoryMap[categorySlug] || null,
      seoTitle: project.seo?.metaTitle,
      seoDescription: project.seo?.metaDescription,
      sortOrder: i,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning().get();
    
    // Insert project gallery
    if (project.gallery) {
      for (let j = 0; j < project.gallery.length; j++) {
        const img = project.gallery[j];
        db.insert(schema.projectGallery).values({
          projectId: result.id,
          src: img.src,
          alt: img.alt,
          caption: img.caption,
          sortOrder: j,
        }).run();
      }
    }
    
    // Insert project team
    if (project.team) {
      for (const teamId of project.team) {
        const memberId = teamMap[teamId];
        if (memberId) {
          db.insert(schema.projectTeam).values({
            projectId: result.id,
            teamMemberId: memberId,
          }).run();
        }
      }
    }
  }
  
  console.log(`✓ ${projectsData.length} projects seeded`);

  console.log("\n✅ Database seeded successfully!");
  console.log("\n📝 Admin login:");
  console.log("   Email: admin@pixelroot.studio");
  console.log("   Password: admin123");
  console.log("\n⚠️  Change the password after first login!");
}

seed().catch(console.error);
