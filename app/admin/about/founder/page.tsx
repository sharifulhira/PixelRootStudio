"use client";

import Link from "next/link";
import { ImageUploader } from "@/components/admin/image-uploader";
import { EditorShell, Panel, TextField, useAboutRecord } from "@/components/admin/about/editor-ui";

export default function FounderEditorPage() {
  const { data, setData, loading, saving, message, save } = useAboutRecord();

  if (loading) return <div className="text-white/50">Loading...</div>;
  if (!data) return <div className="text-red-400">Failed to load the About page</div>;

  const copy = data.pageCopy;

  function setCopy(patch: Partial<typeof copy>) {
    setData({ ...data!, pageCopy: { ...copy, ...patch } });
  }

  return (
    <EditorShell
      title="Founder"
      description="Banner and portrait at the top of the About page."
      saving={saving}
      message={message}
      onSave={() =>
        save("/api/admin/about/founder", {
          name: data.name,
          shortName: data.shortName,
          title: data.title,
          tagline: data.tagline,
          photo: data.photo,
          bannerImage: data.bannerImage,
          bannerEyebrow: copy.bannerEyebrow,
          bannerHeadline: copy.bannerHeadline,
          bannerImageAlt: copy.bannerImageAlt,
          founderBadge: copy.founderBadge,
          bioEyebrow: copy.bioEyebrow,
        })
      }
    >
      <Panel title="Banner" hint="The full-width photo and headline at the top of /about.">
        <ImageUploader
          value={data.bannerImage}
          onChange={(bannerImage) => setData({ ...data, bannerImage })}
          folder="about"
          label="Banner photo"
          aspectRatio="video"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Eyebrow" value={copy.bannerEyebrow} onChange={(bannerEyebrow) => setCopy({ bannerEyebrow })} />
          <TextField label="Headline" value={copy.bannerHeadline} onChange={(bannerHeadline) => setCopy({ bannerHeadline })} />
        </div>
        <TextField label="Tagline" value={data.tagline || ""} onChange={(tagline) => setData({ ...data, tagline })} />
        <TextField label="Photo description" value={copy.bannerImageAlt} onChange={(bannerImageAlt) => setCopy({ bannerImageAlt })} placeholder="Used as the image alt text" />
      </Panel>

      <Panel title="Portrait" hint="The founder photo and name beside the biography.">
        <ImageUploader
          value={data.photo}
          onChange={(photo) => setData({ ...data, photo })}
          folder="about"
          label="Portrait"
          aspectRatio="square"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Badge" value={copy.founderBadge} onChange={(founderBadge) => setCopy({ founderBadge })} placeholder="Founder" />
          <TextField label="Section label" value={copy.bioEyebrow} onChange={(bioEyebrow) => setCopy({ bioEyebrow })} placeholder="The Photographer" />
          <TextField label="Name" value={data.name} onChange={(name) => setData({ ...data, name })} />
          <TextField label="Short name" value={data.shortName || ""} onChange={(shortName) => setData({ ...data, shortName })} />
          <TextField label="Role" value={data.title || ""} onChange={(title) => setData({ ...data, title })} />
        </div>
        <p className="text-xs text-white/40">
          Phone and email under the portrait come from{" "}
          <Link href="/admin/contact" className="text-[color:var(--primary)] hover:underline">Contact Settings</Link>.
        </p>
      </Panel>
    </EditorShell>
  );
}
