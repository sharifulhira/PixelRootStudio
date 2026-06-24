import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { gear, gearSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = db.select().from(gear).orderBy(gear.sortOrder, gear.id).all();
    const settings = db.select().from(gearSettings).get();

    return NextResponse.json({
      settings: settings || { title: "Our Gear", subtitle: "" },
      items: items.map((g) => ({
        id: g.id,
        name: g.name,
        category: g.category,
        description: g.description || "",
        imageSrc: g.imageSrc || "",
        featured: g.featured ?? false,
        sortOrder: g.sortOrder ?? 0,
      })),
    });
  } catch (error) {
    console.error("Error fetching gear:", error);
    return NextResponse.json({ error: "Failed to fetch gear" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    db.insert(gear)
      .values({
        name: data.name,
        category: data.category,
        description: data.description,
        imageSrc: data.imageSrc,
        featured: data.featured ?? false,
        sortOrder: data.sortOrder ?? 0,
        createdAt: new Date(),
      })
      .run();

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating gear:", error);
    return NextResponse.json({ error: "Failed to create gear" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    if (data.type === "settings") {
      const existing = db.select().from(gearSettings).get();
      if (existing) {
        db.update(gearSettings)
          .set({
            title: data.title,
            subtitle: data.subtitle,
            updatedAt: new Date(),
          })
          .run();
      } else {
        db.insert(gearSettings)
          .values({
            title: data.title,
            subtitle: data.subtitle,
          })
          .run();
      }
    } else {
      db.update(gear)
        .set({
          name: data.name,
          category: data.category,
          description: data.description,
          imageSrc: data.imageSrc,
          featured: data.featured ?? false,
          sortOrder: data.sortOrder ?? 0,
        })
        .where(eq(gear.id, data.id))
        .run();
    }

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating gear:", error);
    return NextResponse.json({ error: "Failed to update gear" }, { status: 500 });
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
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    db.delete(gear).where(eq(gear.id, parseInt(id))).run();

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gear:", error);
    return NextResponse.json({ error: "Failed to delete gear" }, { status: 500 });
  }
}
