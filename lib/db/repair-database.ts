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
