import type { MetadataRoute } from "next";
import { getSiteSeo } from "@/seo/site-seo";
import projectsData from "@/data/projects.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteSeo = getSiteSeo();

  const projects: MetadataRoute.Sitemap = projectsData.map((project) => ({
    url: `${siteSeo.siteUrl}/portfolio/${project.slug}`,
    lastModified: new Date(project.date),
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
