import seoJson from "@/data/seo.json";
import { client } from "@/sanity/lib/client";
import { seoQuery } from "@/sanity/lib/queries";

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

export async function getSiteSeo(): Promise<SeoData> {
  const sanitySeo = await client.fetch(seoQuery).catch(() => null);
  return sanitySeo || seoJson;
}

export async function getHomeJsonLd() {
  const siteSeo = await getSiteSeo();
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
