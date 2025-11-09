import { db } from "@/lib/db";
import {
  asyncHandler,
  successResponse,
} from "@/lib/errors";
import { requireAuth, getPagination } from "@/lib/api-middleware";

/**
 * GET /api/enrollments
 * Get user's enrollments (student view)
 */
export const GET = asyncHandler(async (req: Request) => {
  const user = await requireAuth(req);
  
  const url = new URL(req.url);
  const status = url.searchParams.get("status"); // 'active', 'completed'
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const where: any = { studentId: user.id };

  // Filter by completion status
  if (status === "completed") {
    where.progress = 100;
  } else if (status === "active") {
    where.progress = { lt: 100 };
  }

  const [enrollments, total] = await Promise.all([
    db.enrollment.findMany({
      where,
      skip,
      take: limit,
      orderBy: { enrolledAt: "desc" },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                imageUrl: true,
              },
            },
            category: true,
            level: true,
            _count: {
              select: {
                sections: true,
              },
            },
          },
        },
      },
    }),
    db.enrollment.count({ where }),
  ]);

  return successResponse({
    enrollments,
    pagination: {
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});
