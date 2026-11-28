"use client";

import { useEffect, useState } from "react";

type ContactSettingsData = {
  phones: string[];
  emails: string[];
  address: string;
  socialFacebook: string;
  socialInstagram: string;
  socialYoutube: string;
  socialLinkedin: string;
  socialTiktok: string;
  twitterHandle: string;
  socialTitle: string;
  socialSubtitle: string;
};

const inputClass =
  "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/50";

const emptySettings: ContactSettingsData = {
  phones: [],
  emails: [],
  address: "",
  socialFacebook: "",
  socialInstagram: "",
  socialYoutube: "",
  socialLinkedin: "",
  socialTiktok: "",
  twitterHandle: "",
  socialTitle: "",
  socialSubtitle: "",
};

function ListEditor({
  label,
  hint,
  values,
  placeholder,
  type,
  onChange,
}: {
  label: string;
  hint: string;
  values: string[];
  placeholder: string;
  type: "text" | "email";
  onChange: (values: string[]) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-white">{label}</h3>
          <p className="text-xs text-white/40 mt-0.5">{hint}</p>
        </div>
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="text-xs font-semibold text-[color:var(--primary)] hover:opacity-80"
        >
          Add
        </button>
      </div>
      {values.length === 0 ? (
        <p className="text-xs text-white/30">None yet. Add one to show it on the site.</p>
      ) : (
        <div className="space-y-2">
          {values.map((value, index) => (
            <div key={index} className="flex gap-2">
              <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => {
                  const next = [...values];
                  next[index] = e.target.value;
                  onChange(next);
                }}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => onChange(values.filter((_, i) => i !== index))}
                className="px-3 rounded-lg border border-white/10 text-xs text-white/50 hover:text-white hover:border-white/30"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminContactSettingsPage() {
  const [data, setData] = useState<ContactSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/contact")
      .then((res) => res.json())
      .then((raw) => {
        setData({
          ...emptySettings,
          ...raw,
          phones: Array.isArray(raw.phones) ? raw.phones : [],
          emails: Array.isArray(raw.emails) ? raw.emails : [],
          address: raw.address || "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMessage("Contact settings saved. The public site will use these details.");
      } else {
        setMessage("Failed to save contact settings");
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
    return <div className="text-red-400">Failed to load contact settings</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Contact Settings</h1>
          <p className="text-sm text-white/50 mt-1">
            Phone, email, address, and social links used across the site
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-[color:var(--primary)] hover:opacity-90 disabled:bg-[color:var(--primary)]/50 text-white font-semibold rounded-lg transition-colors"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {message && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/80">
          {message}
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-white">Contact details</h2>
            <p className="text-xs text-white/40 mt-1">
              The first phone and email are the primary ones in the footer and structured data.
            </p>
          </div>

          <ListEditor
            label="Phone numbers"
            hint="Shown on the contact page, about page, and footer"
            values={data.phones}
            placeholder="+880 1XXX-XXXXXX"
            type="text"
            onChange={(phones) => setData({ ...data, phones })}
          />

          <ListEditor
            label="Email addresses"
            hint="Shown on the contact page, about page, and footer"
            values={data.emails}
            placeholder="hello@studio.com"
            type="email"
            onChange={(emails) => setData({ ...data, emails })}
          />

          <div>
            <label className="block text-xs text-white/40 mb-1">Physical address</label>
            <textarea
              value={data.address}
              onChange={(e) => setData({ ...data, address: e.target.value })}
              rows={3}
              className={inputClass}
              placeholder="Street, city, country"
            />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Social media</h2>
            <p className="text-xs text-white/40 mt-1">
              Links in the footer Follow Us section and the homepage social block
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-1">Section title</label>
              <input
                type="text"
                value={data.socialTitle}
                onChange={(e) => setData({ ...data, socialTitle: e.target.value })}
                className={inputClass}
                placeholder="Follow Our Journey"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Section subtitle</label>
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
              <label className="block text-xs text-white/40 mb-1">TikTok</label>
              <input
                type="url"
                value={data.socialTiktok}
                onChange={(e) => setData({ ...data, socialTiktok: e.target.value })}
                className={inputClass}
                placeholder="https://tiktok.com/@..."
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">X (Twitter) handle</label>
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
      </div>

      <div className="flex justify-end mt-8 pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-[color:var(--primary)] hover:opacity-90 disabled:bg-[color:var(--primary)]/50 text-white font-semibold rounded-lg text-sm"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
