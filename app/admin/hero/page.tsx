"use client";

import { useState, useEffect } from "react";
import { ImageUploader } from "@/components/admin/image-uploader";

type HeroData = {
  badge: string;
  headline: string[];
  subheadline: string;
  cta: {
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
  stats: { value: string; label: string }[];
  services: string[];
  image: { src: string; alt: string };
  videoUrl?: string;
  videoTitle?: string;
  videoSubtitle?: string;
};

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function AdminHeroPage() {
  const [data, setData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/hero")
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
      const res = await fetch("/api/admin/hero", {
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
    return <div className="text-red-400">Failed to load hero data</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Hero Section</h1>
          <p className="text-sm text-white/50 mt-1">Edit the homepage hero content</p>
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
        {/* Badge */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
            Badge Text
          </label>
          <input
            type="text"
            value={data.badge}
            onChange={(e) => setData({ ...data, badge: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        {/* Headline */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
            Headline (one per line)
          </label>
          <textarea
            value={data.headline.join("\n")}
            onChange={(e) => setData({ ...data, headline: e.target.value.split("\n") })}
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        {/* Subheadline */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
            Subheadline
          </label>
          <textarea
            value={data.subheadline}
            onChange={(e) => setData({ ...data, subheadline: e.target.value })}
            rows={2}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        {/* CTA Buttons */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">
            Call to Action Buttons
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-1">Primary Label</label>
              <input
                type="text"
                value={data.cta.primary.label}
                onChange={(e) => setData({ ...data, cta: { ...data.cta, primary: { ...data.cta.primary, label: e.target.value } } })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Primary Link</label>
              <input
                type="text"
                value={data.cta.primary.href}
                onChange={(e) => setData({ ...data, cta: { ...data.cta, primary: { ...data.cta.primary, href: e.target.value } } })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Secondary Label</label>
              <input
                type="text"
                value={data.cta.secondary.label}
                onChange={(e) => setData({ ...data, cta: { ...data.cta, secondary: { ...data.cta.secondary, label: e.target.value } } })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Secondary Link</label>
              <input
                type="text"
                value={data.cta.secondary.href}
                onChange={(e) => setData({ ...data, cta: { ...data.cta, secondary: { ...data.cta.secondary, href: e.target.value } } })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
            Services (comma separated)
          </label>
          <input
            type="text"
            value={data.services.join(", ")}
            onChange={(e) => setData({ ...data, services: e.target.value.split(",").map(s => s.trim()) })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        {/* Hero Image */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">
            Hero Image
          </label>
          <ImageUploader
            value={data.image.src}
            onChange={(src) => setData({ ...data, image: { ...data.image, src } })}
            folder="hero"
            label="Background Image"
            aspectRatio="video"
          />
          <div className="mt-4">
            <label className="block text-xs text-white/40 mb-1">Alt Text</label>
            <input
              type="text"
              value={data.image.alt}
              onChange={(e) => setData({ ...data, image: { ...data.image, alt: e.target.value } })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        </div>

        {/* Video Highlight Section */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
            Video Highlight Section
          </label>
          <p className="text-xs text-white/40 mb-4">
            Add a YouTube video URL to show a video showcase section on the homepage. Leave empty to hide the section.
          </p>
          
          {/* Video URL */}
          <div className="mb-4">
            <label className="block text-xs text-white/40 mb-1">YouTube URL</label>
            <input
              type="text"
              value={data.videoUrl || ""}
              onChange={(e) => setData({ ...data, videoUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
          
          {/* Section Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-white/40 mb-1">Section Title</label>
              <input
                type="text"
                value={data.videoTitle || ""}
                onChange={(e) => setData({ ...data, videoTitle: e.target.value })}
                placeholder="Behind the Lens"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Section Subtitle</label>
              <input
                type="text"
                value={data.videoSubtitle || ""}
                onChange={(e) => setData({ ...data, videoSubtitle: e.target.value })}
                placeholder="Watch our creative process..."
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>
          
          {/* Preview */}
          {data.videoUrl && getYouTubeId(data.videoUrl) && (
            <div className="mt-4">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                <img
                  src={`https://img.youtube.com/vi/${getYouTubeId(data.videoUrl)}/maxresdefault.jpg`}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-amber-500/90 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white ml-1" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                <span>✓</span> Valid YouTube URL detected
              </p>
            </div>
          )}
          {data.videoUrl && !getYouTubeId(data.videoUrl) && (
            <p className="text-xs text-amber-400 mt-2">
              Could not detect a valid YouTube video ID. Please check the URL format.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
