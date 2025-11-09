import { db } from "@/lib/db";
import {
  asyncHandler,
  successResponse,
  NotFoundError,
  ForbiddenError,
} from "@/lib/errors";
import { requireEducator } from "@/lib/api-middleware";

export const POST = asyncHandler(async (
  req: Request,
  { params }: { params: { courseId: string; sectionId: string } }
) => {
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
    throw new ForbiddenError("You don't have permission to unpublish this section");
  }

  const section = await db.section.findUnique({
    where: { id: sectionId, courseId },
    select: { id: true },
  });

  if (!section) {
    throw new NotFoundError("Section not found");
  }

  const unpublishedSection = await db.section.update({
    where: { id: sectionId, courseId },
    data: { isPublished: false },
  });

  const remainingPublished = await db.section.count({
    where: { courseId, isPublished: true },
  });

  if (remainingPublished === 0) {
    await db.course.update({
      where: { id: courseId },
      data: { isPublished: false },
    });
  }

  return successResponse({ section: unpublishedSection });
});