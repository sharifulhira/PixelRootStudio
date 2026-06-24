import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, galleryItems } from "@/lib/db";
import { getGalleryItems } from "@/lib/db/queries";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = getGalleryItems();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await request.json();
    
    const result = db.insert(galleryItems)
      .values({
        categoryId: data.categoryId || null,
        src: data.src,
        alt: data.alt,
        aspect: data.aspect || "landscape",
        featured: data.featured ?? true,
        sortOrder: data.sortOrder ?? 0,
        createdAt: new Date(),
      })
      .returning()
      .get();
    
    revalidatePath("/");
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating gallery item:", error);
    return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    
    db.update(galleryItems)
      .set({
        categoryId: data.categoryId,
        src: data.src,
        alt: data.alt,
        aspect: data.aspect,
        featured: data.featured,
        sortOrder: data.sortOrder,
      })
      .where(eq(galleryItems.id, data.id))
      .run();
    
    revalidatePath("/");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating gallery item:", error);
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    
    db.delete(galleryItems).where(eq(galleryItems.id, parseInt(id))).run();
    
    revalidatePath("/");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 });
  }
}
