"use client";

import { useEffect, useState } from "react";
import { ImageUploader } from "@/components/admin/image-uploader";
import { EditorShell, Panel, TextField, useAboutRecord } from "@/components/admin/about/editor-ui";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  isFounder: boolean;
  sortOrder: number;
};

const emptyMember: TeamMember = {
  id: "",
  name: "",
  role: "",
  bio: "",
  photo: "",
  isFounder: false,
  sortOrder: 0,
};

export default function TeamEditorPage() {
  const about = useAboutRecord();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [memberSaving, setMemberSaving] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    const res = await fetch("/api/admin/team");
    const data = await res.json();
    setMembers(Array.isArray(data) ? data : []);
  }

  async function saveMember() {
    if (!editing) return;
    setMemberSaving(true);
    const res = await fetch("/api/admin/team", {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (res.ok) {
      await loadMembers();
      setEditing(null);
      setIsNew(false);
    }
    setMemberSaving(false);
  }

  async function removeMember(id: string) {
    if (!confirm("Delete this team member?")) return;
    await fetch(`/api/admin/team?id=${id}`, { method: "DELETE" });
    await loadMembers();
  }

  async function moveMember(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= members.length) return;
    const next = [...members];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    await Promise.all(
      next.map((member, sortOrder) =>
        fetch("/api/admin/team", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...member, sortOrder }),
        })
      )
    );
    await loadMembers();
  }

  if (about.loading) return <div className="text-white/50">Loading...</div>;
  if (!about.data) return <div className="text-red-400">Failed to load the About page</div>;

  const data = about.data;
  const copy = data.pageCopy;
  const teamPage = copy.teamPage;

  function setTeamPage(patch: Partial<typeof teamPage>) {
    about.setData({
      ...data,
      pageCopy: { ...copy, teamPage: { ...teamPage, ...patch } },
    });
  }

  return (
    <>
      <EditorShell
        title="Team"
        description="People grid on the About page. The same people also appear on the Team page."
        saving={about.saving}
        message={about.message}
        onSave={() =>
          about.save("/api/admin/about/team", {
            teamBadge: copy.teamBadge,
            teamTitle: copy.teamTitle,
            teamSubtitle: copy.teamSubtitle,
            teamPage,
          })
        }
      >
        <Panel title="About page heading" hint="The title above the people grid on /about.">
          <TextField label="Badge" value={copy.teamBadge} onChange={(teamBadge) => about.setData({ ...data, pageCopy: { ...copy, teamBadge } })} />
          <TextField label="Title" value={copy.teamTitle} onChange={(teamTitle) => about.setData({ ...data, pageCopy: { ...copy, teamTitle } })} multiline />
          <p className="text-[11px] text-white/30 -mt-2">A line break splits the title on larger screens.</p>
          <TextField label="Subtitle" value={copy.teamSubtitle} onChange={(teamSubtitle) => about.setData({ ...data, pageCopy: { ...copy, teamSubtitle } })} multiline />
        </Panel>

        <Panel title="People" hint="Photos, names, roles, and descriptions. Mark one person as founder to show the founder badge.">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setEditing(emptyMember);
                setIsNew(true);
              }}
              className="text-xs font-semibold text-[color:var(--primary)]"
            >
              Add person
            </button>
          </div>
          {members.length === 0 ? (
            <p className="text-xs text-white/30">No people yet. The grid stays hidden until you add someone.</p>
          ) : (
            <div className="divide-y divide-white/10 border border-white/10 rounded-lg">
              {members.map((member, index) => (
                <div key={member.id} className="flex items-center justify-between gap-3 p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {member.photo && (
                      <img src={member.photo} alt="" className="w-12 h-12 object-cover rounded-lg shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{member.name}</p>
                      <p className="text-xs text-white/40 truncate">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-xs">
                    {member.isFounder && <span className="text-[color:var(--primary)]">Founder</span>}
                    <button type="button" onClick={() => moveMember(index, -1)} className="text-white/50 hover:text-white">Up</button>
                    <button type="button" onClick={() => moveMember(index, 1)} className="text-white/50 hover:text-white">Down</button>
                    <button type="button" onClick={() => { setEditing(member); setIsNew(false); }} className="text-[color:var(--primary)]">Edit</button>
                    <button type="button" onClick={() => removeMember(member.id)} className="text-red-300">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Team page (/team)" hint="This copy is the Team page header and closing line, not the About page.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label="Eyebrow" value={teamPage.eyebrow} onChange={(eyebrow) => setTeamPage({ eyebrow })} />
            <TextField label="Headline" value={teamPage.title} onChange={(title) => setTeamPage({ title })} />
          </div>
          <TextField label="Intro" value={teamPage.subtitle} onChange={(subtitle) => setTeamPage({ subtitle })} multiline />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label="Primary button" value={teamPage.primaryLabel} onChange={(primaryLabel) => setTeamPage({ primaryLabel })} />
            <TextField label="Primary link" value={teamPage.primaryHref} onChange={(primaryHref) => setTeamPage({ primaryHref })} />
            <TextField label="Secondary button" value={teamPage.secondaryLabel} onChange={(secondaryLabel) => setTeamPage({ secondaryLabel })} />
            <TextField label="Secondary link" value={teamPage.secondaryHref} onChange={(secondaryHref) => setTeamPage({ secondaryHref })} />
          </div>
          <TextField label="Closing headline" value={teamPage.closingTitle} onChange={(closingTitle) => setTeamPage({ closingTitle })} />
          <TextField label="Closing text" value={teamPage.closingText} onChange={(closingText) => setTeamPage({ closingText })} multiline />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label="Closing button" value={teamPage.closingButtonLabel} onChange={(closingButtonLabel) => setTeamPage({ closingButtonLabel })} />
            <TextField label="Closing link" value={teamPage.closingButtonHref} onChange={(closingButtonHref) => setTeamPage({ closingButtonHref })} />
          </div>
        </Panel>
      </EditorShell>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-800 border border-white/10 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-white mb-4">{isNew ? "Add person" : "Edit person"}</h2>
            <div className="space-y-4">
              <TextField label="Name" value={editing.name} onChange={(name) => setEditing({ ...editing, name })} />
              <TextField label="Role" value={editing.role} onChange={(role) => setEditing({ ...editing, role })} />
              <TextField label="Description" value={editing.bio} onChange={(bio) => setEditing({ ...editing, bio })} multiline />
              <ImageUploader
                value={editing.photo}
                onChange={(photo) => setEditing({ ...editing, photo })}
                folder="team"
                label="Photo"
                aspectRatio="square"
              />
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={editing.isFounder}
                  onChange={(e) => setEditing({ ...editing, isFounder: e.target.checked })}
                />
                Show the founder badge
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => { setEditing(null); setIsNew(false); }} className="px-4 py-2 text-sm text-white/60">Cancel</button>
              <button type="button" onClick={saveMember} disabled={memberSaving} className="px-4 py-2 bg-[color:var(--primary)] text-white font-semibold rounded-lg text-sm">
                {memberSaving ? "Saving..." : "Save person"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
