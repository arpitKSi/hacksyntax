import { db } from "@/lib/db";
import {
  asyncHandler,
  successResponse,
  NotFoundError,
  ForbiddenError,
} from "@/lib/errors";
import { requireEducator, parseBody } from "@/lib/api-middleware";
import { createSectionResourceSchema } from "@/lib/validations";

type RouteParams = { courseId: string; sectionId: string };

export const POST = asyncHandler(async (
  req: Request,
  { params }: { params: RouteParams }
) => {
  const user = await requireEducator(req);
  const { courseId, sectionId } = params;

  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { instructorId: true },
  });

  if (!course) {
    throw new NotFoundError("Course not found");
  }

  if (user.role !== "ADMIN" && course.instructorId !== user.id) {
    throw new ForbiddenError("You don't have permission to add resources to this course");
  }

  const section = await db.section.findUnique({
    where: { id: sectionId, courseId },
    select: { id: true },
  });

  if (!section) {
    throw new NotFoundError("Section not found");
  }

  const body = await parseBody(req);
  const data = createSectionResourceSchema.parse(body);

  const resource = await db.resource.create({
    data: {
      name: data.name,
      fileUrl: data.fileUrl,
      sectionId,
    },
  });

  return successResponse({ resource }, 201);
});
