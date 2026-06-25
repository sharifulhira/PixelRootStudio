import type { Metadata } from "next";
import Link from "next/link";
import { TeamPageHero } from "@/components/team/team-page-hero";
import { TeamSection } from "@/components/about/team-section";
import { getTeamMembers } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Our Team — PixelRoot Studio",
  description:
    "Meet the creative team at PixelRoot Studio — photographers, videographers, and visual storytellers dedicated to uncompromising quality.",
  alternates: { canonical: "/team" },
};

export const revalidate = 3600;

export default function TeamPage() {
  const teamData = getTeamMembers();

  return (
    <>
      <TeamPageHero />
      <TeamSection
        teamData={teamData}
        showHeader={false}
      />
      <section className="py-14 sm:py-16 bg-[color:var(--bg)] border-t border-[color:var(--border)]">
        <div className="px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto text-center">
          <h2 className="hero-headline text-xl sm:text-2xl font-bold text-[color:var(--text)] mb-3">
            Ready to create something exceptional?
          </h2>
          <p className="text-sm text-[color:var(--muted)] max-w-md mx-auto mb-6">
            Our team is ready to bring your vision to life with cinematic precision and modern luxury aesthetics.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[color:var(--primary)] hover:opacity-90 text-white text-sm font-semibold rounded-full transition-opacity"
          >
            Get in Touch
            <svg viewBox="0 0 12 12" className="w-3.5 h-3.5" fill="none" aria-hidden="true">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
