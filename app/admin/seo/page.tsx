"use client";

import { useState, useEffect } from "react";

type SeoData = {
  siteName: string;
  siteUrl: string;
  metaTitle: string;
  metaDescription: string;
  locale: string;
  twitterHandle: string;
  keywords: string[];
  orgName: string;
  orgEmail: string;
  orgPhone: string;
  orgAddress: string;
  socialFacebook: string;
  socialInstagram: string;
  socialYoutube: string;
  socialLinkedin: string;
};

export default function AdminSeoPage() {
  const [data, setData] = useState<SeoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/seo")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMessage("Saved successfully!");
      } else {
        setMessage("Failed to save");
      }
    } catch {
      setMessage("An error occurred");
    }

    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  }

  if (loading) {
    return <div className="text-white/50">Loading...</div>;
  }

  if (!data) {
    return <div className="text-red-400">Failed to load SEO data</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">SEO Settings</h1>
          <p className="text-sm text-white/50 mt-1">Configure site-wide SEO and organization details</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-900 font-semibold rounded-lg transition-colors"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-3 rounded-lg text-sm ${message.includes("success") ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-1">Site Name</label>
              <input
                type="text"
                value={data.siteName || ""}
                onChange={(e) => setData({ ...data, siteName: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Site URL</label>
              <input
                type="text"
                value={data.siteUrl || ""}
                onChange={(e) => setData({ ...data, siteUrl: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>
        </div>

        {/* Meta Tags */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Meta Tags</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 mb-1">Meta Title</label>
              <input
                type="text"
                value={data.metaTitle || ""}
                onChange={(e) => setData({ ...data, metaTitle: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Meta Description</label>
              <textarea
                value={data.metaDescription || ""}
                onChange={(e) => setData({ ...data, metaDescription: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Keywords (comma separated)</label>
              <input
                type="text"
                value={(data.keywords || []).join(", ")}
                onChange={(e) => setData({ ...data, keywords: e.target.value.split(",").map(k => k.trim()) })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>
        </div>

        {/* Organization */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Organization</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-1">Organization Name</label>
              <input
                type="text"
                value={data.orgName || ""}
                onChange={(e) => setData({ ...data, orgName: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Email</label>
              <input
                type="email"
                value={data.orgEmail || ""}
                onChange={(e) => setData({ ...data, orgEmail: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Phone</label>
              <input
                type="text"
                value={data.orgPhone || ""}
                onChange={(e) => setData({ ...data, orgPhone: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Address</label>
              <input
                type="text"
                value={data.orgAddress || ""}
                onChange={(e) => setData({ ...data, orgAddress: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Social Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-1">Facebook</label>
              <input
                type="text"
                value={data.socialFacebook || ""}
                onChange={(e) => setData({ ...data, socialFacebook: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Instagram</label>
              <input
                type="text"
                value={data.socialInstagram || ""}
                onChange={(e) => setData({ ...data, socialInstagram: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">YouTube</label>
              <input
                type="text"
                value={data.socialYoutube || ""}
                onChange={(e) => setData({ ...data, socialYoutube: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                placeholder="https://youtube.com/..."
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">LinkedIn</label>
              <input
                type="text"
                value={data.socialLinkedin || ""}
                onChange={(e) => setData({ ...data, socialLinkedin: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                placeholder="https://linkedin.com/..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
