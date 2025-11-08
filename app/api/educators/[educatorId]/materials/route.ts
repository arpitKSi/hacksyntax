import { db } from "@/lib/db";
import { auth } from "@/shims/clerk-server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { educatorId: string } }
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

    const {
      title,
      description,
      fileUrl,
      fileName,
      fileType,
      fileSize,
      category,
      tags,
    } = await req.json();

    if (!title || !fileUrl || !fileName) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Parse tags if it's a string
    let parsedTags = tags;
    if (typeof tags === "string" && tags.trim()) {
      parsedTags = JSON.stringify(
        tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
      );
    } else if (!tags) {
      parsedTags = JSON.stringify([]);
    }

    const material = await db.sharedMaterial.create({
      data: {
        educatorId: params.educatorId,
        title,
        description: description || null,
        fileUrl,
        fileName,
        fileType: fileType || "FILE",
        fileSize: fileSize || null,
        category: category || null,
        tags: parsedTags,
      },
    });

    return NextResponse.json(material);
  } catch (error) {
    console.error("[EDUCATOR_MATERIALS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { educatorId: string } }
) {
  try {
    const materials = await db.sharedMaterial.findMany({
      where: {
        educatorId: params.educatorId,
        isPublic: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(materials);
  } catch (error) {
    console.error("[EDUCATOR_MATERIALS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
