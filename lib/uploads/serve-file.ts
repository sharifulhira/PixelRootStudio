import { existsSync } from "fs";
import { readFile } from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export function resolveUploadPath(segments: string[]): string | null {
  if (!segments.length || segments.some((s) => s === ".." || s === ".")) {
    return null;
  }

  const filePath = path.join(UPLOAD_ROOT, ...segments);
  const resolved = path.resolve(filePath);

  if (!resolved.startsWith(path.resolve(UPLOAD_ROOT) + path.sep)) {
    return null;
  }

  if (!existsSync(resolved)) {
    return null;
  }

  return resolved;
}

export async function readUploadFile(segments: string[]) {
  const resolved = resolveUploadPath(segments);
  if (!resolved) return null;

  const ext = path.extname(resolved).toLowerCase();
  const contentType = MIME[ext] || "application/octet-stream";
  const body = await readFile(resolved);

  return { body, contentType };
}
