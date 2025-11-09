import { db } from "@/lib/db";
import {
  asyncHandler,
  successResponse,
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "@/lib/errors";
import { requireEducator, parseBody } from "@/lib/api-middleware";
import { gradeAssignmentSchema } from "@/lib/validations";

/**
 * PATCH /api/assignments/[assignmentId]/submissions/[submissionId]/grade
 * Grade an assignment submission (educators only)
 */
export const PATCH = asyncHandler(async (
  req: Request,
  { params }: { params: { assignmentId: string; submissionId: string } }
) => {
  const user = await requireEducator(req);
  const { assignmentId, submissionId } = params;

  const submission = await db.assignmentSubmission.findUnique({
    where: { id: submissionId },
    include: {
      assignment: {
        include: {
          section: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });

  if (!submission) {
    throw new NotFoundError("Submission not found");
  }

  if (submission.assignmentId !== assignmentId) {
    throw new BadRequestError("Submission does not belong to this assignment");
  }

  // Check if user is the instructor
  if (user.role !== "ADMIN" && submission.assignment.section.course.instructorId !== user.id) {
    throw new ForbiddenError("You don't have permission to grade this submission");
  }

  const body = await parseBody(req);
  const validatedData = gradeAssignmentSchema.parse(body);

  // Validate score
  if (validatedData.score > submission.assignment.maxScore) {
    throw new BadRequestError(`Score cannot exceed maximum score of ${submission.assignment.maxScore}`);
  }

  const gradedSubmission = await db.assignmentSubmission.update({
    where: { id: submissionId },
    data: {
      score: validatedData.score,
      feedback: validatedData.feedback,
      gradedById: user.id,
      gradedAt: new Date(),
      status: "GRADED",
    },
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      assignment: {
        select: {
          id: true,
          title: true,
          maxScore: true,
        },
      },
      gradedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return successResponse({ submission: gradedSubmission });
});
