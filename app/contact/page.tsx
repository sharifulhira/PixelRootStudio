import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactContent } from "@/components/contact/contact-content";
import { getAbout } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Contact — PixelRoot Studio | Book a Session",
  description:
    "Get in touch with PixelRoot Studio for fashion, wedding, corporate, commercial photography and cinematic video. Call +880 1731-722808 or send a message.",
  alternates: { canonical: "/contact" },
};

export const revalidate = 3600;

export default function ContactPage() {
  const aboutData = getAbout();

  return (
    <>
      <ContactHero />
      <ContactContent contact={aboutData?.contact || { phones: [], emails: [] }} />
    </>
  );
}
