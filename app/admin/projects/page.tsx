"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  date: string;
  client: string;
  featured: boolean;
  coverImage: { src: string; alt: string };
  category: { id: string; name: string; slug: string };
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  }

  if (loading) {
    return <div className="text-white/50">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-sm text-white/50 mt-1">Manage your portfolio projects</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-colors"
        >
          Add Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <p className="text-white/50 mb-4">No projects yet</p>
          <Link
            href="/admin/projects/new"
            className="inline-block px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-colors"
          >
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider p-4">Project</th>
                  <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider p-4">Category</th>
                  <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider p-4">Date</th>
                  <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider p-4">Featured</th>
                  <th className="text-right text-xs font-semibold text-white/40 uppercase tracking-wider p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {project.coverImage?.src && (
                          <img
                            src={project.coverImage.src}
                            alt=""
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-white">{project.title}</p>
                          <p className="text-xs text-white/40">{project.client}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-white/60">{project.category?.name || "—"}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-white/60">
                        {project.date ? new Date(project.date).toLocaleDateString() : "—"}
                      </span>
                    </td>
                    <td className="p-4">
                      {project.featured ? (
                        <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">Featured</span>
                      ) : (
                        <span className="text-xs text-white/30">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-sm text-amber-400 hover:underline mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-sm text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
