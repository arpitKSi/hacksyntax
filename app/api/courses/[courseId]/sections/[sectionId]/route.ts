import { db } from "@/lib/db";
import Mux from "@mux/mux-node";
import { z } from "zod";
import {
  asyncHandler,
  successResponse,
  NotFoundError,
  ForbiddenError,
} from "@/lib/errors";
import { optionalAuth, requireEducator, parseBody } from "@/lib/api-middleware";

const updateSectionSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  videoUrl: z
    .string()
    .trim()
    .url()
    .or(z.literal(""))
    .nullable()
    .optional(),
  isFree: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

const muxClient =
  process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET
    ? new Mux({
        tokenId: process.env.MUX_TOKEN_ID,
        tokenSecret: process.env.MUX_TOKEN_SECRET,
      })
    : null;

const muxVideo = muxClient?.video;

type RouteParams = { params: { courseId: string; sectionId: string } };

export const GET = asyncHandler(async (req: Request, { params }: RouteParams) => {
  const user = await optionalAuth(req);
  const { courseId, sectionId } = params;

  const section = await db.section.findUnique({
    where: { id: sectionId, courseId },
    include: {
      resources: true,
      muxData: true,
      course: {
        select: {
          id: true,
          title: true,
          instructorId: true,
          isPublished: true,
        },
      },
    },
  });

  if (!section) {
    throw new NotFoundError("Section not found");
  }

  const isOwner =
    !!user && (user.role === "ADMIN" || user.id === section.course.instructorId);

  if (!section.isPublished && !isOwner) {
    throw new ForbiddenError("This section is not published");
  }

  if (
    user &&
    (user.role === "LEARNER" || user.role === "STUDENT") &&
    !section.isFree &&
    !isOwner
  ) {
    const enrollment = await db.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId,
        },
      },
    });

    if (!enrollment) {
      throw new ForbiddenError("You must enroll in the course to access this section");
    }
  }

  const { course, ...sectionData } = section;

  return successResponse({
    section: sectionData,
    course,
  });
});

export const PATCH = asyncHandler(async (req: Request, { params }: RouteParams) => {
  const user = await requireEducator(req);
  const { courseId, sectionId } = params;

  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { instructorId: true },
  });

  if (!course) {
    throw new NotFoundError("Course not found");
  }

  if (user.role !== "ADMIN" && course.instructorId !== user.id) {
    throw new ForbiddenError("You don't have permission to edit this section");
  }

  const existingSection = await db.section.findUnique({
    where: { id: sectionId, courseId },
    include: {
      muxData: true,
    },
  });

  if (!existingSection) {
    throw new NotFoundError("Section not found");
  }

  const body = await parseBody(req);
  const data = updateSectionSchema.parse(body);

  const updateData: Record<string, unknown> = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.isFree !== undefined) updateData.isFree = data.isFree;
  if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;

  if (data.videoUrl !== undefined) {
    const normalizedUrl = data.videoUrl ? data.videoUrl : null;
    updateData.videoUrl = normalizedUrl;

    if (existingSection.muxData && muxVideo && existingSection.muxData.assetId) {
      try {
        await muxVideo.assets.delete(existingSection.muxData.assetId);
      } catch (error) {
        console.error("Failed to delete Mux asset:", error);
      }
    }

    if (normalizedUrl && muxVideo) {
      try {
        const asset = await muxVideo.assets.create({
          input: [{ url: normalizedUrl }],
          playback_policy: ["public"],
          test: process.env.NODE_ENV !== "production",
        });

        await db.muxData.upsert({
          where: { sectionId },
          update: {
            assetId: asset.id,
            playbackId: asset.playback_ids?.[0]?.id ?? null,
          },
          create: {
            sectionId,
            assetId: asset.id,
            playbackId: asset.playback_ids?.[0]?.id ?? null,
          },
        });
      } catch (error) {
        console.error("Failed to create Mux asset:", error);
      }
    } else if (!normalizedUrl && existingSection.muxData) {
      await db.muxData
        .delete({ where: { sectionId } })
        .catch(() => undefined);
    }
  }

  const updatedSection = await db.section.update({
    where: { id: sectionId, courseId },
    data: updateData,
    include: {
      resources: true,
      muxData: true,
    },
  });

  return successResponse({ section: updatedSection });
});

export const DELETE = asyncHandler(async (req: Request, { params }: RouteParams) => {
  const user = await requireEducator(req);
  const { courseId, sectionId } = params;

  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { instructorId: true },
  });

  if (!course) {
    throw new NotFoundError("Course not found");
  }

  if (user.role !== "ADMIN" && course.instructorId !== user.id) {
    throw new ForbiddenError("You don't have permission to delete this section");
  }

  const section = await db.section.findUnique({
    where: { id: sectionId, courseId },
    include: { muxData: true },
  });

  if (!section) {
    throw new NotFoundError("Section not found");
  }

  if (section.muxData && muxVideo && section.muxData.assetId) {
    try {
      await muxVideo.assets.delete(section.muxData.assetId);
    } catch (error) {
      console.error("Failed to delete Mux asset:", error);
    }
  }

  await db.muxData.deleteMany({ where: { sectionId } });
  await db.section.delete({ where: { id: sectionId } });

  return successResponse({ deleted: true });
});
