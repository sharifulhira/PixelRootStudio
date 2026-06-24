import type { MetadataRoute } from "next";
import { getSiteSeo } from "@/seo/site-seo";

export default function robots(): MetadataRoute.Robots {
  const siteSeo = getSiteSeo();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${siteSeo.siteUrl}/sitemap.xml`,
    host: siteSeo.siteUrl,
  };
}
