import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, projects, projectGallery, projectTeam } from "@/lib/db";
import { getProjects, getProjectBySlug, getProjectById } from "@/lib/db/queries";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const id = searchParams.get("id");
    
    if (id) {
      const project = getProjectById(id);
      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
      return NextResponse.json(project);
    }
    
    if (slug) {
      const project = getProjectBySlug(slug);
      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
      return NextResponse.json(project);
    }
    
    const data = getProjects();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await request.json();
    
    const slug = data.slug || data.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    
    const result = db.insert(projects)
      .values({
        title: data.title,
        slug,
        summary: data.summary,
        body: JSON.stringify(data.body || []),
        date: data.date,
        client: data.client,
        featured: data.featured ?? false,
        coverSrc: data.coverImage?.src,
        coverAlt: data.coverImage?.alt,
        categoryId: data.categoryId || null,
        seoTitle: data.seo?.metaTitle,
        seoDescription: data.seo?.metaDescription,
        sortOrder: data.sortOrder ?? 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
      .get();
    
    // Insert gallery images
    if (data.gallery && data.gallery.length > 0) {
      for (let i = 0; i < data.gallery.length; i++) {
        const img = data.gallery[i];
        db.insert(projectGallery)
          .values({
            projectId: result.id,
            src: img.src,
            alt: img.alt,
            caption: img.caption,
            sortOrder: i,
          })
          .run();
      }
    }
    
    // Insert team members
    if (data.teamMemberIds && data.teamMemberIds.length > 0) {
      for (const memberId of data.teamMemberIds) {
        const numericId = typeof memberId === "string" && memberId.startsWith("t")
          ? parseInt(memberId.slice(1))
          : parseInt(memberId);
        
        db.insert(projectTeam)
          .values({
            projectId: result.id,
            teamMemberId: numericId,
          })
          .run();
      }
    }
    
    revalidatePath("/portfolio");
    revalidatePath(`/portfolio/${slug}`);
    
    return NextResponse.json({ ...result, slug });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    
    // Extract numeric ID
    const numericId = typeof data.id === "string" && data.id.startsWith("p")
      ? parseInt(data.id.slice(1))
      : parseInt(data.id);
    
    db.update(projects)
      .set({
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        body: JSON.stringify(data.body || []),
        date: data.date,
        client: data.client,
        featured: data.featured,
        coverSrc: data.coverImage?.src,
        coverAlt: data.coverImage?.alt,
        categoryId: data.categoryId,
        seoTitle: data.seo?.metaTitle,
        seoDescription: data.seo?.metaDescription,
        sortOrder: data.sortOrder,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, numericId))
      .run();
    
    // Update gallery - delete old and insert new
    db.delete(projectGallery).where(eq(projectGallery.projectId, numericId)).run();
    if (data.gallery && data.gallery.length > 0) {
      for (let i = 0; i < data.gallery.length; i++) {
        const img = data.gallery[i];
        db.insert(projectGallery)
          .values({
            projectId: numericId,
            src: img.src,
            alt: img.alt,
            caption: img.caption,
            sortOrder: i,
          })
          .run();
      }
    }
    
    // Update team - delete old and insert new
    db.delete(projectTeam).where(eq(projectTeam.projectId, numericId)).run();
    if (data.teamMemberIds && data.teamMemberIds.length > 0) {
      for (const memberId of data.teamMemberIds) {
        const memberNumericId = typeof memberId === "string" && memberId.startsWith("t")
          ? parseInt(memberId.slice(1))
          : parseInt(memberId);
        
        db.insert(projectTeam)
          .values({
            projectId: numericId,
            teamMemberId: memberNumericId,
          })
          .run();
      }
    }
    
    revalidatePath("/portfolio");
    revalidatePath(`/portfolio/${data.slug}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    
    const numericId = id.startsWith("p") ? parseInt(id.slice(1)) : parseInt(id);
    
    // Gallery and team are deleted via cascade
    db.delete(projects).where(eq(projects.id, numericId)).run();
    
    revalidatePath("/portfolio");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
