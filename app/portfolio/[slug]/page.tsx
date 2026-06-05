import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { projectDetailQuery, projectSlugsQuery } from "@/sanity/lib/queries";
import { getSiteSeo } from "@/seo/site-seo";
import { JsonLd } from "@/seo/json-ld";
import { ProjectHero } from "@/components/portfolio/project-hero";
import { ProjectBody } from "@/components/portfolio/project-body";
import { ProjectGallery } from "@/components/portfolio/project-gallery";
import { ProjectTeam } from "@/components/portfolio/project-team";

export const revalidate = false;
export const fetchCache = "force-cache";

// Generate static routes for all projects
export async function generateStaticParams() {
  const slugs = await client.fetch(projectSlugsQuery).catch(() => []);
  return slugs.map((item: { slug: string }) => ({
    slug: item.slug,
  }));
}

// Generate dynamic SEO metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await client.fetch(projectDetailQuery, { slug }).catch(() => null);

  if (!project) return {};

  const siteSeo = await getSiteSeo();

  return {
    title: project.seo?.metaTitle || `${project.title} | ${siteSeo.siteName}`,
    description: project.seo?.metaDescription || project.summary,
    openGraph: {
      title: project.seo?.metaTitle || project.title,
      description: project.seo?.metaDescription || project.summary,
      images: project.coverImage?.src ? [project.coverImage.src] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.seo?.metaTitle || project.title,
      description: project.seo?.metaDescription || project.summary,
      images: project.coverImage?.src ? [project.coverImage.src] : undefined,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await client.fetch(projectDetailQuery, { slug }).catch(() => null);

  if (!project) {
    notFound();
  }

  const siteSeo = await getSiteSeo();

  // Structured Data for CreativeWork
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    image: project.coverImage?.src,
    datePublished: project.date,
    author: {
      "@type": "Organization",
      name: siteSeo.siteName,
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ProjectHero
        title={project.title}
        coverImage={project.coverImage}
        category={project.category}
        date={project.date}
        client={project.client}
      />
      <ProjectBody body={project.body} />
      <ProjectGallery gallery={project.gallery} />
      <ProjectTeam team={project.team} />
    </>
  );
}
