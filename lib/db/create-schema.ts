import type Database from "better-sqlite3";

/** Ensures every application table exists — safe to run on every startup. */
export function ensureBaseSchema(sqlite: Database.Database) {
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
      social_tiktok TEXT,
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
      invoice_id INTEGER,
      invoice_number TEXT,
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

    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      referrer TEXT,
      source TEXT NOT NULL DEFAULT 'direct',
      session_id TEXT NOT NULL,
      device TEXT,
      browser TEXT,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS invoice_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prefix TEXT DEFAULT 'INV',
      next_number INTEGER DEFAULT 1001,
      default_tax_rate REAL DEFAULT 0,
      default_currency TEXT DEFAULT 'BDT',
      default_terms TEXT,
      default_notes TEXT,
      company_name TEXT,
      company_email TEXT,
      company_phone TEXT,
      company_address TEXT,
      signature_image TEXT,
      paid_seal_image TEXT,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_number TEXT NOT NULL UNIQUE,
      booking_id INTEGER REFERENCES bookings(id),
      client_name TEXT NOT NULL,
      client_email TEXT,
      client_phone TEXT,
      client_address TEXT,
      issue_date TEXT NOT NULL,
      due_date TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      currency TEXT DEFAULT 'BDT',
      subtotal REAL DEFAULT 0,
      tax_rate REAL DEFAULT 0,
      tax_amount REAL DEFAULT 0,
      discount_type TEXT DEFAULT 'fixed',
      discount_value REAL DEFAULT 0,
      discount_amount REAL DEFAULT 0,
      total REAL DEFAULT 0,
      notes TEXT,
      terms TEXT,
      paid_at INTEGER,
      payment_method TEXT,
      payment_reference TEXT,
      created_at INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS invoice_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
      description TEXT NOT NULL,
      quantity REAL DEFAULT 1,
      unit_price REAL DEFAULT 0,
      amount REAL DEFAULT 0,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS invoice_payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
      amount REAL NOT NULL,
      payment_date TEXT NOT NULL,
      method TEXT,
      reference TEXT,
      notes TEXT,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS corporate_clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      logo_src TEXT NOT NULL,
      website_url TEXT,
      published INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS corporate_clients_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT DEFAULT 'Trusted by Leading Brands',
      subtitle TEXT,
      updated_at INTEGER
    );
  `);
}
