import { db } from "@/lib/db";
import {
  asyncHandler,
  successResponse,
  paginatedResponse,
  BadRequestError,
} from "@/lib/errors";
import { requireAuth, parseBody } from "@/lib/api-middleware";
import { createDiscussionSchema } from "@/lib/validations";

/**
 * POST /api/discussions
 * Create a new discussion thread
 */
export const POST = asyncHandler(async (req: Request) => {
  const user = await requireAuth(req);

  const body = await parseBody(req);
  const validatedData = createDiscussionSchema.parse(body);

  // Verify course access
  if (validatedData.courseId) {
    const enrollment = await db.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId: validatedData.courseId,
        },
      },
    });

    if (!enrollment && user.role !== "EDUCATOR" && user.role !== "ADMIN") {
      throw new BadRequestError("You must be enrolled in this course");
    }
  }

  const discussion = await db.discussion.create({
    data: {
      title: validatedData.title,
      content: validatedData.content,
      authorId: user.id,
      courseId: validatedData.courseId,
      departmentId: validatedData.departmentId,
      tags: validatedData.tags,
    },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
          role: true,
        },
      },
      course: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return successResponse({ discussion }, 201);
});

/**
 * GET /api/discussions
 * List discussions with filters
 */
export const GET = asyncHandler(async (req: Request) => {
  const user = await requireAuth(req);

  const url = new URL(req.url);
  const courseId = url.searchParams.get("courseId");
  const departmentId = url.searchParams.get("departmentId");
  const search = url.searchParams.get("search");
  const tag = url.searchParams.get("tag");
  const status = url.searchParams.get("status"); // 'open', 'closed', 'resolved'
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const where: any = {};

  if (courseId) {
    where.courseId = courseId;
  }

  if (departmentId) {
    where.departmentId = departmentId;
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { content: { contains: search } },
    ];
  }

  if (tag) {
    where.tags = {
      has: tag,
    };
  }

  if (status) {
    where.status = status.toUpperCase();
  }

  const [discussions, total] = await Promise.all([
    db.discussion.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" },
      ],
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
            role: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: {
            comments: true,
            votes: true,
          },
        },
      },
    }),
    db.discussion.count({ where }),
  ]);

  return paginatedResponse(discussions, total, page, limit);
});
