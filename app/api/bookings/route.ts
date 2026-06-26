import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings, packages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.clientName || !data.phone) {
      return NextResponse.json(
        { error: "Name and phone number are required" },
        { status: 400 }
      );
    }

    let packageName = data.packageName || null;

    if (data.packageId && !packageName) {
      const pkg = db
        .select({ name: packages.name })
        .from(packages)
        .where(eq(packages.id, data.packageId))
        .get();
      packageName = pkg?.name || null;
    }

    db.insert(bookings)
      .values({
        packageId: data.packageId || null,
        packageName,
        clientName: data.clientName,
        email: data.email?.trim() || "",
        phone: data.phone,
        eventDate: data.eventDate || null,
        eventType: data.eventType || null,
        message: data.message || null,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .run();

    return NextResponse.json({ success: true, message: "Booking submitted successfully!" });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to submit booking" },
      { status: 500 }
    );
  }
}
