import type { Metadata } from "next";
import { AboutIntro } from "@/components/about/about-intro";
import { TeamSection } from "@/components/about/team-section";
import { ServicesCta } from "@/components/about/services-cta";
import { client } from "@/sanity/lib/client";
import { aboutQuery, teamQuery } from "@/sanity/lib/queries";
import defaultAboutData from "@/data/about.json";
import defaultTeamData from "@/data/team.json";

export const metadata: Metadata = {
  title: "About — PixelRoot Studio | Md Shariful Haque Hira",
  description:
    "Meet Md Shariful Haque Hira — founder of PixelRoot Studio. 15+ years of experience across fashion, weddings, corporate events, commercial product photography and cinematic video.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const sanityAboutData = await client.fetch(aboutQuery).catch(() => null);
  const sanityTeamData = await client.fetch(teamQuery).catch(() => null);

  const aboutData = (sanityAboutData && sanityAboutData.name) ? sanityAboutData : defaultAboutData;
  const teamData = (sanityTeamData && sanityTeamData.length > 0) ? sanityTeamData : defaultTeamData;

  return (
    <>
      <AboutIntro aboutData={aboutData} />
      <TeamSection teamData={teamData} />
      <ServicesCta />
    </>
  );
}
