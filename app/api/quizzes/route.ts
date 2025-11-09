import { db } from "@/lib/db";
import {
  asyncHandler,
  successResponse,
  paginatedResponse,
  NotFoundError,
  ForbiddenError,
} from "@/lib/errors";
import { requireAuth, requireEducator, parseBody } from "@/lib/api-middleware";
import { createQuizSchema } from "@/lib/validations";

/**
 * POST /api/quizzes
 * Create a new quiz (educators only)
 */
export const POST = asyncHandler(async (req: Request) => {
  const user = await requireEducator(req);

  const body = await parseBody(req);
  const validatedData = createQuizSchema.parse(body);

  // Check section ownership
  const section = await db.section.findUnique({
    where: { id: validatedData.sectionId },
    include: {
      course: {
        select: {
          instructorId: true,
        },
      },
    },
  });

  if (!section) {
    throw new NotFoundError("Section not found");
  }

  if (user.role !== "ADMIN" && section.course.instructorId !== user.id) {
    throw new ForbiddenError("You don't have permission to create quizzes for this section");
  }

  const quiz = await db.quiz.create({
    data: {
      title: validatedData.title,
      description: validatedData.description,
      sectionId: validatedData.sectionId,
      passingScore: validatedData.passingScore || 70,
      timeLimit: validatedData.timeLimit,
      questions: validatedData.questions,
      maxAttempts: validatedData.maxAttempts || 3,
    },
  });

  return successResponse({ quiz }, 201);
});

/**
 * GET /api/quizzes
 * Get quizzes (filtered by access)
 */
export const GET = asyncHandler(async (req: Request) => {
  const user = await requireAuth(req);

  const url = new URL(req.url);
  const sectionId = url.searchParams.get("sectionId");
  const courseId = url.searchParams.get("courseId");
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const where: any = {};

  if (sectionId) {
    where.sectionId = sectionId;
  } else if (courseId) {
    where.section = { courseId };
  }

  // For students, filter by enrolled courses
  if (user.role === "STUDENT" || user.role === "LEARNER") {
    const enrolledCourseIds = await db.enrollment.findMany({
      where: { studentId: user.id },
      select: { courseId: true },
    });

    where.section = {
      ...where.section,
      courseId: {
        in: enrolledCourseIds.map((e: any) => e.courseId),
      },
    };
  }

  const [quizzes, total] = await Promise.all([
    db.quiz.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        section: {
          select: {
            id: true,
            title: true,
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        _count: {
          select: {
            attempts: true,
          },
        },
      },
    }),
    db.quiz.count({ where }),
  ]);

  return paginatedResponse(quizzes, total, page, limit);
});
