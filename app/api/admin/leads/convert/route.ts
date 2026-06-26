import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { bookings, leads, packages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const serviceToEventType: Record<string, string> = {
  "Fashion & Editorial": "fashion",
  Weddings: "wedding",
  "Corporate Events": "corporate",
  "Commercial Product": "product",
  "Cinematic Video": "other",
  "Model Portfolios": "fashion",
};

function buildBookingMessage(lead: { service: string | null; message: string }) {
  const parts: string[] = [];
  if (lead.service) parts.push(`Service interest: ${lead.service}`);
  parts.push(lead.message);
  parts.push("\n— Converted from contact form lead");
  return parts.join("\n\n");
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const leadId = data.leadId;

    if (!leadId) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    const lead = db.select().from(leads).where(eq(leads.id, leadId)).get();
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const existing = db
      .select({ id: bookings.id })
      .from(bookings)
      .where(eq(bookings.leadId, leadId))
      .get();

    if (existing) {
      return NextResponse.json(
        { error: "This lead was already converted to a booking", bookingId: existing.id },
        { status: 409 }
      );
    }

    let packageName = data.packageName || null;
    const packageId = data.packageId || null;

    if (packageId && !packageName) {
      const pkg = db
        .select({ name: packages.name })
        .from(packages)
        .where(eq(packages.id, packageId))
        .get();
      packageName = pkg?.name || null;
    }

    const eventType =
      data.eventType ||
      (lead.service ? serviceToEventType[lead.service] || "other" : null);

    const result = db
      .insert(bookings)
      .values({
        leadId,
        packageId,
        packageName: packageName || lead.service || "Custom Inquiry",
        clientName: lead.name,
        email: lead.email || "",
        phone: lead.phone,
        eventDate: data.eventDate || null,
        eventType,
        message: buildBookingMessage(lead),
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .run();

    db.update(leads)
      .set({ status: "converted", updatedAt: new Date() })
      .where(eq(leads.id, leadId))
      .run();

    return NextResponse.json({
      success: true,
      bookingId: result.lastInsertRowid,
    });
  } catch (error) {
    console.error("Error converting lead to booking:", error);
    return NextResponse.json({ error: "Failed to convert lead" }, { status: 500 });
  }
}
