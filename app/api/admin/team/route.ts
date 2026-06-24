import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, teamMembers } from "@/lib/db";
import { getTeamMembers } from "@/lib/db/queries";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = getTeamMembers();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await request.json();
    
    const result = db.insert(teamMembers)
      .values({
        name: data.name,
        role: data.role,
        bio: data.bio,
        photoSrc: data.photo,
        isFounder: data.isFounder ?? false,
        sortOrder: data.sortOrder ?? 0,
        createdAt: new Date(),
      })
      .returning()
      .get();
    
    revalidatePath("/about");
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
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
    
    // Extract numeric ID from string like "t1"
    const numericId = typeof data.id === "string" && data.id.startsWith("t") 
      ? parseInt(data.id.slice(1)) 
      : parseInt(data.id);
    
    db.update(teamMembers)
      .set({
        name: data.name,
        role: data.role,
        bio: data.bio,
        photoSrc: data.photo,
        isFounder: data.isFounder,
        sortOrder: data.sortOrder,
      })
      .where(eq(teamMembers.id, numericId))
      .run();
    
    revalidatePath("/about");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
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
    
    // Extract numeric ID from string like "t1"
    const numericId = id.startsWith("t") ? parseInt(id.slice(1)) : parseInt(id);
    
    db.delete(teamMembers).where(eq(teamMembers.id, numericId)).run();
    
    revalidatePath("/about");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 });
  }
}
