import { db } from "@/lib/db";
import {
  asyncHandler,
  successResponse,
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "@/lib/errors";
import { requireEducator } from "@/lib/api-middleware";

export const POST = asyncHandler(async (
  req: Request,
  { params }: { params: { courseId: string; sectionId: string } }
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
    throw new ForbiddenError("You don't have permission to publish this section");
  }

  const section = await db.section.findUnique({
    where: { id: sectionId, courseId },
    include: {
      muxData: true,
    },
  });

  if (!section) {
    throw new NotFoundError("Section not found");
  }

  if (!section.title || !section.description || !section.videoUrl) {
    throw new BadRequestError("Section must include title, description, and video before publishing");
  }

  const publishedSection = await db.section.update({
    where: { id: sectionId, courseId },
    data: { isPublished: true },
    include: { muxData: true },
  });

  return successResponse({ section: publishedSection });
});