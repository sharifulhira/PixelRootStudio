import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, hero } from "@/lib/db";
import { getHero } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = getHero();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching hero:", error);
    return NextResponse.json({ error: "Failed to fetch hero" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await request.json();
    
    db.update(hero)
      .set({
        badge: data.badge,
        headline: JSON.stringify(data.headline),
        subheadline: data.subheadline,
        ctaPrimaryLabel: data.cta?.primary?.label,
        ctaPrimaryHref: data.cta?.primary?.href,
        ctaSecondaryLabel: data.cta?.secondary?.label,
        ctaSecondaryHref: data.cta?.secondary?.href,
        stats: JSON.stringify(data.stats),
        services: JSON.stringify(data.services),
        imageSrc: data.image?.src,
        imageAlt: data.image?.alt,
        videoUrl: data.videoUrl,
        videoTitle: data.videoTitle,
        videoSubtitle: data.videoSubtitle,
        updatedAt: new Date(),
      })
      .run();
    
    revalidatePath("/");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating hero:", error);
    return NextResponse.json({ error: "Failed to update hero" }, { status: 500 });
  }
}
