import { db } from "@/lib/db";
import {
  asyncHandler,
  successResponse,
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "@/lib/errors";
import { requireEducator } from "@/lib/api-middleware";

/**
 * POST /api/courses/[courseId]/publish
 * Publish a course (makes it visible to students)
 */
export const POST = asyncHandler(async (req: Request, { params }: { params: { courseId: string } }) => {
  const user = await requireEducator(req);
  const { courseId } = params;

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      sections: {
        select: {
          id: true,
          isPublished: true,
        },
      },
    },
  });

  if (!course) {
    throw new NotFoundError("Course not found");
  }

  // Check ownership (allow admins to publish any course)
  if (user.role !== "ADMIN" && course.instructorId !== user.id) {
    throw new ForbiddenError("You don't have permission to publish this course");
  }

  // Validate course is ready for publishing
  const hasPublishedSections = course.sections.some(section => section.isPublished);

  if (
    !course.title ||
    !course.description ||
    !course.imageUrl ||
    !hasPublishedSections
  ) {
    throw new BadRequestError(
      "Course must have title, description, image, and at least one published section"
    );
  }

  const publishedCourse = await db.course.update({
    where: { id: courseId },
    data: { isPublished: true },
    include: {
      category: true,
      level: true,
      department: true,
    },
  });

  return successResponse({ course: publishedCourse });
});
