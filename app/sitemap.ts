import type { MetadataRoute } from "next";
import { getSiteSeo } from "@/seo/site-seo";
import { getProjectSlugs } from "@/lib/db/queries";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteSeo = getSiteSeo();
  const slugs = getProjectSlugs();

  const projects: MetadataRoute.Sitemap = slugs.map((item) => ({
    url: `${siteSeo.siteUrl}/portfolio/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: siteSeo.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteSeo.siteUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteSeo.siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteSeo.siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...projects,
  ];
}
