import { revalidatePath } from "next/cache";
import { db, about } from "@/lib/db";
import { applyPageCopyPatch, mergeAboutPageCopy, type AboutPageCopy } from "@/lib/about/page-copy";

type AboutColumns = {
  name?: string;
  shortName?: string;
  title?: string;
  tagline?: string;
  bio?: string;
  vision?: string;
  stats?: string;
  skills?: string;
  experience?: string;
  photoSrc?: string;
  bannerSrc?: string;
};

export function patchAbout(columns: AboutColumns, copyPatch: Partial<AboutPageCopy>) {
  const row = db.select().from(about).get();
  if (!row) throw new Error("About record missing");

  const current = mergeAboutPageCopy(row.pageCopy, row.shortName);
  const next = applyPageCopyPatch(current, copyPatch);

  db.update(about)
    .set({
      ...columns,
      pageCopy: JSON.stringify(next),
      updatedAt: new Date(),
    })
    .run();
}

export function revalidateAboutPages() {
  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/team");
}
