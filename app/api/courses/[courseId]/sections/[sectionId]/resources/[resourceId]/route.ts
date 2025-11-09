import { db } from "@/lib/db";
import {
  asyncHandler,
  successResponse,
  NotFoundError,
  ForbiddenError,
} from "@/lib/errors";
import { requireEducator } from "@/lib/api-middleware";

type RouteParams = { courseId: string; sectionId: string; resourceId: string };

export const DELETE = asyncHandler(async (
  req: Request,
  { params }: { params: RouteParams }
) => {
  const user = await requireEducator(req);
  const { courseId, sectionId, resourceId } = params;

  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { instructorId: true },
  });

  if (!course) {
    throw new NotFoundError("Course not found");
  }

  if (user.role !== "ADMIN" && course.instructorId !== user.id) {
    throw new ForbiddenError("You don't have permission to delete this resource");
  }

  const resource = await db.resource.findUnique({
    where: { id: resourceId, sectionId },
  });

  if (!resource) {
    throw new NotFoundError("Resource not found");
  }

  await db.resource.delete({
    where: { id: resourceId },
  });

  return successResponse({ deleted: true });
});
