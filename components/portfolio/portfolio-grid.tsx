"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const easeOut = [0.22, 1, 0.36, 1] as const;

type ProjectCard = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  date: string;
  client?: string;
  coverImage: { src: string; alt: string };
  category: { id: string; name: string; slug: string };
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

export function PortfolioGrid({
  projects,
  categories,
  initialFilter,
}: {
  projects: ProjectCard[];
  categories: Category[];
  initialFilter?: string;
}) {
  const [activeFilter, setActiveFilter] = useState(initialFilter || "all");

  const filtered = useMemo(() => {
    if (activeFilter === "all") return projects;
    return projects.filter((p) => p.category?.slug === activeFilter);
  }, [projects, activeFilter]);

  return (
    <>
      {/* ── Filter pills ── */}
      <div className="flex gap-2 mb-10 sm:mb-12 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
        <button
          onClick={() => setActiveFilter("all")}
          className={`shrink-0 text-[11px] font-semibold tracking-[0.14em] uppercase rounded-full px-4 py-2 border transition-all duration-200 ${
            activeFilter === "all"
              ? "bg-[color:var(--primary)] text-white border-[color:var(--primary)]"
              : "border-[color:var(--border)] text-[color:var(--muted)] hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveFilter(cat.slug)}
            className={`shrink-0 text-[11px] font-semibold tracking-[0.14em] uppercase rounded-full px-4 py-2 border transition-all duration-200 ${
              activeFilter === cat.slug
                ? "bg-[color:var(--primary)] text-white border-[color:var(--primary)]"
                : "border-[color:var(--border)] text-[color:var(--muted)] hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Project grid ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[color:var(--muted)] text-sm">No projects found in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: easeOut, delay: (i % 6) * 0.06 }}
            >
              <Link
                href={`/portfolio/${project.slug}`}
                className="group block rounded-2xl overflow-hidden border border-[color:var(--border)] bg-[color:var(--surface)] hover:border-[color:var(--primary)]/30 transition-all duration-300"
              >
                {/* Cover image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.coverImage?.src || ""}
                    alt={project.coverImage?.alt || project.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Category pill */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.14em] uppercase text-white bg-black/50 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1">
                      <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                      {project.category?.name || "Uncategorized"}
                    </span>
                  </div>

                  {/* Arrow on hover */}
                  <div className="absolute bottom-3 right-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <svg viewBox="0 0 12 12" className="w-3.5 h-3.5 text-white" fill="none" aria-hidden="true">
                        <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 sm:p-5">
                  <h3 className="hero-headline text-base sm:text-lg font-bold text-[color:var(--text)] leading-tight mb-1.5 group-hover:text-[color:var(--primary)] transition-colors duration-200">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[color:var(--muted)] leading-relaxed line-clamp-2 mb-3">
                    {project.summary}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.1em] uppercase text-[color:var(--muted)]">
                    {project.date && (
                      <span>{new Date(project.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                    )}
                    {project.client && (
                      <>
                        <span className="w-px h-3 bg-[color:var(--border)]" />
                        <span>{project.client}</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
