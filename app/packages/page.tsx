import { getActivePackages } from "@/lib/db/queries";
import { PackagesPageClient } from "@/components/packages/packages-page-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Photography Packages | PixelRoot Studio",
  description: "Premium photography packages for weddings, corporate events, fashion shoots, and more. Book your session today.",
};

export default function PackagesPage() {
  const packages = getActivePackages();

  const categories = Array.from(new Set(packages.map((p) => p.category)));

  return <PackagesPageClient packages={packages} categories={categories} />;
}
