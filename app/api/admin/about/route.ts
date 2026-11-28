import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAbout } from "@/lib/db/queries";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = getAbout();
    if (!data) {
      return NextResponse.json({ error: "About record not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching about:", error);
    return NextResponse.json({ error: "Failed to fetch about" }, { status: 500 });
  }
}
