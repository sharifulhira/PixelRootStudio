import { getPackageBySlug, getActivePackages } from "@/lib/db/queries";
import { PackageDetailClient } from "@/components/packages/package-detail-client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);
  if (!pkg) return { title: "Package Not Found" };

  return {
    title: `${pkg.name} | PixelRoot Studio`,
    description: pkg.shortDescription || pkg.description || `${pkg.name} photography package`,
  };
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (slug === "custom-inquiry") {
    return <PackageDetailClient pkg={null} isCustomInquiry />;
  }

  const pkg = getPackageBySlug(slug);
  if (!pkg) notFound();

  const relatedPackages = getActivePackages()
    .filter((p) => p.category === pkg.category && p.id !== pkg.id)
    .slice(0, 2);

  return <PackageDetailClient pkg={pkg} relatedPackages={relatedPackages} />;
}
