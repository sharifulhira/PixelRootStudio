import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { hash } from "bcryptjs";
import * as schema from "./schema";
import { runMigrations } from "./migrate";
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
for (const file of ["pixelroot.db", "pixelroot.db-wal", "pixelroot.db-shm"]) {
  const p = path.join(dataDir, file);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
  }
}
if (fs.existsSync(DB_PATH)) {
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
  runMigrations(sqlite);

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

  // ─────────────────────────────────────────────────────────────
  // Seed Package Settings
  // ─────────────────────────────────────────────────────────────
  db.insert(schema.packageSettings).values({
    title: "Our Packages",
    subtitle: "Premium photography packages designed to capture your most important moments with cinematic excellence.",
    ctaLabel: "View All Packages",
    ctaHref: "/packages",
    updatedAt: new Date(),
  }).run();

  // ─────────────────────────────────────────────────────────────
  // Seed Packages
  // ─────────────────────────────────────────────────────────────
  const packagesData = [
    {
      name: "Wedding Essential",
      slug: "wedding-essential",
      category: "wedding",
      shortDescription: "Perfect for intimate ceremonies",
      description: "Capture every precious moment of your intimate wedding ceremony. This package includes professional coverage of the ceremony, couple portraits, and family group photos with expertly edited deliverables.",
      features: ["4-6 hours coverage", "1 photographer", "200+ edited photos", "Online gallery", "10 printed photos (8x12)", "Highlight slideshow"],
      price: 35000,
      priceLabel: "Starting from",
      currency: "BDT",
      duration: "4-6 hours",
      deliverables: "200+ edited photos",
      popular: false,
    },
    {
      name: "Wedding Premium",
      slug: "wedding-premium",
      category: "wedding",
      shortDescription: "Complete coverage for your big day",
      description: "Full-day wedding coverage with a team of photographers ensuring no moment goes uncaptured. From getting ready shots to the reception, every emotion and detail is documented beautifully.",
      features: ["Full day coverage (12+ hours)", "2 photographers", "500+ edited photos", "Cinematic highlight video (3-5 min)", "Premium album (40 pages)", "Online gallery", "Pre-wedding shoot included", "Drone coverage"],
      price: 85000,
      priceLabel: "Starting from",
      currency: "BDT",
      duration: "Full day (12+ hours)",
      deliverables: "500+ edited photos + video",
      popular: true,
    },
    {
      name: "Corporate Event",
      slug: "corporate-event",
      category: "corporate",
      shortDescription: "Professional event documentation",
      description: "Professional photography for corporate events, conferences, seminars, and product launches. Clean, sharp images perfect for press releases, social media, and internal communications.",
      features: ["4-8 hours coverage", "1-2 photographers", "300+ edited photos", "Same-day preview (20 photos)", "Corporate headshots (up to 20 people)", "Event highlight video", "Social media ready crops"],
      price: 45000,
      priceLabel: "Starting from",
      currency: "BDT",
      duration: "4-8 hours",
      deliverables: "300+ edited photos",
      popular: false,
    },
    {
      name: "Fashion Portfolio",
      slug: "fashion-portfolio",
      category: "fashion",
      shortDescription: "Elevate your fashion brand",
      description: "High-end fashion photography for lookbooks, campaigns, and portfolios. Studio or location shoots with professional lighting and creative direction to showcase your designs.",
      features: ["Half day studio/location shoot", "Professional lighting setup", "50+ edited photos", "5 retouched hero images", "Mood board consultation", "Styling guidance", "Commercial usage license"],
      price: 55000,
      priceLabel: "Starting from",
      currency: "BDT",
      duration: "Half day (4-5 hours)",
      deliverables: "50+ edited photos",
      popular: true,
    },
    {
      name: "Product Photography",
      slug: "product-photography",
      category: "product",
      shortDescription: "Make your products shine",
      description: "Clean, professional product photography for e-commerce, catalogs, and advertising. White background, lifestyle, and creative compositions that make your products irresistible.",
      features: ["Up to 20 products", "White background shots", "Lifestyle compositions", "Multiple angles per product", "Web-optimized exports", "E-commerce ready", "2-day turnaround"],
      price: 25000,
      priceLabel: "Starting from",
      currency: "BDT",
      duration: "1 day",
      deliverables: "60+ product photos",
      popular: false,
    },
    {
      name: "Event Coverage",
      slug: "event-coverage",
      category: "event",
      shortDescription: "Document your special occasions",
      description: "Whether it's a birthday celebration, anniversary, or community gathering, we capture the energy, joy, and candid moments that make your event memorable.",
      features: ["3-5 hours coverage", "1 photographer", "150+ edited photos", "Online gallery", "Quick turnaround (5 days)", "Social media highlights"],
      price: 20000,
      priceLabel: "Starting from",
      currency: "BDT",
      duration: "3-5 hours",
      deliverables: "150+ edited photos",
      popular: true,
    },
  ];

  for (let i = 0; i < packagesData.length; i++) {
    const pkg = packagesData[i];
    db.insert(schema.packages).values({
      name: pkg.name,
      slug: pkg.slug,
      category: pkg.category,
      shortDescription: pkg.shortDescription,
      description: pkg.description,
      features: JSON.stringify(pkg.features),
      price: pkg.price,
      priceLabel: pkg.priceLabel,
      currency: pkg.currency,
      duration: pkg.duration,
      deliverables: pkg.deliverables,
      popular: pkg.popular,
      active: true,
      sortOrder: i,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).run();
  }

  console.log(`✓ ${packagesData.length} packages seeded`);

  console.log("\n✅ Database seeded successfully!");
  console.log("\n📝 Admin login:");
  console.log("   Email: admin@pixelroot.studio");
  console.log("   Password: admin123");
  console.log("\n⚠️  Change the password after first login!");
}

seed().catch(console.error);
