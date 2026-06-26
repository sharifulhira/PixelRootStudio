import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { runMigrations } from "./migrate";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "pixelroot.db");

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");
runMigrations(sqlite);

export const db = drizzle(sqlite, { schema });

export * from "./schema";
