"use client";

import { useState, useEffect } from "react";
import { ImageUploader } from "@/components/admin/image-uploader";

type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  aspect: string;
  category: string;
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ src: string; alt: string; aspect: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    const res = await fetch("/api/admin/gallery");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  async function handleAdd() {
    if (!editing) return;
    setSaving(true);

    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editing, featured: true }),
    });

    if (res.ok) {
      await loadGallery();
      setEditing(null);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this image?")) return;
    const numericId = id.replace("g", "");
    await fetch(`/api/admin/gallery?id=${numericId}`, { method: "DELETE" });
    await loadGallery();
  }

  if (loading) {
    return <div className="text-white/50">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Gallery</h1>
          <p className="text-sm text-white/50 mt-1">Manage homepage gallery images</p>
        </div>
        <button
          onClick={() => setEditing({ src: "", alt: "", aspect: "landscape" })}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-colors"
        >
          Add Image
        </button>
      </div>

      {/* Add Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-800 border border-white/10 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-white mb-4">Add Gallery Image</h2>
            <div className="space-y-4">
              <ImageUploader
                value={editing.src}
                onChange={(src) => setEditing({ ...editing, src })}
                folder="gallery"
                label="Image"
                aspectRatio="square"
              />
              <div>
                <label className="block text-xs text-white/40 mb-1">Alt Text (required for SEO)</label>
                <input
                  type="text"
                  value={editing.alt}
                  onChange={(e) => setEditing({ ...editing, alt: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Aspect Ratio</label>
                <select
                  value={editing.aspect}
                  onChange={(e) => setEditing({ ...editing, aspect: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                >
                  <option value="landscape">Landscape</option>
                  <option value="portrait">Portrait</option>
                  <option value="square">Square</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 text-sm text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={saving || !editing.src || !editing.alt}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-900 font-semibold rounded-lg text-sm"
              >
                {saving ? "Adding..." : "Add Image"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {items.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center text-white/50">
          No gallery images yet
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <img
                src={item.src}
                alt={item.alt}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg"
                >
                  Delete
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-xs text-white/70 truncate">{item.alt}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
