import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { corporateClients, corporateClientsSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = db
      .select()
      .from(corporateClients)
      .orderBy(corporateClients.sortOrder, corporateClients.id)
      .all();
    const settings = db.select().from(corporateClientsSettings).get();

    return NextResponse.json({
      settings: settings || {
        title: "Trusted by Leading Brands",
        subtitle: "Corporate clients who trust PixelRoot Studio with their visual story.",
      },
      items: items.map((c) => ({
        id: c.id,
        name: c.name,
        logoSrc: c.logoSrc,
        websiteUrl: c.websiteUrl || "",
        published: c.published ?? true,
        sortOrder: c.sortOrder ?? 0,
      })),
    });
  } catch (error) {
    console.error("Error fetching corporate clients:", error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    if (!data.name?.trim() || !data.logoSrc?.trim()) {
      return NextResponse.json({ error: "Name and logo are required" }, { status: 400 });
    }

    db.insert(corporateClients)
      .values({
        name: data.name.trim(),
        logoSrc: data.logoSrc.trim(),
        websiteUrl: data.websiteUrl?.trim() || null,
        published: data.published ?? true,
        sortOrder: data.sortOrder ?? 0,
        createdAt: new Date(),
      })
      .run();

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating corporate client:", error);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
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
      const existing = db.select().from(corporateClientsSettings).get();
      if (existing) {
        db.update(corporateClientsSettings)
          .set({
            title: data.title,
            subtitle: data.subtitle,
            updatedAt: new Date(),
          })
          .where(eq(corporateClientsSettings.id, existing.id))
          .run();
      } else {
        db.insert(corporateClientsSettings)
          .values({
            title: data.title,
            subtitle: data.subtitle,
          })
          .run();
      }
    } else {
      if (!data.id) {
        return NextResponse.json({ error: "Client ID required" }, { status: 400 });
      }
      if (!data.name?.trim() || !data.logoSrc?.trim()) {
        return NextResponse.json({ error: "Name and logo are required" }, { status: 400 });
      }

      db.update(corporateClients)
        .set({
          name: data.name.trim(),
          logoSrc: data.logoSrc.trim(),
          websiteUrl: data.websiteUrl?.trim() || null,
          published: data.published ?? true,
          sortOrder: data.sortOrder ?? 0,
        })
        .where(eq(corporateClients.id, data.id))
        .run();
    }

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating corporate client:", error);
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
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

    db.delete(corporateClients).where(eq(corporateClients.id, parseInt(id))).run();

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting corporate client:", error);
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }
}
