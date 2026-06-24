import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteSeo } from "@/seo/site-seo";
import { JsonLd } from "@/seo/json-ld";
import { ProjectHero } from "@/components/portfolio/project-hero";
import { ProjectBody } from "@/components/portfolio/project-body";
import { ProjectGallery } from "@/components/portfolio/project-gallery";
import { ProjectTeam } from "@/components/portfolio/project-team";
import { getProjectBySlug, getProjectSlugs } from "@/lib/db/queries";

export const revalidate = 3600;

export function generateStaticParams() {
  const slugs = getProjectSlugs();
  return slugs.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const siteSeo = getSiteSeo();
  const title = project.seo?.metaTitle || `${project.title} | ${siteSeo.siteName}`;
  const description = project.seo?.metaDescription || project.summary || "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: project.coverImage?.src ? [project.coverImage.src] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const siteSeo = getSiteSeo();

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
