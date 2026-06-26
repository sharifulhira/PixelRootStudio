import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.name || !data.phone || !data.message) {
      return NextResponse.json(
        { error: "Name, phone number, and message are required" },
        { status: 400 }
      );
    }

    db.insert(leads)
      .values({
        name: data.name,
        phone: data.phone,
        email: data.email?.trim() || "",
        service: data.service || null,
        message: data.message,
        status: "new",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .run();

    return NextResponse.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
