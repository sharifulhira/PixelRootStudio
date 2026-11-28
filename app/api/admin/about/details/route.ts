import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { patchAbout, revalidateAboutPages } from "@/lib/about/save";

function cleanList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean);
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await request.json();
    const stats = Array.isArray(data.stats)
      ? data.stats
          .map((item: { value?: string; label?: string }) => ({
            value: String(item?.value || "").trim(),
            label: String(item?.label || "").trim(),
          }))
          .filter((item: { value: string; label: string }) => item.value || item.label)
      : [];
    const cta = data.cta || {};

    patchAbout(
      {
        vision: data.vision || "",
        stats: JSON.stringify(stats),
      },
      {
        visionEyebrow: data.visionEyebrow || "",
        visionCredit: data.visionCredit || "",
        seoTitle: data.seoTitle || "",
        seoDescription: data.seoDescription || "",
        cta: {
          services: cleanList(cta.services),
          headline: cta.headline || "",
          headlineAccent: cta.headlineAccent || "",
          subtext: cta.subtext || "",
          primaryLabel: cta.primaryLabel || "",
          primaryHref: cta.primaryHref || "",
          secondaryLabel: cta.secondaryLabel || "",
          secondaryHref: cta.secondaryHref || "",
          image: cta.image || "",
        },
      }
    );
    revalidateAboutPages();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating about details:", error);
    return NextResponse.json({ error: "Failed to update about details" }, { status: 500 });
  }
}
