import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, siteSettings } from "@/lib/db";
import { getSiteSettings } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = getSiteSettings();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching SEO settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await request.json();
    
    db.update(siteSettings)
      .set({
        siteName: data.siteName,
        siteUrl: data.siteUrl,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        locale: data.locale,
        twitterHandle: data.twitterHandle,
        keywords: JSON.stringify(data.keywords || []),
        orgName: data.orgName,
        orgEmail: data.orgEmail,
        orgPhone: data.orgPhone,
        orgAddress: data.orgAddress,
        socialFacebook: data.socialFacebook,
        socialInstagram: data.socialInstagram,
        socialYoutube: data.socialYoutube,
        socialLinkedin: data.socialLinkedin,
        socialTiktok: data.socialTiktok,
        socialTitle: data.socialTitle,
        socialSubtitle: data.socialSubtitle,
        logo: data.logo,
        favicon: data.favicon,
        ogImage: data.ogImage,
        updatedAt: new Date(),
      })
      .run();
    
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/portfolio");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating SEO settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
