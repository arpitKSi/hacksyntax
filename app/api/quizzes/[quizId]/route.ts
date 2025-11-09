import { db } from "@/lib/db";
import {
  asyncHandler,
  successResponse,
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "@/lib/errors";
import { requireAuth, requireEducator, parseBody } from "@/lib/api-middleware";

/**
 * GET /api/quizzes/[quizId]
 * Get quiz details (questions hidden for students before attempt)
 */
export const GET = asyncHandler(async (req: Request, { params }: { params: { quizId: string } }) => {
  const user = await requireAuth(req);
  const { quizId } = params;

  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: {
      section: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              instructorId: true,
            },
          },
        },
      },
      attempts: {
        where: user.role === "STUDENT" || user.role === "LEARNER"
          ? { studentId: user.id }
          : undefined,
        orderBy: { startedAt: "desc" },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!quiz) {
    throw new NotFoundError("Quiz not found");
  }

  const isInstructor = quiz.section.course.instructorId === user.id;
  const isAdmin = user.role === "ADMIN";

  // Check access for students
  if ((user.role === "STUDENT" || user.role === "LEARNER") && !isAdmin) {
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

    // Hide questions for students (they get them when they start attempt)
    const quizForStudent = {
      ...quiz,
      questions: undefined,
      totalQuestions: Array.isArray(quiz.questions) ? quiz.questions.length : 0,
    };

    return successResponse({ quiz: quizForStudent });
  }

  return successResponse({ quiz });
});

/**
 * PATCH /api/quizzes/[quizId]
 * Update quiz (educators only)
 */
export const PATCH = asyncHandler(async (req: Request, { params }: { params: { quizId: string } }) => {
  const user = await requireEducator(req);
  const { quizId } = params;

  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: {
      section: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!quiz) {
    throw new NotFoundError("Quiz not found");
  }

  if (user.role !== "ADMIN" && quiz.section.course.instructorId !== user.id) {
    throw new ForbiddenError("You don't have permission to update this quiz");
  }

  const body = await parseBody(req);
  const updateData: any = {};

  if (body.title) updateData.title = body.title;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.passingScore !== undefined) updateData.passingScore = body.passingScore;
  if (body.timeLimit !== undefined) updateData.timeLimit = body.timeLimit;
  if (body.questions) updateData.questions = body.questions;
  if (body.maxAttempts !== undefined) updateData.maxAttempts = body.maxAttempts;

  const updatedQuiz = await db.quiz.update({
    where: { id: quizId },
    data: updateData,
  });

  return successResponse({ quiz: updatedQuiz });
});

/**
 * DELETE /api/quizzes/[quizId]
 * Delete quiz (educators only)
 */
export const DELETE = asyncHandler(async (req: Request, { params }: { params: { quizId: string } }) => {
  const user = await requireEducator(req);
  const { quizId } = params;

  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: {
      section: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!quiz) {
    throw new NotFoundError("Quiz not found");
  }

  if (user.role !== "ADMIN" && quiz.section.course.instructorId !== user.id) {
    throw new ForbiddenError("You don't have permission to delete this quiz");
  }

  await db.quiz.delete({
    where: { id: quizId },
  });

  return successResponse({ message: "Quiz deleted successfully" });
});
