import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { leads, bookings } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = db.select().from(leads).orderBy(desc(leads.createdAt)).all();
    const converted = db
      .select({ leadId: bookings.leadId, bookingId: bookings.id })
      .from(bookings)
      .all()
      .filter((b) => b.leadId != null);

    const bookingByLeadId = Object.fromEntries(
      converted.map((b) => [b.leadId!, b.bookingId])
    );

    return NextResponse.json({
      items: items.map((lead) => ({
        ...lead,
        bookingId: bookingByLeadId[lead.id] ?? null,
      })),
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    db.update(leads)
      .set({
        status: data.status,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, data.id))
      .run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
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

    db.delete(leads).where(eq(leads.id, parseInt(id))).run();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
