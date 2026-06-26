/**
 * Rebuilds a corrupted SQLite database from export_partial.sql
 * Run: npx tsx lib/db/repair-database.ts
 */
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { runMigrations } from "./migrate";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "pixelroot.db");
const exportPath = path.join(dataDir, "export_partial.sql");

function createBaseSchema(sqlite: Database.Database) {
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
      social_title TEXT,
      social_subtitle TEXT,
      logo TEXT,
      favicon TEXT,
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
      video_title TEXT,
      video_subtitle TEXT,
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

    CREATE TABLE IF NOT EXISTS gear (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      image_src TEXT,
      featured INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS gear_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT DEFAULT 'Our Gear',
      subtitle TEXT,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      short_description TEXT,
      description TEXT,
      features TEXT,
      price REAL,
      price_label TEXT,
      currency TEXT DEFAULT 'BDT',
      duration TEXT,
      deliverables TEXT,
      popular INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      image_src TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER REFERENCES leads(id),
      package_id INTEGER REFERENCES packages(id),
      package_name TEXT,
      client_name TEXT NOT NULL,
      email TEXT,
      phone TEXT NOT NULL,
      event_date TEXT,
      event_type TEXT,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      service TEXT,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      created_at INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS package_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT DEFAULT 'Our Packages',
      subtitle TEXT,
      cta_label TEXT DEFAULT 'View All Packages',
      cta_href TEXT DEFAULT '/packages',
      updated_at INTEGER
    );
  `);
}

// Remove broken database files (keep .corrupt-* backups)
for (const file of ["pixelroot.db", "pixelroot.db-wal", "pixelroot.db-shm"]) {
  const p = path.join(dataDir, file);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log(`Removed ${file}`);
  }
}

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
createBaseSchema(db);
runMigrations(db);

if (fs.existsSync(exportPath)) {
  const statements = fs
    .readFileSync(exportPath, "utf8")
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.startsWith("INSERT INTO"));

  db.exec("PRAGMA foreign_keys = OFF;");
  let imported = 0;
  for (const stmt of statements) {
    try {
      db.exec(`${stmt};`);
      imported++;
    } catch (err) {
      console.warn("Skipped insert:", (err as Error).message);
    }
  }
  db.exec("PRAGMA foreign_keys = ON;");
  console.log(`Imported ${imported} rows from export_partial.sql`);
} else {
  console.warn("No export_partial.sql — empty database created");
}

const check = db.pragma("integrity_check", { simple: true }) as string;
console.log("Integrity:", check);

const test = db.prepare("INSERT INTO corporate_clients (name, logo_src) VALUES (?, ?)").run(
  "__repair_test__",
  "/uploads/brand/test.png"
);
db.prepare("DELETE FROM corporate_clients WHERE name = ?").run("__repair_test__");
console.log("corporate_clients write test: ok (id", test.lastInsertRowid, ")");

db.close();
console.log("Database repair complete. Restart npm run dev.");
