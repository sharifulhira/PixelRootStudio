import seoJson from "@/data/seo.json";

type SeoData = {
  siteName: string;
  siteUrl: string;
  title: string;
  description: string;
  locale: string;
  twitterHandle: string;
  keywords: string[];
  organization: {
    name: string;
    email: string;
    telephone: string;
  };
};

export const siteSeo: SeoData = seoJson;

export function getHomeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteSeo.siteName,
    url: siteSeo.siteUrl,
    description: siteSeo.description,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: siteSeo.organization.name,
      email: siteSeo.organization.email,
      telephone: siteSeo.organization.telephone,
      url: siteSeo.siteUrl,
    },
  };
}
