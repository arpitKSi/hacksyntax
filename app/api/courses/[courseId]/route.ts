import { db } from "@/lib/db";
import Mux from "@mux/mux-node";
import {
  asyncHandler,
  successResponse,
  NotFoundError,
  ForbiddenError,
} from "@/lib/errors";
import { requireAuth, requireEducator, parseBody } from "@/lib/api-middleware";
import { updateCourseSchema } from "@/lib/validations";

const muxClient =
  process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET
    ? new Mux({
        tokenId: process.env.MUX_TOKEN_ID,
        tokenSecret: process.env.MUX_TOKEN_SECRET,
      })
    : null;

const muxVideo = muxClient?.video;

/**
 * GET /api/courses/[courseId]
 * Get a single course with full details
 */
export const GET = asyncHandler(async (req: Request, { params }: { params: { courseId: string } }) => {
  const { courseId } = params;
  
  // Optional auth to determine visibility
  let user: any = null;
  try {
    user = await requireAuth(req);
  } catch {
    // Continue without auth
  }

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
          designation: true,
          department: true,
        },
      },
      category: true,
      subCategory: true,
      level: true,
      department: true,
      sections: {
        where: user?.id ? undefined : { isPublished: true },
        orderBy: { position: "asc" },
        include: {
          resources: true,
          muxData: true,
        },
      },
      enrollments: user?.id
        ? {
            where: { studentId: user.id },
          }
        : undefined,
      ratings: {
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  if (!course) {
    throw new NotFoundError("Course not found");
  }

  // Check visibility permissions
  const isOwner = user?.id === course.instructorId;
  const isAdmin = user?.role === "ADMIN";

  if (!course.isPublished && !isOwner && !isAdmin) {
    throw new ForbiddenError("This course is not published");
  }

  return successResponse(course);
});

/**
 * PATCH /api/courses/[courseId]
 * Update a course (owner or admin only)
 */
export const PATCH = asyncHandler(async (req: Request, { params }: { params: { courseId: string } }) => {
  const { courseId } = params;
  const user = await requireEducator(req);

  const body = await parseBody(req);
  const validatedData = updateCourseSchema.parse(body);

  // Check course exists and ownership
  const existingCourse = await db.course.findUnique({
    where: { id: courseId },
  });

  if (!existingCourse) {
    throw new NotFoundError("Course not found");
  }

  // Check ownership (allow admins to edit any course)
  if (user.role !== "ADMIN" && existingCourse.instructorId !== user.id) {
    throw new ForbiddenError("You don't have permission to edit this course");
  }

  // Prepare update data
  const updateData: any = {};
  
  if (validatedData.title !== undefined) updateData.title = validatedData.title;
  if (validatedData.subtitle !== undefined) updateData.subtitle = validatedData.subtitle;
  if (validatedData.description !== undefined) updateData.description = validatedData.description;
  if (validatedData.imageUrl !== undefined) updateData.imageUrl = validatedData.imageUrl;
  if (validatedData.price !== undefined) updateData.price = validatedData.price;
  if (validatedData.categoryId !== undefined) updateData.categoryId = validatedData.categoryId;
  if (validatedData.subCategoryId !== undefined) updateData.subCategoryId = validatedData.subCategoryId;
  if (validatedData.levelId !== undefined) updateData.levelId = validatedData.levelId;
  if (validatedData.departmentId !== undefined) updateData.departmentId = validatedData.departmentId;
  if (validatedData.isPublished !== undefined) updateData.isPublished = validatedData.isPublished;

  const course = await db.course.update({
    where: { id: courseId },
    data: updateData,
    include: {
      instructor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
          designation: true,
        },
      },
      category: true,
      subCategory: true,
      level: true,
      department: true,
    },
  });

  return successResponse(course);
});

/**
 * DELETE /api/courses/[courseId]
 * Delete a course (owner or admin only)
 */
export const DELETE = asyncHandler(async (req: Request, { params }: { params: { courseId: string } }) => {
  const { courseId } = params;
  const user = await requireEducator(req);

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      sections: {
        include: {
          muxData: true,
        },
      },
    },
  });

  if (!course) {
    throw new NotFoundError("Course not found");
  }

  // Check ownership (allow admins to delete any course)
  if (user.role !== "ADMIN" && course.instructorId !== user.id) {
    throw new ForbiddenError("You don't have permission to delete this course");
  }

  // Delete Mux assets for all sections
  if (muxVideo) {
    for (const section of course.sections) {
      if (section.muxData?.assetId) {
        try {
          await muxVideo.assets.delete(section.muxData.assetId);
        } catch (error) {
          console.error(`Failed to delete Mux asset ${section.muxData.assetId}:`, error);
          // Continue with deletion even if Mux deletion fails
        }
      }
    }
  }

  // Delete course (cascade will handle related records)
  await db.course.delete({
    where: { id: courseId },
  });

  return successResponse({ message: "Course deleted successfully" });
});
