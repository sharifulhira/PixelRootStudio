import type { MetadataRoute } from "next";
import { getSiteSeo } from "@/seo/site-seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteSeo = await getSiteSeo();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteSeo.siteUrl}/sitemap.xml`,
    host: siteSeo.siteUrl,
  };
}
