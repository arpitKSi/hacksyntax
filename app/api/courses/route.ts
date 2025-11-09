import { db } from "@/lib/db";
import { createCourseSchema, courseFilterSchema } from "@/lib/validations";
import {
  asyncHandler,
  successResponse,
  paginatedResponse,
} from "@/lib/errors";
import {
  requireEducator,
  optionalAuth,
  parseBody,
  parseQuery,
  getPagination,
  getSort,
  buildSearchWhere,
} from "@/lib/api-middleware";

/**
 * GET /api/courses
 * Get all courses with filtering and pagination
 */
export const GET = asyncHandler(async (req: Request) => {
  const query = parseQuery(req);
  const filters = courseFilterSchema.parse(query);
  const { page, limit, skip } = getPagination(query);
  const { sortBy, sortOrder } = getSort(query);

  // Build where clause
  const where: any = {};

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.levelId) {
    where.levelId = filters.levelId;
  }

  if (filters.departmentId) {
    where.departmentId = filters.departmentId;
  }

  if (filters.isPublished !== undefined) {
    where.isPublished = filters.isPublished;
  } else {
    // By default, only show published courses to non-authenticated users
    const user = await optionalAuth(req);
    if (!user || (user.role !== "ADMIN" && user.role !== "EDUCATOR")) {
      where.isPublished = true;
    }
  }

  if (filters.search) {
    Object.assign(where, buildSearchWhere(filters.search, ["title", "subtitle", "description"]));
  }

  // Get total count
  const total = await db.course.count({ where });

  // Get courses
  const courses = await db.course.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      instructor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
          designation: true,
        },
      },
      category: true,
      subCategory: true,
      level: true,
      department: true,
      _count: {
        select: {
          enrollments: true,
          sections: true,
        },
      },
    },
  });

  return paginatedResponse(courses, total, page, limit);
});

/**
 * POST /api/courses
 * Create a new course (educators and admins only)
 */
export const POST = asyncHandler(async (req: Request) => {
  const user = await requireEducator(req);

  const body = await parseBody(req);
  const validatedData = createCourseSchema.parse(body);

  // Prepare course data
  const courseData: any = {
    title: validatedData.title,
    instructorId: user.id,
  };

  if (validatedData.subtitle) courseData.subtitle = validatedData.subtitle;
  if (validatedData.description) courseData.description = validatedData.description;
  if (validatedData.imageUrl) courseData.imageUrl = validatedData.imageUrl;
  if (validatedData.price !== undefined) courseData.price = validatedData.price;
  if (validatedData.categoryId) courseData.categoryId = validatedData.categoryId;
  if (validatedData.subCategoryId) courseData.subCategoryId = validatedData.subCategoryId;
  if (validatedData.levelId) courseData.levelId = validatedData.levelId;
  if (validatedData.departmentId) courseData.departmentId = validatedData.departmentId;

  const course = await db.course.create({
    data: courseData,
    include: {
      instructor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
          designation: true,
        },
      },
      category: true,
      level: true,
      department: true,
    },
  });

  return successResponse(course, 201);
});