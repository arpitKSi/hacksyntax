import { db } from "@/lib/db";
import {
  asyncHandler,
  successResponse,
  NotFoundError,
  BadRequestError,
} from "@/lib/errors";
import { requireAuth } from "@/lib/api-middleware";

/**
 * POST /api/progress/[sectionId]
 * Mark a section as complete/incomplete
 */
export const POST = asyncHandler(async (req: Request, { params }: { params: { sectionId: string } }) => {
  const user = await requireAuth(req);
  const { sectionId } = params;

  // Get section and course info
  const section = await db.section.findUnique({
    where: { id: sectionId },
    include: {
      course: {
        include: {
          sections: {
            select: { id: true },
          },
        },
      },
    },
  });

  if (!section) {
    throw new NotFoundError("Section not found");
  }

  // Check if user is enrolled
  const enrollment = await db.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: user.id,
        courseId: section.courseId,
      },
    },
  });

  if (!enrollment) {
    throw new BadRequestError("You must be enrolled in this course");
  }

  // Toggle progress
  const existingProgress = await db.progress.findUnique({
    where: {
      studentId_sectionId: {
        studentId: user.id,
        sectionId,
      },
    },
  });

  let progress;

  if (existingProgress) {
    // Delete to mark as incomplete
    await db.progress.delete({
      where: {
        studentId_sectionId: {
          studentId: user.id,
          sectionId,
        },
      },
    });
    progress = null;
  } else {
    // Create to mark as complete
    progress = await db.progress.create({
      data: {
        studentId: user.id,
        sectionId,
      },
    });
  }

  // Calculate course completion percentage
  const completedSections = await db.progress.count({
    where: {
      studentId: user.id,
      section: {
        courseId: section.courseId,
      },
    },
  });

  const totalSections = section.course.sections.length;
  const completionPercentage = totalSections > 0 
    ? Math.round((completedSections / totalSections) * 100) 
    : 0;

  // Update enrollment progress
  await db.enrollment.update({
    where: {
      studentId_courseId: {
        studentId: user.id,
        courseId: section.courseId,
      },
    },
    data: {
      progress: completionPercentage,
      isCompleted: completionPercentage === 100,
    },
  });

  return successResponse({
    completed: !!progress,
    courseProgress: completionPercentage,
  });
});
