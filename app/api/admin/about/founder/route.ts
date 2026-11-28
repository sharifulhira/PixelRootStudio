import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { patchAbout, revalidateAboutPages } from "@/lib/about/save";

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await request.json();
    patchAbout(
      {
        name: data.name || "",
        shortName: data.shortName || "",
        title: data.title || "",
        tagline: data.tagline || "",
        photoSrc: data.photo || "",
        bannerSrc: data.bannerImage || "",
      },
      {
        bannerEyebrow: data.bannerEyebrow || "",
        bannerHeadline: data.bannerHeadline || "",
        bannerImageAlt: data.bannerImageAlt || "",
        founderBadge: data.founderBadge || "",
        bioEyebrow: data.bioEyebrow || "",
      }
    );
    revalidateAboutPages();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating founder section:", error);
    return NextResponse.json({ error: "Failed to update founder section" }, { status: 500 });
  }
}
