import type { Metadata } from "next";
import Link from "next/link";
import { TeamPageHero } from "@/components/team/team-page-hero";
import { TeamSection } from "@/components/about/team-section";
import { getAbout, getTeamMembers } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Our Team | PixelRoot Studio",
  description: "Meet the PixelRoot Studio team: photographers and filmmakers.",
  alternates: { canonical: "/team" },
};

export const revalidate = 3600;

export default function TeamPage() {
  const teamData = getTeamMembers();
  const about = getAbout();
  const page = about?.pageCopy.teamPage;

  return (
    <>
      <TeamPageHero
        eyebrow={page?.eyebrow || ""}
        title={page?.title || ""}
        subtitle={page?.subtitle || ""}
        primaryLabel={page?.primaryLabel || ""}
        primaryHref={page?.primaryHref || "/contact"}
        secondaryLabel={page?.secondaryLabel || ""}
        secondaryHref={page?.secondaryHref || "/about"}
      />
      <TeamSection teamData={teamData} showHeader={false} />
      {(page?.closingTitle || page?.closingText || page?.closingButtonLabel) && (
      <section className="py-14 sm:py-16 bg-[color:var(--bg)] border-t border-[color:var(--border)]">
        <div className="px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto text-center">
          {page?.closingTitle && (
            <h2 className="hero-headline text-xl sm:text-2xl font-bold text-[color:var(--text)] mb-3">
              {page.closingTitle}
            </h2>
          )}
          {page?.closingText && (
            <p className="text-sm text-[color:var(--muted)] max-w-md mx-auto mb-6">
              {page.closingText}
            </p>
          )}
          {page?.closingButtonLabel && (
            <Link
              href={page.closingButtonHref || "/contact"}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[color:var(--primary)] hover:opacity-90 text-white text-sm font-semibold rounded-full transition-opacity"
            >
              {page.closingButtonLabel}
              <svg viewBox="0 0 12 12" className="w-3.5 h-3.5" fill="none" aria-hidden="true">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}
        </div>
      </section>
      )}
    </>
  );
}
