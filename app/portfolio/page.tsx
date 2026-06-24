import type { Metadata } from "next";
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid";
import { getProjects, getPortfolioCategories } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Portfolio — PixelRoot Studio",
  description:
    "Browse our portfolio of professional photography projects. Fashion, weddings, corporate events, commercial product photography, and cinematic video coverage.",
  alternates: { canonical: "/portfolio" },
};

export const revalidate = 3600;

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const params = await searchParams;
  const projects = getProjects();
  const categories = getPortfolioCategories();

  return (
    <section className="py-14 sm:py-20 bg-[color:var(--bg)]">
      <div className="px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto">
        <div className="mb-10 sm:mb-12">
          <span className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-[color:var(--primary)] mb-2">
            Our Work
          </span>
          <h1 className="hero-headline text-[clamp(1.75rem,5vw,2.8rem)] font-bold text-[color:var(--text)] leading-tight tracking-[-0.02em]">
            Portfolio
          </h1>
          <p className="mt-3 text-sm text-[color:var(--muted)] max-w-lg leading-relaxed">
            Explore our collection of professional photography and cinematic video projects — each crafted with precision, artistry, and uncompromising quality.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 sm:py-24 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)]">
            <p className="hero-headline text-xl sm:text-2xl font-bold text-[color:var(--text)] mb-2">
              Projects Coming Soon
            </p>
            <p className="text-sm text-[color:var(--muted)] max-w-md mx-auto leading-relaxed px-4">
              Portfolio projects are being prepared. Check back shortly or contact us to discuss your project.
            </p>
          </div>
        ) : (
          <PortfolioGrid
            projects={projects}
            categories={categories}
            initialFilter={params?.cat || "all"}
          />
        )}
      </div>
    </section>
  );
}
