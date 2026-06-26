"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/image-uploader";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type TeamMember = {
  id: string;
  name: string;
  role: string;
};

type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
};

export type ProjectFormData = {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  body: string[];
  date: string;
  client: string;
  featured: boolean;
  sortOrder: number;
  categoryId: number | null;
  coverImage: { src: string; alt: string };
  seo: { metaTitle: string; metaDescription: string };
  gallery: GalleryImage[];
  teamMemberIds: string[];
};

type Props = {
  initialData?: ProjectFormData;
  isNew?: boolean;
};

const emptyProject = (): ProjectFormData => ({
  title: "",
  slug: "",
  summary: "",
  body: [""],
  date: "",
  client: "",
  featured: false,
  sortOrder: 0,
  categoryId: null,
  coverImage: { src: "", alt: "" },
  seo: { metaTitle: "", metaDescription: "" },
  gallery: [],
  teamMemberIds: [],
});

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const inputClass =
  "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30";

export function ProjectForm({ initialData, isNew = false }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectFormData>(initialData || emptyProject());
  const [categories, setCategories] = useState<Category[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch("/api/admin/team").then((r) => r.json()),
    ]).then(([cats, members]) => {
      setCategories(cats || []);
      setTeam(members || []);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      ...form,
      body: form.body.filter((p) => p.trim()),
      gallery: form.gallery.filter((g) => g.src.trim()),
    };

    const method = isNew ? "POST" : "PUT";
    const res = await fetch("/api/admin/projects", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setMessage(isNew ? "Project created!" : "Project saved!");
      if (isNew) {
        const data = await res.json();
        router.push(`/admin/projects/${data.id ? `p${data.id}` : form.slug}`);
      }
    } else {
      const data = await res.json();
      setError(data.error || "Failed to save project");
    }
    setSaving(false);
  }

  function updateBody(index: number, value: string) {
    const body = [...form.body];
    body[index] = value;
    setForm({ ...form, body });
  }

  function addParagraph() {
    setForm({ ...form, body: [...form.body, ""] });
  }

  function removeParagraph(index: number) {
    setForm({ ...form, body: form.body.filter((_, i) => i !== index) });
  }

  function addGalleryImage() {
    setForm({
      ...form,
      gallery: [...form.gallery, { src: "", alt: "", caption: "" }],
    });
  }

  function updateGallery(index: number, field: keyof GalleryImage, value: string) {
    const gallery = [...form.gallery];
    gallery[index] = { ...gallery[index], [field]: value };
    setForm({ ...form, gallery });
  }

  function removeGallery(index: number) {
    setForm({ ...form, gallery: form.gallery.filter((_, i) => i !== index) });
  }

  function toggleTeamMember(memberId: string) {
    const ids = form.teamMemberIds.includes(memberId)
      ? form.teamMemberIds.filter((id) => id !== memberId)
      : [...form.teamMemberIds, memberId];
    setForm({ ...form, teamMemberIds: ids });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 mb-2 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
          <h1 className="text-2xl font-bold text-white">
            {isNew ? "Add Project" : "Edit Project"}
          </h1>
          {!isNew && form.slug && (
            <a
              href={`/portfolio/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-400 hover:text-amber-300 mt-1 inline-flex items-center gap-1"
            >
              View on site
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
        <button
          type="submit"
          disabled={saving || !form.title}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-900 font-semibold rounded-lg text-sm transition-colors"
        >
          {saving ? "Saving..." : isNew ? "Create Project" : "Save Changes"}
        </button>
      </div>

      {message && (
        <div className="p-3 rounded-lg text-sm bg-green-500/10 text-green-400">{message}</div>
      )}
      {error && (
        <div className="p-3 rounded-lg text-sm bg-red-500/10 text-red-400">{error}</div>
      )}

      {/* Basic Info */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">Basic Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1">Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm({
                  ...form,
                  title,
                  slug: isNew ? slugify(title) : form.slug,
                  coverImage: { ...form.coverImage, alt: form.coverImage.alt || title },
                });
              }}
              className={inputClass}
              placeholder="Project title"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">Slug *</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className={inputClass}
              placeholder="project-slug"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1">Summary</label>
          <textarea
            rows={2}
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            className={`${inputClass} resize-none`}
            placeholder="Short description for portfolio cards"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1">Category</label>
            <select
              value={form.categoryId ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  categoryId: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              className={inputClass}
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">Client</label>
            <input
              type="text"
              value={form.client}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
              className={inputClass}
              placeholder="Client name"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-white/60">Featured project</span>
          </label>
          <div className="flex items-center gap-2">
            <label className="text-xs text-white/40">Sort order</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
              className="w-20 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">Cover Image</h2>
        <ImageUploader
          value={form.coverImage.src}
          onChange={(src) => setForm({ ...form, coverImage: { ...form.coverImage, src } })}
          folder="projects"
          label="Cover"
          aspectRatio="video"
        />
        <div>
          <label className="block text-xs text-white/40 mb-1">Alt text</label>
          <input
            type="text"
            value={form.coverImage.alt}
            onChange={(e) =>
              setForm({ ...form, coverImage: { ...form.coverImage, alt: e.target.value } })
            }
            className={inputClass}
            placeholder="Image description for accessibility"
          />
        </div>
      </div>

      {/* Body */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Project Story</h2>
          <button
            type="button"
            onClick={addParagraph}
            className="text-xs text-amber-400 hover:text-amber-300"
          >
            + Add paragraph
          </button>
        </div>
        {form.body.map((para, i) => (
          <div key={i} className="flex gap-2">
            <textarea
              rows={3}
              value={para}
              onChange={(e) => updateBody(i, e.target.value)}
              className={`${inputClass} resize-none flex-1`}
              placeholder={`Paragraph ${i + 1}`}
            />
            {form.body.length > 1 && (
              <button
                type="button"
                onClick={() => removeParagraph(i)}
                className="text-red-400 hover:text-red-300 self-start mt-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Gallery */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Gallery Images</h2>
          <button
            type="button"
            onClick={addGalleryImage}
            className="text-xs text-amber-400 hover:text-amber-300"
          >
            + Add image
          </button>
        </div>
        {form.gallery.length === 0 ? (
          <p className="text-xs text-white/30">No gallery images yet.</p>
        ) : (
          <div className="space-y-4">
            {form.gallery.map((img, i) => (
              <div key={i} className="border border-white/5 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">Image {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeGallery(i)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <ImageUploader
                  value={img.src}
                  onChange={(src) => updateGallery(i, "src", src)}
                  folder="projects"
                  label=""
                  aspectRatio="landscape"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={img.alt}
                    onChange={(e) => updateGallery(i, "alt", e.target.value)}
                    className={inputClass}
                    placeholder="Alt text"
                  />
                  <input
                    type="text"
                    value={img.caption}
                    onChange={(e) => updateGallery(i, "caption", e.target.value)}
                    className={inputClass}
                    placeholder="Caption (optional)"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team */}
      {team.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white">Team Members</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {team.map((member) => (
              <label
                key={member.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  form.teamMemberIds.includes(member.id)
                    ? "border-amber-500/40 bg-amber-500/5"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.teamMemberIds.includes(member.id)}
                  onChange={() => toggleTeamMember(member.id)}
                  className="rounded"
                />
                <div>
                  <p className="text-sm text-white">{member.name}</p>
                  <p className="text-xs text-white/40">{member.role}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* SEO */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">SEO (optional)</h2>
        <div>
          <label className="block text-xs text-white/40 mb-1">Meta Title</label>
          <input
            type="text"
            value={form.seo.metaTitle}
            onChange={(e) =>
              setForm({ ...form, seo: { ...form.seo, metaTitle: e.target.value } })
            }
            className={inputClass}
            placeholder="Override page title"
          />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">Meta Description</label>
          <textarea
            rows={2}
            value={form.seo.metaDescription}
            onChange={(e) =>
              setForm({ ...form, seo: { ...form.seo, metaDescription: e.target.value } })
            }
            className={`${inputClass} resize-none`}
            placeholder="Override meta description"
          />
        </div>
      </div>

      {/* Bottom save */}
      <div className="flex justify-end gap-3 pb-8">
        <Link
          href="/admin/projects"
          className="px-4 py-2 text-sm text-white/60 hover:text-white"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving || !form.title}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-900 font-semibold rounded-lg text-sm"
        >
          {saving ? "Saving..." : isNew ? "Create Project" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
