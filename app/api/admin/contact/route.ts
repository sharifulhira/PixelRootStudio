import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, siteSettings } from "@/lib/db";
import { getSiteSettings } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

function cleanList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean);
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = getSiteSettings();
    if (!settings) {
      return NextResponse.json({ error: "Settings not found" }, { status: 404 });
    }

    const phones = cleanList(settings.contactPhones ? JSON.parse(settings.contactPhones) : []);
    const emails = cleanList(settings.contactEmails ? JSON.parse(settings.contactEmails) : []);

    return NextResponse.json({
      phones: phones.length ? phones : settings.orgPhone ? [settings.orgPhone] : [],
      emails: emails.length ? emails : settings.orgEmail ? [settings.orgEmail] : [],
      address: settings.orgAddress || "",
      socialFacebook: settings.socialFacebook || "",
      socialInstagram: settings.socialInstagram || "",
      socialYoutube: settings.socialYoutube || "",
      socialLinkedin: settings.socialLinkedin || "",
      socialTiktok: settings.socialTiktok || "",
      twitterHandle: settings.twitterHandle || "",
      socialTitle: settings.socialTitle || "",
      socialSubtitle: settings.socialSubtitle || "",
    });
  } catch (error) {
    console.error("Error fetching contact settings:", error);
    return NextResponse.json({ error: "Failed to fetch contact settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const phones = cleanList(data.phones);
    const emails = cleanList(data.emails);

    db.update(siteSettings)
      .set({
        contactPhones: JSON.stringify(phones),
        contactEmails: JSON.stringify(emails),
        orgPhone: phones[0] || "",
        orgEmail: emails[0] || "",
        orgAddress: typeof data.address === "string" ? data.address.trim() : "",
        socialFacebook: data.socialFacebook || "",
        socialInstagram: data.socialInstagram || "",
        socialYoutube: data.socialYoutube || "",
        socialLinkedin: data.socialLinkedin || "",
        socialTiktok: data.socialTiktok || "",
        twitterHandle: data.twitterHandle || "",
        socialTitle: data.socialTitle || "",
        socialSubtitle: data.socialSubtitle || "",
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
    console.error("Error updating contact settings:", error);
    return NextResponse.json({ error: "Failed to update contact settings" }, { status: 500 });
  }
}
