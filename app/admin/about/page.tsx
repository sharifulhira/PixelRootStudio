"use client";

import { useState, useEffect } from "react";
import { ImageUploader } from "@/components/admin/image-uploader";

type AboutData = {
  name: string;
  shortName: string;
  title: string;
  tagline: string;
  bio: string[];
  vision: string;
  stats: { value: string; label: string }[];
  skills: string[];
  experience: { company: string; role: string; period: string }[];
  photo: string;
  bannerImage: string;
  contact: {
    phones: string[];
    emails: string[];
  };
};

export default function AdminAboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/about")
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
      const res = await fetch("/api/admin/about", {
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
    return <div className="text-red-400">Failed to load about data</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">About</h1>
          <p className="text-sm text-white/50 mt-1">Edit about page content</p>
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
              <label className="block text-xs text-white/40 mb-1">Full Name</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Short Name</label>
              <input
                type="text"
                value={data.shortName || ""}
                onChange={(e) => setData({ ...data, shortName: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Title</label>
              <input
                type="text"
                value={data.title || ""}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Tagline</label>
              <input
                type="text"
                value={data.tagline || ""}
                onChange={(e) => setData({ ...data, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Bio (one paragraph per line)</h2>
          <textarea
            value={(data.bio || []).join("\n\n")}
            onChange={(e) => setData({ ...data, bio: e.target.value.split("\n\n").filter(p => p.trim()) })}
            rows={8}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
          />
        </div>

        {/* Vision */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Vision</h2>
          <textarea
            value={data.vision || ""}
            onChange={(e) => setData({ ...data, vision: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
          />
        </div>

        {/* Skills */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Skills (comma separated)</h2>
          <input
            type="text"
            value={(data.skills || []).join(", ")}
            onChange={(e) => setData({ ...data, skills: e.target.value.split(",").map(s => s.trim()) })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
          />
        </div>

        {/* Contact */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-1">Phone Numbers (comma separated)</label>
              <input
                type="text"
                value={(data.contact?.phones || []).join(", ")}
                onChange={(e) => setData({ ...data, contact: { ...data.contact, phones: e.target.value.split(",").map(p => p.trim()) } })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Emails (comma separated)</label>
              <input
                type="text"
                value={(data.contact?.emails || []).join(", ")}
                onChange={(e) => setData({ ...data, contact: { ...data.contact, emails: e.target.value.split(",").map(e => e.trim()) } })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              />
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Photos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ImageUploader
              value={data.photo || ""}
              onChange={(photo) => setData({ ...data, photo })}
              folder="about"
              label="Profile Photo"
              aspectRatio="square"
            />
            <ImageUploader
              value={data.bannerImage || ""}
              onChange={(bannerImage) => setData({ ...data, bannerImage })}
              folder="about"
              label="Banner Image"
              aspectRatio="video"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
