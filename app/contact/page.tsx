import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactContent } from "@/components/contact/contact-content";
import { getContactSettings } from "@/lib/db/queries";

export function generateMetadata(): Metadata {
  const contact = getContactSettings();
  const phone = contact.phones[0];
  const description = phone
    ? `Get in touch with PixelRoot Studio for fashion, wedding, corporate, commercial photography and cinematic video. Call ${phone} or send a message.`
    : "Get in touch with PixelRoot Studio for fashion, wedding, corporate, commercial photography and cinematic video. Send a message.";

  return {
    title: "Contact | PixelRoot Studio | Book a Session",
    description,
    alternates: { canonical: "/contact" },
  };
}

export const revalidate = 3600;

export default function ContactPage() {
  const contact = getContactSettings();

  return (
    <>
      <ContactHero />
      <ContactContent contact={contact} />
    </>
  );
}
