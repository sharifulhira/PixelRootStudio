"use client";

import { EditorShell, Panel, StringList, TextField, inputClass, useAboutRecord } from "@/components/admin/about/editor-ui";

type Journey = { role: string; company: string; period: string };

export default function ExperienceEditorPage() {
  const { data, setData, loading, saving, message, save } = useAboutRecord();

  if (loading) return <div className="text-white/50">Loading...</div>;
  if (!data) return <div className="text-red-400">Failed to load the About page</div>;

  const copy = data.pageCopy;
  const experience = data.experience || [];

  function setExperience(next: Journey[]) {
    setData({ ...data!, experience: next });
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= experience.length) return;
    const next = [...experience];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setExperience(next);
  }

  return (
    <EditorShell
      title="Experience"
      description="Biography, expertise, and professional journey under the founder portrait on /about."
      saving={saving}
      message={message}
      onSave={() =>
        save("/api/admin/about/experience", {
          bio: data.bio,
          skills: data.skills,
          skillsLabel: copy.skillsLabel,
          experience: data.experience,
          journeyLabel: copy.journeyLabel,
        })
      }
    >
      <Panel title="Biography" hint="Each paragraph is its own block under the portrait.">
        <StringList
          label="Paragraphs"
          values={data.bio || []}
          placeholder="Write a paragraph"
          multiline
          onChange={(bio) => setData({ ...data, bio })}
        />
      </Panel>

      <Panel title="Expertise" hint="The tag row under the biography.">
        <TextField
          label="Heading"
          value={copy.skillsLabel}
          onChange={(skillsLabel) => setData({ ...data, pageCopy: { ...copy, skillsLabel } })}
        />
        <StringList
          label="Skills"
          values={data.skills || []}
          placeholder="Wedding Photography"
          onChange={(skills) => setData({ ...data, skills })}
        />
      </Panel>

      <Panel title="Professional journey" hint="The timeline under the skills.">
        <TextField
          label="Heading"
          value={copy.journeyLabel}
          onChange={(journeyLabel) => setData({ ...data, pageCopy: { ...copy, journeyLabel } })}
        />
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Roles</h3>
          <button
            type="button"
            onClick={() => setExperience([...experience, { role: "", company: "", period: "" }])}
            className="text-xs font-semibold text-[color:var(--primary)]"
          >
            Add role
          </button>
        </div>
        {experience.length === 0 && (
          <p className="text-xs text-white/30">No roles yet. The timeline stays hidden until you add one.</p>
        )}
        <div className="space-y-3">
          {experience.map((item, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 border border-white/10 rounded-lg p-3">
              <input className={inputClass} placeholder="Role" value={item.role} onChange={(e) => {
                const next = [...experience];
                next[index] = { ...item, role: e.target.value };
                setExperience(next);
              }} />
              <input className={inputClass} placeholder="Company" value={item.company} onChange={(e) => {
                const next = [...experience];
                next[index] = { ...item, company: e.target.value };
                setExperience(next);
              }} />
              <input className={inputClass} placeholder="2009 – Present" value={item.period} onChange={(e) => {
                const next = [...experience];
                next[index] = { ...item, period: e.target.value };
                setExperience(next);
              }} />
              <div className="sm:col-span-3 flex gap-2">
                <button type="button" onClick={() => move(index, -1)} className="text-xs text-white/50 hover:text-white">Up</button>
                <button type="button" onClick={() => move(index, 1)} className="text-xs text-white/50 hover:text-white">Down</button>
                <button type="button" onClick={() => setExperience(experience.filter((_, i) => i !== index))} className="text-xs text-red-300/80 hover:text-red-300">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </EditorShell>
  );
}
