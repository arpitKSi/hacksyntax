import { db } from "@/lib/db";
import {
  asyncHandler,
  successResponse,
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "@/lib/errors";
import { requireAuth } from "@/lib/api-middleware";

/**
 * POST /api/quizzes/[quizId]/attempt
 * Start a new quiz attempt (students only)
 */
export const POST = asyncHandler(async (req: Request, { params }: { params: { quizId: string } }) => {
  const user = await requireAuth(req);
  const { quizId } = params;

  if (user.role !== "STUDENT" && user.role !== "LEARNER") {
    throw new ForbiddenError("Only students can attempt quizzes");
  }

  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: {
      section: {
        include: {
          course: true,
        },
      },
      attempts: {
        where: { studentId: user.id },
      },
    },
  });

  if (!quiz) {
    throw new NotFoundError("Quiz not found");
  }

  // Check enrollment
  const enrollment = await db.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: user.id,
        courseId: quiz.section.course.id,
      },
    },
  });

  if (!enrollment) {
    throw new ForbiddenError("You must be enrolled in this course");
  }

  // Check max attempts
  if (quiz.maxAttempts && quiz.attempts.length >= quiz.maxAttempts) {
    throw new BadRequestError(`You have reached the maximum number of attempts (${quiz.maxAttempts})`);
  }

  // Check for ongoing attempt
  const ongoingAttempt = quiz.attempts.find((a: any) => !a.completedAt);
  if (ongoingAttempt) {
    return successResponse({ 
      attempt: ongoingAttempt,
      message: "You have an ongoing attempt. Please complete it first."
    });
  }

  // Create new attempt
  const attempt = await db.quizAttempt.create({
    data: {
      quizId,
      studentId: user.id,
      startedAt: new Date(),
      answers: {},
    },
    include: {
      quiz: {
        select: {
          id: true,
          title: true,
          questions: true,
          timeLimit: true,
          passingScore: true,
        },
      },
    },
  });

  return successResponse({ attempt }, 201);
});
