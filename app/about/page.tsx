import type { Metadata } from "next";
import { AboutIntro } from "@/components/about/about-intro";
import { TeamSection } from "@/components/about/team-section";
import { ServicesCta } from "@/components/about/services-cta";
import { getAbout, getTeamMembers, getContactSettings } from "@/lib/db/queries";

export function generateMetadata(): Metadata {
  const about = getAbout();
  return {
    title: about?.pageCopy.seoTitle || "About | PixelRoot Studio",
    description: about?.pageCopy.seoDescription || "",
    alternates: { canonical: "/about" },
  };
}

export const revalidate = 3600;

export default function AboutPage() {
  const aboutData = getAbout();
  const teamData = getTeamMembers();
  const contact = getContactSettings();

  if (!aboutData) {
    return <div>Loading...</div>;
  }

  const copy = aboutData.pageCopy;

  return (
    <>
      <AboutIntro aboutData={aboutData} contact={contact} />
      <TeamSection
        teamData={teamData}
        badge={copy.teamBadge}
        title={copy.teamTitle}
        subtitle={copy.teamSubtitle}
      />
      <ServicesCta phone={contact.phones[0]} email={contact.emails[0]} cta={copy.cta} />
    </>
  );
}
