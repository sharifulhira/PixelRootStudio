"use client";

import { useState, useEffect } from "react";
import { ImageUploader } from "@/components/admin/image-uploader";

type ClientItem = {
  id: number;
  name: string;
  logoSrc: string;
  websiteUrl: string;
  published: boolean;
  sortOrder: number;
};

type ClientSettings = {
  title: string;
  subtitle: string;
};

const emptyClient = (): ClientItem => ({
  id: 0,
  name: "",
  logoSrc: "",
  websiteUrl: "",
  published: true,
  sortOrder: 0,
});

export default function AdminClientsPage() {
  const [items, setItems] = useState<ClientItem[]>([]);
  const [settings, setSettings] = useState<ClientSettings>({
    title: "Trusted by Leading Brands",
    subtitle: "",
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ClientItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    const res = await fetch("/api/admin/clients");
    const data = await res.json();
    setItems(data.items || []);
    setSettings({
      title: data.settings?.title || "Trusted by Leading Brands",
      subtitle: data.settings?.subtitle || "",
    });
    setLoading(false);
  }

  async function handleSaveSettings() {
    setSaving(true);
    const res = await fetch("/api/admin/clients", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "settings", ...settings }),
    });
    if (res.ok) {
      setMessage("Section settings saved!");
      setTimeout(() => setMessage(""), 3000);
    }
    setSaving(false);
  }

  async function handleSaveItem() {
    if (!editing) return;
    setSaving(true);

    const method = isNew ? "POST" : "PUT";
    const res = await fetch("/api/admin/clients", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    if (res.ok) {
      await loadClients();
      setEditing(null);
      setIsNew(false);
      setMessage(isNew ? "Client added!" : "Client updated!");
      setTimeout(() => setMessage(""), 3000);
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Remove this client from the homepage slider?")) return;
    await fetch(`/api/admin/clients?id=${id}`, { method: "DELETE" });
    await loadClients();
  }

  async function togglePublished(item: ClientItem) {
    await fetch("/api/admin/clients", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, published: !item.published }),
    });
    await loadClients();
  }

  if (loading) {
    return <div className="text-white/50">Loading...</div>;
  }

  const inputClass =
    "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Corporate Clients</h1>
          <p className="text-sm text-white/50 mt-1">
            Logos shown in the infinite slider on the homepage
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing({ ...emptyClient(), sortOrder: items.length });
            setIsNew(true);
          }}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-colors text-sm"
        >
          Add Client
        </button>
      </div>

      {message && (
        <div className="mb-6 p-3 rounded-lg text-sm bg-green-500/10 text-green-400 border border-green-500/20">
          {message}
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8">
        <h2 className="text-sm font-semibold text-white mb-4">Section Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1">Title</label>
            <input
              type="text"
              value={settings.title}
              onChange={(e) => setSettings({ ...settings, title: e.target.value })}
              className={inputClass}
              placeholder="Trusted by Leading Brands"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">Subtitle</label>
            <input
              type="text"
              value={settings.subtitle}
              onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
              className={inputClass}
              placeholder="Corporate clients who trust us…"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg text-sm disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-800 border border-white/10 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-white mb-4">
              {isNew ? "Add Corporate Client" : "Edit Corporate Client"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/40 mb-1">Company Name</label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className={inputClass}
                  placeholder="Acme Corporation"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Website URL</label>
                <input
                  type="url"
                  value={editing.websiteUrl}
                  onChange={(e) => setEditing({ ...editing, websiteUrl: e.target.value })}
                  className={inputClass}
                  placeholder="https://example.com"
                />
              </div>
              <ImageUploader
                value={editing.logoSrc}
                onChange={(logoSrc) => setEditing({ ...editing, logoSrc })}
                folder="brand"
                label="Company Logo"
                aspectRatio="landscape"
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.published}
                  onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-white/60">Show on homepage</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setIsNew(false);
                }}
                className="px-4 py-2 text-sm text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveItem}
                disabled={saving || !editing.name.trim() || !editing.logoSrc}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-900 font-semibold rounded-lg text-sm"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center text-white/50">
          No clients yet. Add corporate logos to show on the homepage slider.
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden divide-y divide-white/5">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 px-5 py-4 ${!item.published ? "opacity-50" : ""}`}
            >
              <div className="w-28 h-14 shrink-0 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center p-2">
                {item.logoSrc ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.logoSrc} alt={item.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-white/20 text-xs">No logo</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{item.name}</p>
                {item.websiteUrl ? (
                  <a
                    href={item.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-400/80 hover:text-amber-400 truncate block"
                  >
                    {item.websiteUrl}
                  </a>
                ) : (
                  <p className="text-xs text-white/30">No website link</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => togglePublished(item)}
                  className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wide ${
                    item.published
                      ? "bg-green-500/10 text-green-400"
                      : "bg-white/5 text-white/40"
                  }`}
                >
                  {item.published ? "Live" : "Hidden"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(item);
                    setIsNew(false);
                  }}
                  className="px-3 py-1.5 bg-amber-500 text-slate-900 text-xs font-semibold rounded-lg"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1.5 bg-red-500/80 text-white text-xs font-semibold rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
