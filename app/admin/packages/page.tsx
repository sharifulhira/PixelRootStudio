"use client";

import { useState, useEffect } from "react";
import { ImageUploader } from "@/components/admin/image-uploader";

type PackageItem = {
  id: number;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  features: string[];
  price: number | null;
  priceLabel: string;
  currency: string;
  duration: string;
  deliverables: string;
  popular: boolean;
  active: boolean;
  imageSrc: string;
  sortOrder: number;
};

type PackageSettings = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
};

const CATEGORIES = ["wedding", "corporate", "fashion", "product", "event"];

const categoryLabels: Record<string, string> = {
  wedding: "Wedding",
  corporate: "Corporate",
  fashion: "Fashion",
  product: "Product",
  event: "Events",
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminPackagesPage() {
  const [items, setItems] = useState<PackageItem[]>([]);
  const [settings, setSettings] = useState<PackageSettings>({
    title: "Our Packages",
    subtitle: "",
    ctaLabel: "View All Packages",
    ctaHref: "/packages",
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PackageItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [featureInput, setFeatureInput] = useState("");

  useEffect(() => {
    loadPackages();
  }, []);

  async function loadPackages() {
    const res = await fetch("/api/admin/packages");
    const data = await res.json();
    setItems(data.items || []);
    setSettings(data.settings || settings);
    setLoading(false);
  }

  async function handleSaveSettings() {
    setSaving(true);
    const res = await fetch("/api/admin/packages", {
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
    const res = await fetch("/api/admin/packages", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    if (res.ok) {
      setMessage(isNew ? "Package created!" : "Package updated!");
      setTimeout(() => setMessage(""), 3000);
      setEditing(null);
      setIsNew(false);
      loadPackages();
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this package?")) return;
    await fetch(`/api/admin/packages?id=${id}`, { method: "DELETE" });
    loadPackages();
  }

  function addFeature() {
    if (!featureInput.trim() || !editing) return;
    setEditing({ ...editing, features: [...editing.features, featureInput.trim()] });
    setFeatureInput("");
  }

  function removeFeature(index: number) {
    if (!editing) return;
    const updated = editing.features.filter((_, i) => i !== index);
    setEditing({ ...editing, features: updated });
  }

  if (loading) {
    return <div className="text-white/50">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Packages</h1>
          <p className="text-sm text-white/50 mt-1">Manage photography packages and pricing</p>
        </div>
        <button
          onClick={() => {
            setEditing({
              id: 0,
              name: "",
              slug: "",
              category: "wedding",
              shortDescription: "",
              description: "",
              features: [],
              price: null,
              priceLabel: "Starting from",
              currency: "BDT",
              duration: "",
              deliverables: "",
              popular: false,
              active: true,
              imageSrc: "",
              sortOrder: items.length,
            });
            setIsNew(true);
          }}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-colors"
        >
          Add Package
        </button>
      </div>

      {message && (
        <div className="mb-6 p-3 rounded-lg text-sm bg-green-500/10 text-green-400">
          {message}
        </div>
      )}

      {/* Section Settings */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8">
        <h2 className="text-sm font-semibold text-white mb-4">Homepage Section Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1">Section Title</label>
            <input
              type="text"
              value={settings.title}
              onChange={(e) => setSettings({ ...settings, title: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">CTA Label</label>
            <input
              type="text"
              value={settings.ctaLabel}
              onChange={(e) => setSettings({ ...settings, ctaLabel: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-white/40 mb-1">Subtitle</label>
            <input
              type="text"
              value={settings.subtitle}
              onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
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

      {/* Packages List */}
      {items.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center text-white/50">
          No packages yet. Add your first package!
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-white truncate">{item.name}</h3>
                    {item.popular && (
                      <span className="text-[9px] font-bold tracking-wider uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">Popular</span>
                    )}
                    {!item.active && (
                      <span className="text-[9px] font-bold tracking-wider uppercase text-red-400 bg-red-400/10 px-2 py-0.5 rounded">Inactive</span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 mt-0.5">
                    {categoryLabels[item.category]} • {item.price ? `৳${item.price.toLocaleString()}` : "No price"}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => { setEditing(item); setIsNew(false); }}
                    className="px-3 py-1.5 text-xs text-amber-400 border border-amber-400/30 rounded-lg hover:bg-amber-400/10 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1.5 text-xs text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-white/10 rounded-xl p-6 w-full max-w-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">{isNew ? "Add Package" : "Edit Package"}</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="text-white/40 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Package Name *</label>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setEditing({
                        ...editing,
                        name,
                        slug: isNew ? slugify(name) : editing.slug,
                      });
                    }}
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
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Category</label>
                  <select
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{categoryLabels[cat]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={editing.sortOrder}
                    onChange={(e) => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1">Short Description</label>
                <input
                  type="text"
                  value={editing.shortDescription}
                  onChange={(e) => setEditing({ ...editing, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  placeholder="Brief tagline for the card view"
                />
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Price</label>
                  <input
                    type="number"
                    value={editing.price || ""}
                    onChange={(e) => setEditing({ ...editing, price: e.target.value ? parseFloat(e.target.value) : null })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                    placeholder="e.g. 35000"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Price Label</label>
                  <input
                    type="text"
                    value={editing.priceLabel}
                    onChange={(e) => setEditing({ ...editing, priceLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                    placeholder="Starting from"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Currency</label>
                  <select
                    value={editing.currency}
                    onChange={(e) => setEditing({ ...editing, currency: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  >
                    <option value="BDT">BDT (৳)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Duration</label>
                  <input
                    type="text"
                    value={editing.duration}
                    onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                    placeholder="e.g. 4-6 hours"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Deliverables</label>
                  <input
                    type="text"
                    value={editing.deliverables}
                    onChange={(e) => setEditing({ ...editing, deliverables: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                    placeholder="e.g. 200+ edited photos"
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-xs text-white/40 mb-1">Features</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                    placeholder="Add a feature and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-3 py-2 bg-white/10 border border-white/10 rounded-lg hover:bg-white/15 text-white text-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {editing.features.map((f, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-white/5 rounded-lg">
                      <span className="text-sm text-white/70">{f}</span>
                      <button onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-300">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image */}
              <ImageUploader
                value={editing.imageSrc}
                onChange={(url) => setEditing({ ...editing, imageSrc: url })}
                folder="packages"
                label="Cover Image"
              />

              {/* Toggles */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.popular}
                    onChange={(e) => setEditing({ ...editing, popular: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-white/60">Popular (highlighted)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.active}
                    onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-white/60">Active (visible on site)</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
              <button
                onClick={() => { setEditing(null); setIsNew(false); }}
                className="px-4 py-2 text-sm text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                disabled={saving || !editing.name || !editing.slug}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-900 font-semibold rounded-lg text-sm"
              >
                {saving ? "Saving..." : isNew ? "Create Package" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
