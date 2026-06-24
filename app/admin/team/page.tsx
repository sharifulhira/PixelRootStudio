"use client";

import { useState, useEffect } from "react";
import { ImageUploader } from "@/components/admin/image-uploader";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  isFounder: boolean;
};

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTeam();
  }, []);

  async function loadTeam() {
    const res = await fetch("/api/admin/team");
    const data = await res.json();
    setMembers(data);
    setLoading(false);
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);

    const method = isNew ? "POST" : "PUT";
    const res = await fetch("/api/admin/team", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    if (res.ok) {
      await loadTeam();
      setEditing(null);
      setIsNew(false);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this team member?")) return;
    await fetch(`/api/admin/team?id=${id}`, { method: "DELETE" });
    await loadTeam();
  }

  if (loading) {
    return <div className="text-white/50">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Team</h1>
          <p className="text-sm text-white/50 mt-1">Manage team members</p>
        </div>
        <button
          onClick={() => {
            setEditing({ id: "", name: "", role: "", bio: "", photo: "", isFounder: false });
            setIsNew(true);
          }}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-colors"
        >
          Add Member
        </button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-800 border border-white/10 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-white mb-4">
              {isNew ? "Add Team Member" : "Edit Team Member"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/40 mb-1">Name</label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Role</label>
                <input
                  type="text"
                  value={editing.role}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Bio</label>
                <textarea
                  value={editing.bio}
                  onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>
              <ImageUploader
                value={editing.photo}
                onChange={(photo) => setEditing({ ...editing, photo })}
                folder="team"
                label="Photo"
                aspectRatio="square"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFounder"
                  checked={editing.isFounder}
                  onChange={(e) => setEditing({ ...editing, isFounder: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="isFounder" className="text-sm text-white/60">Founder</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setEditing(null); setIsNew(false); }}
                className="px-4 py-2 text-sm text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg text-sm"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team List */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        {members.length === 0 ? (
          <div className="p-12 text-center text-white/50">No team members yet</div>
        ) : (
          <div className="divide-y divide-white/5">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 hover:bg-white/5">
                <div className="flex items-center gap-3">
                  {member.photo && (
                    <img src={member.photo} alt="" className="w-12 h-12 object-cover rounded-full" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{member.name}</p>
                    <p className="text-xs text-white/40">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {member.isFounder && (
                    <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">Founder</span>
                  )}
                  <button
                    onClick={() => { setEditing(member); setIsNew(false); }}
                    className="text-sm text-amber-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="text-sm text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
