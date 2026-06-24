"use client";

import { useState, useEffect } from "react";
import { ImageUploader } from "@/components/admin/image-uploader";

type GearItem = {
  id: number;
  name: string;
  category: string;
  description: string;
  imageSrc: string;
  featured: boolean;
  sortOrder: number;
};

type GearSettings = {
  title: string;
  subtitle: string;
};

const CATEGORIES = [
  "Camera", 
  "Lens", 
  "Lighting", 
  "Video", 
  "Drone", 
  "Audio", 
  "Stabilizer", 
  "Monitor", 
  "Backdrop", 
  "Tripod", 
  "Storage", 
  "Accessory"
];

export default function AdminGearPage() {
  const [items, setItems] = useState<GearItem[]>([]);
  const [settings, setSettings] = useState<GearSettings>({ title: "Our Gear", subtitle: "" });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<GearItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadGear();
  }, []);

  async function loadGear() {
    const res = await fetch("/api/admin/gear");
    const data = await res.json();
    setItems(data.items || []);
    setSettings(data.settings || { title: "Our Gear", subtitle: "" });
    setLoading(false);
  }

  async function handleSaveSettings() {
    setSaving(true);
    const res = await fetch("/api/admin/gear", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "settings", ...settings }),
    });
    if (res.ok) {
      setMessage("Settings saved!");
      setTimeout(() => setMessage(""), 3000);
    }
    setSaving(false);
  }

  async function handleSaveItem() {
    if (!editing) return;
    setSaving(true);

    const method = isNew ? "POST" : "PUT";
    const res = await fetch("/api/admin/gear", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    if (res.ok) {
      await loadGear();
      setEditing(null);
      setIsNew(false);
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this gear item?")) return;
    await fetch(`/api/admin/gear?id=${id}`, { method: "DELETE" });
    await loadGear();
  }

  if (loading) {
    return <div className="text-white/50">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Gear Showcase</h1>
          <p className="text-sm text-white/50 mt-1">Manage your photography equipment display</p>
        </div>
        <button
          onClick={() => {
            setEditing({
              id: 0,
              name: "",
              category: "Camera",
              description: "",
              imageSrc: "",
              featured: false,
              sortOrder: items.length,
            });
            setIsNew(true);
          }}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-colors"
        >
          Add Gear
        </button>
      </div>

      {message && (
        <div className="mb-6 p-3 rounded-lg text-sm bg-green-500/10 text-green-400">
          {message}
        </div>
      )}

      {/* Section Settings */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8">
        <h2 className="text-sm font-semibold text-white mb-4">Section Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1">Title</label>
            <input
              type="text"
              value={settings.title}
              onChange={(e) => setSettings({ ...settings, title: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              placeholder="Our Gear"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">Subtitle</label>
            <input
              type="text"
              value={settings.subtitle}
              onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              placeholder="Professional equipment..."
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg text-sm"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-800 border border-white/10 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-white mb-4">
              {isNew ? "Add Gear" : "Edit Gear"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/40 mb-1">Name</label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  placeholder="Sony A7R V"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Category</label>
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Description</label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  placeholder="Brief description of the equipment..."
                />
              </div>
              <ImageUploader
                value={editing.imageSrc}
                onChange={(imageSrc) => setEditing({ ...editing, imageSrc })}
                folder="gear"
                label="Image"
                aspectRatio="square"
              />
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.featured}
                    onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-white/60">Featured (shows larger)</span>
                </label>
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
                onClick={handleSaveItem}
                disabled={saving || !editing.name}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-900 font-semibold rounded-lg text-sm"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gear Grid */}
      {items.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center text-white/50">
          No gear items yet. Add your first equipment!
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden ${
                item.featured ? "ring-2 ring-amber-500/50" : ""
              }`}
            >
              {item.imageSrc ? (
                <img
                  src={item.imageSrc}
                  alt={item.name}
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <div className="w-full aspect-square bg-white/5 flex items-center justify-center">
                  <span className="text-4xl">📷</span>
                </div>
              )}
              
              {/* Featured Badge */}
              {item.featured && (
                <div className="absolute top-2 left-2">
                  <span className="text-[9px] font-bold tracking-wider uppercase text-amber-400 bg-black/70 px-2 py-1 rounded">
                    Featured
                  </span>
                </div>
              )}

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => { setEditing(item); setIsNew(false); }}
                  className="px-3 py-1.5 bg-amber-500 text-slate-900 text-xs font-semibold rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg"
                >
                  Delete
                </button>
              </div>

              {/* Info */}
              <div className="p-3">
                <span className="text-[9px] font-semibold tracking-wider uppercase text-amber-400/70">
                  {item.category}
                </span>
                <p className="text-sm font-medium text-white truncate">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
