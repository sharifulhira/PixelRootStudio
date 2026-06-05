import type { MetadataRoute } from "next";
import { getSiteSeo } from "@/seo/site-seo";
import { client } from "@/sanity/lib/client";
import { projectSlugsQuery } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteSeo = await getSiteSeo();
  const slugs = await client.fetch(projectSlugsQuery).catch(() => []);

  const projects: MetadataRoute.Sitemap = slugs.map((item: any) => ({
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
    ...projects,
  ];
}
