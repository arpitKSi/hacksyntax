import { db } from "@/lib/db";
import {
  asyncHandler,
  successResponse,
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "@/lib/errors";
import { requireAuth, parseBody } from "@/lib/api-middleware";
import { submitQuizSchema } from "@/lib/validations";

/**
 * POST /api/quizzes/[quizId]/submit
 * Submit quiz answers and calculate score
 */
export const POST = asyncHandler(async (req: Request, { params }: { params: { quizId: string } }) => {
  const user = await requireAuth(req);
  const { quizId } = params;

  if (user.role !== "STUDENT" && user.role !== "LEARNER") {
    throw new ForbiddenError("Only students can submit quizzes");
  }

  const body = await parseBody(req);
  const validatedData = submitQuizSchema.parse(body);

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

  // Find the ongoing attempt
  const attempt = await db.quizAttempt.findFirst({
    where: {
      quizId,
      studentId: user.id,
      completedAt: null,
    },
  });

  if (!attempt) {
    throw new BadRequestError("No ongoing attempt found. Please start a new attempt.");
  }

  // Check time limit
  if (quiz.timeLimit) {
    const elapsedMinutes = (Date.now() - attempt.startedAt.getTime()) / (1000 * 60);
    if (elapsedMinutes > quiz.timeLimit) {
      throw new BadRequestError("Time limit exceeded");
    }
  }

  // Calculate score
  const questions = quiz.questions as any[];
  let totalPoints = 0;
  let earnedPoints = 0;
  const results: any[] = [];

  questions.forEach((question: any, index: number) => {
    const studentAnswer = validatedData.answers[question.id || index];
    const isCorrect = JSON.stringify(studentAnswer) === JSON.stringify(question.correctAnswer);
    
    totalPoints += question.points || 1;
    if (isCorrect) {
      earnedPoints += question.points || 1;
    }

    results.push({
      questionId: question.id || index,
      question: question.question,
      studentAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      points: isCorrect ? (question.points || 1) : 0,
    });
  });

  const percentageScore = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
  const passed = percentageScore >= (quiz.passingScore || 70);

  // Update attempt
  const completedAttempt = await db.quizAttempt.update({
    where: { id: attempt.id },
    data: {
      completedAt: new Date(),
      answers: validatedData.answers,
      score: percentageScore,
    },
    include: {
      quiz: {
        select: {
          id: true,
          title: true,
          passingScore: true,
        },
      },
    },
  });

  return successResponse({
    attempt: completedAttempt,
    results,
    summary: {
      totalPoints,
      earnedPoints,
      percentageScore: Math.round(percentageScore * 100) / 100,
      passed,
      passingScore: quiz.passingScore || 70,
    },
  });
});
