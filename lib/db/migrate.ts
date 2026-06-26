import type Database from "better-sqlite3";

const columnMigrations: { table: string; column: string; type: string }[] = [
  { table: "site_settings", column: "logo", type: "TEXT" },
  { table: "site_settings", column: "favicon", type: "TEXT" },
  { table: "site_settings", column: "social_title", type: "TEXT" },
  { table: "site_settings", column: "social_subtitle", type: "TEXT" },
  { table: "leads", column: "phone", type: "TEXT" },
  { table: "bookings", column: "lead_id", type: "INTEGER" },
  { table: "invoice_settings", column: "signature_image", type: "TEXT" },
  { table: "invoice_settings", column: "paid_seal_image", type: "TEXT" },
  { table: "bookings", column: "invoice_id", type: "INTEGER" },
  { table: "bookings", column: "invoice_number", type: "TEXT" },
];

const tableMigrations: string[] = [
  `CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    service TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at INTEGER,
    updated_at INTEGER
  )`,
  `CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL,
    referrer TEXT,
    source TEXT NOT NULL DEFAULT 'direct',
    session_id TEXT NOT NULL,
    device TEXT,
    browser TEXT,
    created_at INTEGER
  )`,
  `CREATE TABLE IF NOT EXISTS invoice_settings (
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
    updated_at INTEGER
  )`,
  `CREATE TABLE IF NOT EXISTS invoices (
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
  )`,
  `CREATE TABLE IF NOT EXISTS invoice_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity REAL DEFAULT 1,
    unit_price REAL DEFAULT 0,
    amount REAL DEFAULT 0,
    sort_order INTEGER DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS invoice_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    amount REAL NOT NULL,
    payment_date TEXT NOT NULL,
    method TEXT,
    reference TEXT,
    notes TEXT,
    created_at INTEGER
  )`,
  `CREATE TABLE IF NOT EXISTS corporate_clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    logo_src TEXT NOT NULL,
    website_url TEXT,
    published INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at INTEGER
  )`,
  `CREATE TABLE IF NOT EXISTS corporate_clients_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT DEFAULT 'Trusted by Leading Brands',
    subtitle TEXT,
    updated_at INTEGER
  )`,
];

export function runMigrations(sqlite: Database.Database) {
  for (const sql of tableMigrations) {
    sqlite.exec(sql);
  }

  for (const { table, column, type } of columnMigrations) {
    try {
      sqlite.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
    } catch {
      // Column already exists
    }
  }

  sqlite.exec(`
    UPDATE bookings
    SET invoice_id = (
      SELECT id FROM invoices WHERE invoices.booking_id = bookings.id LIMIT 1
    ),
    invoice_number = (
      SELECT invoice_number FROM invoices WHERE invoices.booking_id = bookings.id LIMIT 1
    )
    WHERE invoice_id IS NULL
      AND EXISTS (SELECT 1 FROM invoices WHERE invoices.booking_id = bookings.id)
  `);
}
