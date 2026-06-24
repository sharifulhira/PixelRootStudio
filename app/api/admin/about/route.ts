import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, about } from "@/lib/db";
import { getAbout } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = getAbout();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching about:", error);
    return NextResponse.json({ error: "Failed to fetch about" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await request.json();
    
    db.update(about)
      .set({
        name: data.name,
        shortName: data.shortName,
        title: data.title,
        tagline: data.tagline,
        bio: JSON.stringify(data.bio || []),
        vision: data.vision,
        stats: JSON.stringify(data.stats || []),
        skills: JSON.stringify(data.skills || []),
        experience: JSON.stringify(data.experience || []),
        photoSrc: data.photo,
        bannerSrc: data.bannerImage,
        contactPhones: JSON.stringify(data.contact?.phones || []),
        contactEmails: JSON.stringify(data.contact?.emails || []),
        updatedAt: new Date(),
      })
      .run();
    
    revalidatePath("/about");
    revalidatePath("/contact");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating about:", error);
    return NextResponse.json({ error: "Failed to update about" }, { status: 500 });
  }
}
