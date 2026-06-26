"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ImageUploader } from "@/components/admin/image-uploader";

type SiteSettingsData = {
  siteName: string;
  siteUrl: string;
  metaTitle: string;
  metaDescription: string;
  locale: string;
  twitterHandle: string;
  keywords: string[];
  logo: string;
  favicon: string;
  ogImage: string;
  orgName: string;
  orgEmail: string;
  orgPhone: string;
  orgAddress: string;
  socialFacebook: string;
  socialInstagram: string;
  socialYoutube: string;
  socialLinkedin: string;
  socialTitle: string;
  socialSubtitle: string;
};

const inputClass =
  "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50";

export default function AdminSiteSettingsPage() {
  const [data, setData] = useState<SiteSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/seo")
      .then((res) => res.json())
      .then((raw) => {
        setData({
          siteName: raw.siteName || "",
          siteUrl: raw.siteUrl || "",
          metaTitle: raw.metaTitle || "",
          metaDescription: raw.metaDescription || "",
          locale: raw.locale || "en_US",
          twitterHandle: raw.twitterHandle || "",
          keywords: raw.keywords || [],
          logo: raw.logo || "",
          favicon: raw.favicon || "",
          ogImage: raw.ogImage || "",
          orgName: raw.orgName || "",
          orgEmail: raw.orgEmail || "",
          orgPhone: raw.orgPhone || "",
          orgAddress: raw.orgAddress || "",
          socialFacebook: raw.socialFacebook || "",
          socialInstagram: raw.socialInstagram || "",
          socialYoutube: raw.socialYoutube || "",
          socialLinkedin: raw.socialLinkedin || "",
          socialTitle: raw.socialTitle || "",
          socialSubtitle: raw.socialSubtitle || "",
        });
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
        setMessage("Site settings saved successfully!");
      } else {
        setMessage("Failed to save settings");
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
    return <div className="text-red-400">Failed to load site settings</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Site Settings</h1>
          <p className="text-sm text-white/50 mt-1">
            Logo, favicon, site name, SEO meta tags, and social sharing image
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-900 font-semibold rounded-lg transition-colors"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 p-3 rounded-lg text-sm ${
            message.includes("success")
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-6">
        {/* Brand Identity */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-white">Brand Identity</h2>
            <p className="text-xs text-white/40 mt-1">Site name and visual assets shown across the website</p>
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1">Site Name</label>
            <input
              type="text"
              value={data.siteName}
              onChange={(e) => setData({ ...data, siteName: e.target.value })}
              className={inputClass}
              placeholder="PixelRoot Studio"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <ImageUploader
                value={data.logo}
                onChange={(logo) => setData({ ...data, logo })}
                folder="brand"
                label="Logo"
                aspectRatio="landscape"
              />
              <p className="text-[10px] text-white/30 mt-1.5">Used in footer. PNG/SVG with transparent background recommended.</p>
            </div>
            <div>
              <ImageUploader
                value={data.favicon}
                onChange={(favicon) => setData({ ...data, favicon })}
                folder="brand"
                label="Favicon"
                aspectRatio="square"
              />
              <p className="text-[10px] text-white/30 mt-1.5">Browser tab icon. Square PNG, 32×32 or 64×64 px.</p>
            </div>
          </div>
        </div>

        {/* SEO & Meta Tags */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-white">SEO & Meta Tags</h2>
            <p className="text-xs text-white/40 mt-1">How your site appears in Google and social media previews</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-1">Site URL</label>
              <input
                type="url"
                value={data.siteUrl}
                onChange={(e) => setData({ ...data, siteUrl: e.target.value })}
                className={inputClass}
                placeholder="https://yourdomain.com"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Locale</label>
              <input
                type="text"
                value={data.locale}
                onChange={(e) => setData({ ...data, locale: e.target.value })}
                className={inputClass}
                placeholder="en_US"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1">Meta Title</label>
            <input
              type="text"
              value={data.metaTitle}
              onChange={(e) => setData({ ...data, metaTitle: e.target.value })}
              className={inputClass}
              placeholder="Professional Photography | PixelRoot Studio"
            />
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1">Meta Description</label>
            <textarea
              value={data.metaDescription}
              onChange={(e) => setData({ ...data, metaDescription: e.target.value })}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Premium photography for weddings, fashion, corporate events..."
            />
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1">Keywords (comma separated)</label>
            <input
              type="text"
              value={(data.keywords || []).join(", ")}
              onChange={(e) =>
                setData({
                  ...data,
                  keywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean),
                })
              }
              className={inputClass}
              placeholder="photography, wedding, fashion, dhaka"
            />
          </div>

          <div>
            <ImageUploader
              value={data.ogImage}
              onChange={(ogImage) => setData({ ...data, ogImage })}
              folder="brand"
              label="Social Share Image (OG Image)"
              aspectRatio="video"
            />
            <p className="text-[10px] text-white/30 mt-1.5">
              Shown when your site is shared on Facebook, WhatsApp, LinkedIn, etc. Recommended 1200×630 px.
            </p>
          </div>

          {/* Preview */}
          {(data.metaTitle || data.metaDescription || data.ogImage) && (
            <div className="border border-white/10 rounded-lg p-4 bg-black/20">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-3">Share Preview</p>
              <div className="max-w-sm rounded-lg overflow-hidden border border-white/10 bg-white/5">
                {data.ogImage && (
                  <div className="relative aspect-[1.91/1] bg-white/5">
                    <Image
                      src={data.ogImage}
                      alt="OG preview"
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                  </div>
                )}
                <div className="p-3">
                  <p className="text-[10px] text-white/40 uppercase truncate">
                    {data.siteUrl.replace(/^https?:\/\//, "")}
                  </p>
                  <p className="text-sm font-semibold text-white mt-0.5 line-clamp-1">
                    {data.metaTitle || data.siteName}
                  </p>
                  <p className="text-xs text-white/50 mt-0.5 line-clamp-2">
                    {data.metaDescription}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Social Media */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Social Media</h2>
            <p className="text-xs text-white/40 mt-1">Links shown in footer and homepage social section</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-1">Section Title</label>
              <input
                type="text"
                value={data.socialTitle}
                onChange={(e) => setData({ ...data, socialTitle: e.target.value })}
                className={inputClass}
                placeholder="Follow Our Journey"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Section Subtitle</label>
              <input
                type="text"
                value={data.socialSubtitle}
                onChange={(e) => setData({ ...data, socialSubtitle: e.target.value })}
                className={inputClass}
                placeholder="Stay connected for behind-the-scenes..."
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Facebook</label>
              <input
                type="url"
                value={data.socialFacebook}
                onChange={(e) => setData({ ...data, socialFacebook: e.target.value })}
                className={inputClass}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Instagram</label>
              <input
                type="url"
                value={data.socialInstagram}
                onChange={(e) => setData({ ...data, socialInstagram: e.target.value })}
                className={inputClass}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">YouTube</label>
              <input
                type="url"
                value={data.socialYoutube}
                onChange={(e) => setData({ ...data, socialYoutube: e.target.value })}
                className={inputClass}
                placeholder="https://youtube.com/..."
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">LinkedIn</label>
              <input
                type="url"
                value={data.socialLinkedin}
                onChange={(e) => setData({ ...data, socialLinkedin: e.target.value })}
                className={inputClass}
                placeholder="https://linkedin.com/..."
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">X (Twitter) Handle</label>
              <input
                type="text"
                value={data.twitterHandle}
                onChange={(e) => setData({ ...data, twitterHandle: e.target.value })}
                className={inputClass}
                placeholder="@pixelrootstudio"
              />
            </div>
          </div>
        </div>

        {/* Organization */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Organization</h2>
            <p className="text-xs text-white/40 mt-1">Business details for contact and structured data</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-1">Organization Name</label>
              <input
                type="text"
                value={data.orgName}
                onChange={(e) => setData({ ...data, orgName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Email</label>
              <input
                type="email"
                value={data.orgEmail}
                onChange={(e) => setData({ ...data, orgEmail: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Phone</label>
              <input
                type="text"
                value={data.orgPhone}
                onChange={(e) => setData({ ...data, orgPhone: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Address</label>
              <input
                type="text"
                value={data.orgAddress}
                onChange={(e) => setData({ ...data, orgAddress: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8 pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-900 font-semibold rounded-lg text-sm"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
