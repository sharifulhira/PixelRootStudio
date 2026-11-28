import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { patchAbout, revalidateAboutPages } from "@/lib/about/save";

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await request.json();
    const teamPage = data.teamPage || {};

    patchAbout(
      {},
      {
        teamBadge: data.teamBadge || "",
        teamTitle: data.teamTitle || "",
        teamSubtitle: data.teamSubtitle || "",
        teamPage: {
          eyebrow: teamPage.eyebrow || "",
          title: teamPage.title || "",
          subtitle: teamPage.subtitle || "",
          primaryLabel: teamPage.primaryLabel || "",
          primaryHref: teamPage.primaryHref || "",
          secondaryLabel: teamPage.secondaryLabel || "",
          secondaryHref: teamPage.secondaryHref || "",
          closingTitle: teamPage.closingTitle || "",
          closingText: teamPage.closingText || "",
          closingButtonLabel: teamPage.closingButtonLabel || "",
          closingButtonHref: teamPage.closingButtonHref || "",
        },
      }
    );
    revalidateAboutPages();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating team section:", error);
    return NextResponse.json({ error: "Failed to update team section" }, { status: 500 });
  }
}
