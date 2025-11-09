import { db } from "@/lib/db";
import {
  asyncHandler,
  successResponse,
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "@/lib/errors";
import { requireEducator, parseBody } from "@/lib/api-middleware";
import { createSectionSchema } from "@/lib/validations";

/**
 * POST /api/courses/[courseId]/sections
 * Create a new section in a course
 */
export const POST = asyncHandler(async (req: Request, { params }: { params: { courseId: string } }) => {
  const user = await requireEducator(req);
  const { courseId } = params;

  // Check course exists and ownership
  const course = await db.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new NotFoundError("Course not found");
  }

  // Check ownership (allow admins to edit any course)
  if (user.role !== "ADMIN" && course.instructorId !== user.id) {
    throw new ForbiddenError("You don't have permission to add sections to this course");
  }

  const body = await parseBody(req);
  const validatedData = createSectionSchema.parse(body);

  // Get last section position
  const lastSection = await db.section.findFirst({
    where: { courseId },
    orderBy: { position: "desc" },
  });

  const newPosition = lastSection ? lastSection.position + 1 : 0;

  const newSection = await db.section.create({
    data: {
      title: validatedData.title,
      description: validatedData.description,
      videoUrl: validatedData.videoUrl,
      courseId,
      position: newPosition,
    },
  });

  return successResponse({ section: newSection }, 201);
});
