import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.-]/g, "")
    .replace(/--+/g, "-");
}

function sanitizePath(folderPath: string): string {
  // Prevent directory traversal
  return folderPath
    .split("/")
    .filter(part => part && part !== ".." && part !== ".")
    .join("/");
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null;
    const customFilename = formData.get("filename") as string | null;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}` },
        { status: 400 }
      );
    }
    
    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${MAX_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }
    
    // Determine filename
    const ext = file.name.split(".").pop() || "jpg";
    const baseName = customFilename 
      ? sanitizeFilename(customFilename)
      : sanitizeFilename(file.name.replace(/\.[^/.]+$/, ""));
    const filename = `${baseName}-${Date.now()}.${ext}`;
    
    // Determine folder path
    const sanitizedFolder = folder ? sanitizePath(folder) : "misc";
    const uploadDir = path.join(process.cwd(), "public", "uploads", sanitizedFolder);
    
    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Write file
    const filePath = path.join(uploadDir, filename);
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));
    
    // Return the public URL
    const publicPath = `/uploads/${sanitizedFolder}/${filename}`;
    
    return NextResponse.json({
      success: true,
      path: publicPath,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
