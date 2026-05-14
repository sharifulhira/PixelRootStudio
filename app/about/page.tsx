import type { Metadata } from "next";
import { AboutIntro } from "@/components/about/about-intro";
import { TeamSection } from "@/components/about/team-section";
import { ServicesCta } from "@/components/about/services-cta";

export const metadata: Metadata = {
  title: "About — Hira Photography | Md Shariful Haque Hira",
  description:
    "Meet Md Shariful Haque Hira — founder of Hira Photography. 15+ years of experience across fashion, weddings, corporate events, commercial product photography and cinematic video.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <AboutIntro />
      <TeamSection />
      <ServicesCta />
    </>
  );
}
