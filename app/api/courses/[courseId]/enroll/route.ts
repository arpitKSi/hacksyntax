import { db } from "@/lib/db";
import {
  asyncHandler,
  successResponse,
  NotFoundError,
  BadRequestError,
} from "@/lib/errors";
import { requireAuth } from "@/lib/api-middleware";

/**
 * POST /api/courses/[courseId]/enroll
 * Enroll in a course
 */
export const POST = asyncHandler(async (req: Request, { params }: { params: { courseId: string } }) => {
  const user = await requireAuth(req);
  const { courseId } = params;

  // Check if course exists and is published
  const course = await db.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new NotFoundError("Course not found");
  }

  if (!course.isPublished) {
    throw new BadRequestError("Cannot enroll in unpublished course");
  }

  // Check if already enrolled
  const existingEnrollment = await db.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: user.id,
        courseId,
      },
    },
  });

  if (existingEnrollment) {
    throw new BadRequestError("Already enrolled in this course");
  }

  // Create enrollment
  const enrollment = await db.enrollment.create({
    data: {
      studentId: user.id,
      courseId,
      progress: 0,
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  // Update course analytics
  await db.courseAnalytics.upsert({
    where: { courseId },
    update: {
      totalEnrollments: { increment: 1 },
    },
    create: {
      courseId,
      totalEnrollments: 1,
      completionRate: 0,
      totalRevenue: 0,
    },
  });

  return successResponse({ enrollment }, 201);
});
