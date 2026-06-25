import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { packages, packageSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = db.select().from(packages).orderBy(packages.sortOrder).all();
    const settings = db.select().from(packageSettings).get();

    return NextResponse.json({
      settings: settings || { title: "Our Packages", subtitle: "", ctaLabel: "View All Packages", ctaHref: "/packages" },
      items: items.map((pkg) => ({
        ...pkg,
        features: pkg.features ? JSON.parse(pkg.features) : [],
      })),
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    db.insert(packages)
      .values({
        name: data.name,
        slug: data.slug,
        category: data.category,
        shortDescription: data.shortDescription,
        description: data.description,
        features: JSON.stringify(data.features || []),
        price: data.price,
        priceLabel: data.priceLabel,
        currency: data.currency || "BDT",
        duration: data.duration,
        deliverables: data.deliverables,
        popular: data.popular ?? false,
        active: data.active ?? true,
        imageSrc: data.imageSrc,
        sortOrder: data.sortOrder ?? 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .run();

    revalidatePath("/");
    revalidatePath("/packages");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 });
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
      const existing = db.select().from(packageSettings).get();
      if (existing) {
        db.update(packageSettings)
          .set({
            title: data.title,
            subtitle: data.subtitle,
            ctaLabel: data.ctaLabel,
            ctaHref: data.ctaHref,
            updatedAt: new Date(),
          })
          .run();
      } else {
        db.insert(packageSettings)
          .values({
            title: data.title,
            subtitle: data.subtitle,
            ctaLabel: data.ctaLabel,
            ctaHref: data.ctaHref,
          })
          .run();
      }
    } else {
      db.update(packages)
        .set({
          name: data.name,
          slug: data.slug,
          category: data.category,
          shortDescription: data.shortDescription,
          description: data.description,
          features: JSON.stringify(data.features || []),
          price: data.price,
          priceLabel: data.priceLabel,
          currency: data.currency || "BDT",
          duration: data.duration,
          deliverables: data.deliverables,
          popular: data.popular ?? false,
          active: data.active ?? true,
          imageSrc: data.imageSrc,
          sortOrder: data.sortOrder ?? 0,
          updatedAt: new Date(),
        })
        .where(eq(packages.id, data.id))
        .run();
    }

    revalidatePath("/");
    revalidatePath("/packages");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating package:", error);
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 });
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

    db.delete(packages).where(eq(packages.id, parseInt(id))).run();

    revalidatePath("/");
    revalidatePath("/packages");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 });
  }
}
