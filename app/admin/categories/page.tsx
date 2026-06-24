"use client";

import { useState, useEffect } from "react";
import { ImageUploader } from "@/components/admin/image-uploader";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageSrc: string;
  featured: boolean;
  sortOrder: number;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);

    const method = isNew ? "POST" : "PUT";
    const res = await fetch("/api/admin/categories", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    if (res.ok) {
      await loadCategories();
      setEditing(null);
      setIsNew(false);
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    await loadCategories();
  }

  if (loading) {
    return <div className="text-white/50">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-sm text-white/50 mt-1">Manage photography categories</p>
        </div>
        <button
          onClick={() => {
            setEditing({ id: 0, name: "", slug: "", description: "", imageSrc: "", featured: true, sortOrder: 0 });
            setIsNew(true);
          }}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-colors"
        >
          Add Category
        </button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-800 border border-white/10 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-white mb-4">
              {isNew ? "Add Category" : "Edit Category"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/40 mb-1">Name</label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Slug</label>
                <input
                  type="text"
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  placeholder="auto-generated from name if empty"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Description</label>
                <input
                  type="text"
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>
              <ImageUploader
                value={editing.imageSrc}
                onChange={(imageSrc) => setEditing({ ...editing, imageSrc })}
                folder="categories"
                label="Category Image"
                aspectRatio="portrait"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={editing.featured}
                  onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="featured" className="text-sm text-white/60">Featured on homepage</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setEditing(null); setIsNew(false); }}
                className="px-4 py-2 text-sm text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg text-sm"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-12 text-center text-white/50">No categories yet</div>
        ) : (
          <div className="divide-y divide-white/5">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-4 hover:bg-white/5">
                <div className="flex items-center gap-3">
                  {cat.imageSrc && (
                    <img src={cat.imageSrc} alt="" className="w-10 h-10 object-cover rounded-lg" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{cat.name}</p>
                    <p className="text-xs text-white/40">{cat.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {cat.featured && (
                    <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">Featured</span>
                  )}
                  <button
                    onClick={() => { setEditing(cat); setIsNew(false); }}
                    className="text-sm text-amber-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-sm text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
