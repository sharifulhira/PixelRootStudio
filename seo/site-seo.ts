import { getSiteSeo as getSiteSeoFromDb } from "@/lib/db/queries";

type SeoData = {
  siteName: string;
  siteUrl: string;
  title: string;
  description: string;
  locale: string;
  twitterHandle: string;
  keywords: string[];
  logo?: string;
  favicon?: string;
  ogImage?: string;
  organization: {
    name: string;
    email: string;
    telephone: string;
    address?: string;
  };
  social?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
};

export function getSiteSeo(): SeoData {
  return getSiteSeoFromDb();
}

export function getHomeJsonLd() {
  const siteSeo = getSiteSeo();

  const socialLinks = [
    siteSeo.social?.facebook,
    siteSeo.social?.instagram,
    siteSeo.social?.youtube,
    siteSeo.social?.linkedin,
  ].filter(Boolean);

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteSeo.siteName,
      url: siteSeo.siteUrl,
      description: siteSeo.description,
      inLanguage: "en",
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteSeo.siteUrl}/portfolio?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${siteSeo.siteUrl}/#organization`,
      name: siteSeo.organization.name || siteSeo.siteName,
      url: siteSeo.siteUrl,
      description: siteSeo.description,
      email: siteSeo.organization.email,
      telephone: siteSeo.organization.telephone,
      address: siteSeo.organization.address
        ? {
            "@type": "PostalAddress",
            streetAddress: siteSeo.organization.address,
          }
        : undefined,
      sameAs: socialLinks.length > 0 ? socialLinks : undefined,
      priceRange: "$$",
      image: siteSeo.ogImage || `${siteSeo.siteUrl}/og-image.jpg`,
      serviceType: [
        "Photography",
        "Wedding Photography",
        "Fashion Photography",
        "Corporate Event Photography",
        "Commercial Product Photography",
        "Cinematic Video Production",
      ],
    },
  ];
}

export function getLocalBusinessJsonLd() {
  const siteSeo = getSiteSeo();

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteSeo.organization.name || siteSeo.siteName,
    url: siteSeo.siteUrl,
    telephone: siteSeo.organization.telephone,
    email: siteSeo.organization.email,
    address: siteSeo.organization.address
      ? {
          "@type": "PostalAddress",
          streetAddress: siteSeo.organization.address,
        }
      : undefined,
    priceRange: "$$",
  };
}
