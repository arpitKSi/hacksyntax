import { db } from "@/lib/db";
import {
  asyncHandler,
  successResponse,
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "@/lib/errors";
import { requireAuth, parseBody } from "@/lib/api-middleware";
import { submitAssignmentSchema } from "@/lib/validations";

/**
 * POST /api/assignments/[assignmentId]/submit
 * Submit an assignment (students only)
 */
export const POST = asyncHandler(async (req: Request, { params }: { params: { assignmentId: string } }) => {
  const user = await requireAuth(req);
  const { assignmentId } = params;

  // Only students can submit
  if (user.role !== "STUDENT" && user.role !== "LEARNER") {
    throw new ForbiddenError("Only students can submit assignments");
  }

  const assignment = await db.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      section: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!assignment) {
    throw new NotFoundError("Assignment not found");
  }

  // Check enrollment
  const enrollment = await db.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: user.id,
        courseId: assignment.section.course.id,
      },
    },
  });

  if (!enrollment) {
    throw new ForbiddenError("You must be enrolled in this course");
  }

  // Check if past due date
  if (assignment.dueDate && new Date() > assignment.dueDate) {
    throw new BadRequestError("This assignment is past its due date");
  }

  const body = await parseBody(req);
  const validatedData = submitAssignmentSchema.parse(body);

  // Check if already submitted
  const existingSubmission = await db.assignmentSubmission.findFirst({
    where: {
      assignmentId,
      studentId: user.id,
    },
  });

  if (existingSubmission) {
    // Update existing submission
    const updatedSubmission = await db.assignmentSubmission.update({
      where: { id: existingSubmission.id },
      data: {
        content: validatedData.submissionText || "",
        fileUrl: validatedData.fileUrl,
        submittedAt: new Date(),
        status: "SUBMITTED",
      },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            maxScore: true,
          },
        },
      },
    });

    return successResponse({ submission: updatedSubmission });
  }

  // Create new submission
  const submission = await db.assignmentSubmission.create({
    data: {
      assignmentId,
      studentId: user.id,
      content: validatedData.submissionText || "",
      fileUrl: validatedData.fileUrl,
      status: "SUBMITTED",
    },
    include: {
      assignment: {
        select: {
          id: true,
          title: true,
          maxScore: true,
        },
      },
    },
  });

  return successResponse({ submission }, 201);
});
