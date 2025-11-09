import { db } from "@/lib/db";
import {
  asyncHandler,
  successResponse,
  NotFoundError,
  ForbiddenError,
} from "@/lib/errors";
import { requireEducator } from "@/lib/api-middleware";

/**
 * POST /api/courses/[courseId]/unpublish
 * Unpublish a course (hides it from students)
 */
export const POST = asyncHandler(async (req: Request, { params }: { params: { courseId: string } }) => {
  const user = await requireEducator(req);
  const { courseId } = params;

  const course = await db.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new NotFoundError("Course not found");
  }

  // Check ownership (allow admins to unpublish any course)
  if (user.role !== "ADMIN" && course.instructorId !== user.id) {
    throw new ForbiddenError("You don't have permission to unpublish this course");
  }

  const unpublishedCourse = await db.course.update({
    where: { id: courseId },
    data: { isPublished: false },
  });

  return successResponse({ course: unpublishedCourse });
});