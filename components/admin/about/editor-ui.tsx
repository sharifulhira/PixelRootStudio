"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { AboutPageCopy } from "@/lib/about/page-copy";

export const inputClass =
  "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/50";

export type AboutRecord = {
  name: string;
  shortName?: string;
  title?: string;
  tagline?: string;
  bio: string[];
  vision?: string;
  stats: { value: string; label: string }[];
  skills: string[];
  experience: { company: string; role: string; period: string }[];
  photo: string;
  bannerImage: string;
  pageCopy: AboutPageCopy;
};

export function useAboutRecord() {
  const [data, setData] = useState<AboutRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/about")
      .then((res) => res.json())
      .then((raw) => {
        if (raw?.pageCopy) setData(raw);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function save(url: string, body: unknown) {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setMessage(res.ok ? "Saved. The public page will show this content." : "Failed to save");
    } catch {
      setMessage("An error occurred");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  }

  return { data, setData, loading, saving, message, save };
}

export function EditorShell({
  title,
  description,
  saving,
  message,
  onSave,
  children,
}: {
  title: string;
  description: string;
  saving: boolean;
  message: string;
  onSave: () => void;
  children: ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-sm text-white/50 mt-1">{description}</p>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-5 py-2.5 bg-[color:var(--primary)] hover:opacity-90 disabled:bg-[color:var(--primary)]/50 text-white font-semibold rounded-lg text-sm shrink-0"
        >
          {saving ? "Saving..." : "Save section"}
        </button>
      </div>
      {message && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/80">
          {message}
        </div>
      )}
      <div className="space-y-6 pb-10">{children}</div>
    </div>
  );
}

export function Panel({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        {hint && <p className="text-xs text-white/40 mt-1">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-white/40 mb-1">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={inputClass}
        />
      ) : (
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )}
    </label>
  );
}

export function StringList({
  label,
  hint,
  values,
  placeholder,
  onChange,
  multiline,
}: {
  label: string;
  hint?: string;
  values: string[];
  placeholder: string;
  onChange: (values: string[]) => void;
  multiline?: boolean;
}) {
  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= values.length) return;
    const next = [...values];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onChange(next);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-white">{label}</h3>
          {hint && <p className="text-xs text-white/40 mt-0.5">{hint}</p>}
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
        <p className="text-xs text-white/30">None yet. This block stays hidden on the page until you add one.</p>
      ) : (
        <div className="space-y-2">
          {values.map((value, index) => (
            <div key={index} className="flex gap-2">
              {multiline ? (
                <textarea
                  value={value}
                  placeholder={placeholder}
                  rows={3}
                  onChange={(e) => {
                    const next = [...values];
                    next[index] = e.target.value;
                    onChange(next);
                  }}
                  className={inputClass}
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  placeholder={placeholder}
                  onChange={(e) => {
                    const next = [...values];
                    next[index] = e.target.value;
                    onChange(next);
                  }}
                  className={inputClass}
                />
              )}
              <div className="flex flex-col gap-1">
                <button type="button" onClick={() => move(index, -1)} className="px-2 py-1 rounded border border-white/10 text-[10px] text-white/50 hover:text-white">Up</button>
                <button type="button" onClick={() => move(index, 1)} className="px-2 py-1 rounded border border-white/10 text-[10px] text-white/50 hover:text-white">Down</button>
                <button type="button" onClick={() => onChange(values.filter((_, i) => i !== index))} className="px-2 py-1 rounded border border-white/10 text-[10px] text-red-300/80 hover:text-red-300">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
