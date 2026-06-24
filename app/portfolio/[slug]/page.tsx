import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteSeo } from "@/seo/site-seo";
import { JsonLd } from "@/seo/json-ld";
import { ProjectHero } from "@/components/portfolio/project-hero";
import { ProjectBody } from "@/components/portfolio/project-body";
import { ProjectGallery } from "@/components/portfolio/project-gallery";
import { ProjectTeam } from "@/components/portfolio/project-team";
import projectsData from "@/data/projects.json";
import teamData from "@/data/team.json";

type Project = (typeof projectsData)[number];

function getProject(slug: string): Project | undefined {
  return projectsData.find((p) => p.slug === slug);
}

export function generateStaticParams() {
  return projectsData.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const project = getProject(slug);
    if (!project) return {};

    const siteSeo = getSiteSeo();

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
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const siteSeo = getSiteSeo();
  const team = (project.team ?? [])
    .map((id) => teamData.find((member) => member.id === id))
    .filter((member): member is (typeof teamData)[number] => Boolean(member));

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
      <ProjectTeam team={team} />
    </>
  );
}
