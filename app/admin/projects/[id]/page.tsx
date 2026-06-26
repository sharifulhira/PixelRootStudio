"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ProjectForm, type ProjectFormData } from "@/components/admin/project-form";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<ProjectFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/projects?id=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setProject({
          id: data.id,
          title: data.title || "",
          slug: data.slug || "",
          summary: data.summary || "",
          body: data.body?.length ? data.body : [""],
          date: data.date || "",
          client: data.client || "",
          featured: data.featured ?? false,
          sortOrder: data.sortOrder ?? 0,
          categoryId: data.categoryId ?? null,
          coverImage: {
            src: data.coverImage?.src || "",
            alt: data.coverImage?.alt || "",
          },
          seo: {
            metaTitle: data.seo?.metaTitle || "",
            metaDescription: data.seo?.metaDescription || "",
          },
          gallery: (data.gallery || []).map((g: { src: string; alt: string; caption?: string }) => ({
            src: g.src,
            alt: g.alt || "",
            caption: g.caption || "",
          })),
          teamMemberIds: data.teamMemberIds || data.team?.map((t: { id: string }) => t.id) || [],
        });
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-white/50">Loading...</div>;
  }

  if (notFound || !project) {
    return (
      <div className="text-center py-16">
        <p className="text-white/50 mb-4">Project not found</p>
        <Link href="/admin/projects" className="text-amber-400 hover:text-amber-300 text-sm">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ProjectForm initialData={project} />
    </div>
  );
}
