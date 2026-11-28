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
    const experience = Array.isArray(data.experience)
      ? data.experience
          .map((item: { role?: string; company?: string; period?: string }) => ({
            role: String(item?.role || "").trim(),
            company: String(item?.company || "").trim(),
            period: String(item?.period || "").trim(),
          }))
          .filter((item: { role: string; company: string; period: string }) => item.role || item.company || item.period)
      : [];

    patchAbout(
      {
        bio: JSON.stringify(cleanList(data.bio)),
        skills: JSON.stringify(cleanList(data.skills)),
        experience: JSON.stringify(experience),
      },
      {
        skillsLabel: data.skillsLabel || "",
        journeyLabel: data.journeyLabel || "",
      }
    );
    revalidateAboutPages();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating experience section:", error);
    return NextResponse.json({ error: "Failed to update experience section" }, { status: 500 });
  }
}
