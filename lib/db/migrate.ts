import type Database from "better-sqlite3";
import { ensureBaseSchema } from "./create-schema";
import { defaultAboutPageCopy } from "../about/page-copy";

const columnMigrations: { table: string; column: string; type: string }[] = [
  { table: "site_settings", column: "logo", type: "TEXT" },
  { table: "site_settings", column: "favicon", type: "TEXT" },
  { table: "site_settings", column: "gtm_container_id", type: "TEXT" },
  { table: "site_settings", column: "gtm_enabled", type: "INTEGER NOT NULL DEFAULT 0" },
  { table: "site_settings", column: "ga4_measurement_id", type: "TEXT" },
  { table: "site_settings", column: "ga4_enabled", type: "INTEGER NOT NULL DEFAULT 0" },
  { table: "site_settings", column: "google_site_verification", type: "TEXT" },
  { table: "site_settings", column: "search_console_enabled", type: "INTEGER NOT NULL DEFAULT 0" },
  { table: "site_settings", column: "clarity_project_id", type: "TEXT" },
  { table: "site_settings", column: "clarity_enabled", type: "INTEGER NOT NULL DEFAULT 0" },
  { table: "site_settings", column: "facebook_pixel_id", type: "TEXT" },
  { table: "site_settings", column: "facebook_pixel_enabled", type: "INTEGER NOT NULL DEFAULT 0" },
  { table: "site_settings", column: "google_ads_id", type: "TEXT" },
  { table: "site_settings", column: "google_ads_label", type: "TEXT" },
  { table: "site_settings", column: "google_ads_enabled", type: "INTEGER NOT NULL DEFAULT 0" },
  { table: "site_settings", column: "social_title", type: "TEXT" },
  { table: "site_settings", column: "social_subtitle", type: "TEXT" },
  { table: "site_settings", column: "social_tiktok", type: "TEXT" },
  { table: "site_settings", column: "contact_phones", type: "TEXT" },
  { table: "site_settings", column: "contact_emails", type: "TEXT" },
  { table: "leads", column: "phone", type: "TEXT" },
  { table: "bookings", column: "lead_id", type: "INTEGER" },
  { table: "bookings", column: "invoice_id", type: "INTEGER" },
  { table: "bookings", column: "invoice_number", type: "TEXT" },
  { table: "invoice_settings", column: "signature_image", type: "TEXT" },
  { table: "invoice_settings", column: "paid_seal_image", type: "TEXT" },
  { table: "about", column: "page_copy", type: "TEXT" },
];

export function runMigrations(sqlite: Database.Database) {
  ensureBaseSchema(sqlite);

  for (const { table, column, type } of columnMigrations) {
    try {
      sqlite.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
    } catch {
      // Column already exists
    }
  }

  try {
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
  } catch {
    // bookings table may not exist on fresh databases
  }

  copyContactIntoSiteSettings(sqlite);
  fillAboutPageCopy(sqlite);
}

function parseContactList(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => String(item).trim()).filter(Boolean);
  } catch {
    return [];
  }
}

/** One-time copy: About phone/email lists become the site_settings contact record. */
function copyContactIntoSiteSettings(sqlite: Database.Database) {
  const settings = sqlite
    .prepare(
      `SELECT id, org_phone, org_email, contact_phones, contact_emails
       FROM site_settings LIMIT 1`
    )
    .get() as
    | {
        id: number;
        org_phone: string | null;
        org_email: string | null;
        contact_phones: string | null;
        contact_emails: string | null;
      }
    | undefined;

  if (!settings) return;
  if (settings.contact_phones != null && settings.contact_emails != null) return;

  const about = sqlite
    .prepare(`SELECT contact_phones, contact_emails FROM about LIMIT 1`)
    .get() as { contact_phones: string | null; contact_emails: string | null } | undefined;

  const phones =
    settings.contact_phones == null
      ? parseContactList(about?.contact_phones).length
        ? parseContactList(about?.contact_phones)
        : settings.org_phone?.trim()
          ? [settings.org_phone.trim()]
          : []
      : parseContactList(settings.contact_phones);

  const emails =
    settings.contact_emails == null
      ? parseContactList(about?.contact_emails).length
        ? parseContactList(about?.contact_emails)
        : settings.org_email?.trim()
          ? [settings.org_email.trim()]
          : []
      : parseContactList(settings.contact_emails);

  sqlite
    .prepare(
      `UPDATE site_settings
       SET contact_phones = ?, contact_emails = ?, org_phone = ?, org_email = ?
       WHERE id = ?`
    )
    .run(
      JSON.stringify(phones),
      JSON.stringify(emails),
      phones[0] || "",
      emails[0] || "",
      settings.id
    );
}

/** Fill empty About page copy with the sentences currently shown on the site. */
function fillAboutPageCopy(sqlite: Database.Database) {
  let rows: { id: number; short_name: string | null; page_copy: string | null }[] = [];
  try {
    rows = sqlite.prepare(`SELECT id, short_name, page_copy FROM about`).all() as {
      id: number;
      short_name: string | null;
      page_copy: string | null;
    }[];
  } catch {
    return;
  }

  const update = sqlite.prepare(`UPDATE about SET page_copy = ? WHERE id = ?`);
  for (const row of rows) {
    if (row.page_copy != null && row.page_copy.trim() !== "") continue;
    const copy = structuredClone(defaultAboutPageCopy);
    const name = row.short_name?.trim();
    if (name) copy.visionCredit = `${name}, Founder of PixelRoot Studio`;
    update.run(JSON.stringify(copy), row.id);
  }
}
