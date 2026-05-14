import type { MetadataRoute } from "next";
import { siteSeo } from "@/seo/site-seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteSeo.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
