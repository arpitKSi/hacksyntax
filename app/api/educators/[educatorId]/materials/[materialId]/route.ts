import { db } from "@/lib/db";
import { auth } from "@/shims/clerk-server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { educatorId: string; materialId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is the educator or an admin
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user || (user.id !== params.educatorId && user.role !== "ADMIN")) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Check if material exists and belongs to the educator
    const material = await db.sharedMaterial.findUnique({
      where: { id: params.materialId },
    });

    if (!material || material.educatorId !== params.educatorId) {
      return new NextResponse("Not found", { status: 404 });
    }

    await db.sharedMaterial.delete({
      where: { id: params.materialId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[EDUCATOR_MATERIAL_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { educatorId: string; materialId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user || (user.id !== params.educatorId && user.role !== "ADMIN")) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const material = await db.sharedMaterial.findUnique({
      where: { id: params.materialId },
    });

    if (!material || material.educatorId !== params.educatorId) {
      return new NextResponse("Not found", { status: 404 });
    }

    const { title, description, category, tags } = await req.json();

    // Parse tags if it's a string
    let parsedTags = tags;
    if (typeof tags === "string" && tags.trim()) {
      parsedTags = JSON.stringify(
        tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
      );
    }

    const updatedMaterial = await db.sharedMaterial.update({
      where: { id: params.materialId },
      data: {
        title: title || material.title,
        description: description !== undefined ? description : material.description,
        category: category !== undefined ? category : material.category,
        tags: parsedTags !== undefined ? parsedTags : material.tags,
      },
    });

    return NextResponse.json(updatedMaterial);
  } catch (error) {
    console.error("[EDUCATOR_MATERIAL_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Track download
export async function POST(
  req: Request,
  { params }: { params: { educatorId: string; materialId: string } }
) {
  try {
    await db.sharedMaterial.update({
      where: { id: params.materialId },
      data: {
        downloads: {
          increment: 1,
        },
      },
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("[EDUCATOR_MATERIAL_DOWNLOAD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
