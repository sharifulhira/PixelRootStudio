import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, categories } from "@/lib/db";
import { getCategories } from "@/lib/db/queries";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = getCategories();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await request.json();
    
    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    
    const result = db.insert(categories)
      .values({
        name: data.name,
        slug,
        description: data.description,
        imageSrc: data.imageSrc,
        color: data.color,
        featured: data.featured ?? true,
        sortOrder: data.sortOrder ?? 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
      .get();
    
    revalidatePath("/");
    revalidatePath("/portfolio");
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
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
    
    db.update(categories)
      .set({
        name: data.name,
        slug: data.slug,
        description: data.description,
        imageSrc: data.imageSrc,
        color: data.color,
        featured: data.featured,
        sortOrder: data.sortOrder,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, data.id))
      .run();
    
    revalidatePath("/");
    revalidatePath("/portfolio");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
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
    
    db.delete(categories).where(eq(categories.id, parseInt(id))).run();
    
    revalidatePath("/");
    revalidatePath("/portfolio");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
