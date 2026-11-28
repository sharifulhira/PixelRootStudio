"use client";

import Link from "next/link";
import { ImageUploader } from "@/components/admin/image-uploader";
import { EditorShell, Panel, StringList, TextField, inputClass, useAboutRecord } from "@/components/admin/about/editor-ui";

type Stat = { value: string; label: string };

export default function AboutDetailsPage() {
  const { data, setData, loading, saving, message, save } = useAboutRecord();

  if (loading) return <div className="text-white/50">Loading...</div>;
  if (!data) return <div className="text-red-400">Failed to load the About page</div>;

  const copy = data.pageCopy;
  const stats = data.stats || [];

  function setCopy(patch: Partial<typeof copy>) {
    setData({ ...data!, pageCopy: { ...copy, ...patch } });
  }

  function setStats(next: Stat[]) {
    setData({ ...data!, stats: next });
  }

  function moveStat(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= stats.length) return;
    const next = [...stats];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setStats(next);
  }

  return (
    <EditorShell
      title="Other details"
      description="Stats, vision quote, closing band, and the About page title shown in search results."
      saving={saving}
      message={message}
      onSave={() =>
        save("/api/admin/about/details", {
          stats: data.stats,
          vision: data.vision,
          visionEyebrow: copy.visionEyebrow,
          visionCredit: copy.visionCredit,
          seoTitle: copy.seoTitle,
          seoDescription: copy.seoDescription,
          cta: copy.cta,
        })
      }
    >
      <Panel title="Stats bar" hint="The number row between the biography and the vision quote on /about.">
        <div className="flex justify-end">
          <button type="button" onClick={() => setStats([...stats, { value: "", label: "" }])} className="text-xs font-semibold text-[color:var(--primary)]">
            Add stat
          </button>
        </div>
        {stats.length === 0 && <p className="text-xs text-white/30">No stats. This row stays hidden until you add one.</p>}
        <div className="space-y-2">
          {stats.map((stat, index) => (
            <div key={index} className="flex gap-2">
              <input className={inputClass} placeholder="15+" value={stat.value} onChange={(e) => {
                const next = [...stats];
                next[index] = { ...stat, value: e.target.value };
                setStats(next);
              }} />
              <input className={inputClass} placeholder="Years Experience" value={stat.label} onChange={(e) => {
                const next = [...stats];
                next[index] = { ...stat, label: e.target.value };
                setStats(next);
              }} />
              <button type="button" onClick={() => moveStat(index, -1)} className="text-xs text-white/50">Up</button>
              <button type="button" onClick={() => moveStat(index, 1)} className="text-xs text-white/50">Down</button>
              <button type="button" onClick={() => setStats(stats.filter((_, i) => i !== index))} className="text-xs text-red-300">Remove</button>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Vision" hint="The quote on the dark band.">
        <TextField label="Eyebrow" value={copy.visionEyebrow} onChange={(visionEyebrow) => setCopy({ visionEyebrow })} />
        <TextField label="Quote" value={data.vision || ""} onChange={(vision) => setData({ ...data, vision })} multiline />
        <TextField label="Attribution" value={copy.visionCredit} onChange={(visionCredit) => setCopy({ visionCredit })} />
      </Panel>

      <Panel title="Closing band" hint="The last section of /about. Phone and email in that band come from Contact Settings.">
        <StringList
          label="Service labels"
          values={copy.cta.services}
          placeholder="Weddings"
          onChange={(services) => setCopy({ cta: { ...copy.cta, services } })}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Headline" value={copy.cta.headline} onChange={(headline) => setCopy({ cta: { ...copy.cta, headline } })} />
          <TextField label="Accent line" value={copy.cta.headlineAccent} onChange={(headlineAccent) => setCopy({ cta: { ...copy.cta, headlineAccent } })} />
        </div>
        <TextField label="Supporting text" value={copy.cta.subtext} onChange={(subtext) => setCopy({ cta: { ...copy.cta, subtext } })} multiline />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Primary button" value={copy.cta.primaryLabel} onChange={(primaryLabel) => setCopy({ cta: { ...copy.cta, primaryLabel } })} />
          <TextField label="Primary link" value={copy.cta.primaryHref} onChange={(primaryHref) => setCopy({ cta: { ...copy.cta, primaryHref } })} />
          <TextField label="Secondary button" value={copy.cta.secondaryLabel} onChange={(secondaryLabel) => setCopy({ cta: { ...copy.cta, secondaryLabel } })} />
          <TextField label="Secondary link" value={copy.cta.secondaryHref} onChange={(secondaryHref) => setCopy({ cta: { ...copy.cta, secondaryHref } })} />
        </div>
        <ImageUploader
          value={copy.cta.image}
          onChange={(image) => setCopy({ cta: { ...copy.cta, image } })}
          folder="about"
          label="Background photo"
          aspectRatio="video"
        />
        <p className="text-xs text-white/40">
          The phone and email under the buttons are edited in{" "}
          <Link href="/admin/contact" className="text-[color:var(--primary)] hover:underline">Contact Settings</Link>.
        </p>
      </Panel>

      <Panel title="Search result" hint="The title and description for /about.">
        <TextField label="Page title" value={copy.seoTitle} onChange={(seoTitle) => setCopy({ seoTitle })} />
        <TextField label="Description" value={copy.seoDescription} onChange={(seoDescription) => setCopy({ seoDescription })} multiline />
      </Panel>
    </EditorShell>
  );
}
