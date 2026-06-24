import type { Metadata } from "next";
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid";
import projectsData from "@/data/projects.json";
import categoriesData from "@/data/categories.json";

export const metadata: Metadata = {
  title: "Portfolio — PixelRoot Studio",
  description:
    "Browse our portfolio of professional photography projects. Fashion, weddings, corporate events, commercial product photography, and cinematic video coverage.",
  alternates: { canonical: "/portfolio" },
};

const portfolioCategories = categoriesData.map((cat) => ({
  id: cat.id,
  name: cat.name,
  slug: cat.id,
}));

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const params = await searchParams;

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

        <PortfolioGrid
          projects={projectsData}
          categories={portfolioCategories}
          initialFilter={params?.cat || "all"}
        />
      </div>
    </section>
  );
}
