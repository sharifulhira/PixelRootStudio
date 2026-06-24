import type { Metadata } from "next";
import { AboutIntro } from "@/components/about/about-intro";
import { TeamSection } from "@/components/about/team-section";
import { ServicesCta } from "@/components/about/services-cta";
import { getAbout, getTeamMembers } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "About — PixelRoot Studio | Md Shariful Haque Hira",
  description:
    "Meet Md Shariful Haque Hira — founder of PixelRoot Studio. 15+ years of experience across fashion, weddings, corporate events, commercial product photography and cinematic video.",
  alternates: { canonical: "/about" },
};

export const revalidate = 3600;

export default function AboutPage() {
  const aboutData = getAbout();
  const teamData = getTeamMembers();

  if (!aboutData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AboutIntro aboutData={aboutData} />
      <TeamSection teamData={teamData} />
      <ServicesCta />
    </>
  );
}
