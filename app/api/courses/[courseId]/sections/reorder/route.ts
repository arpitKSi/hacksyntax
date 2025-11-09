import { z } from "zod";

import { db } from "@/lib/db";
import {
  asyncHandler,
  successResponse,
  NotFoundError,
  ForbiddenError,
} from "@/lib/errors";
import { requireEducator, parseBody } from "@/lib/api-middleware";

const reorderSchema = z.object({
  sections: z.array(
    z.object({
      id: z.string().uuid(),
      position: z.number().int().min(0),
    })
  ),
});

export const PUT = asyncHandler(async (
  req: Request,
  { params }: { params: { courseId: string } }
) => {
  const user = await requireEducator(req);
  const { courseId } = params;
  const body = await parseBody(req);
  const data = reorderSchema.parse(body);

  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { instructorId: true },
  });

  if (!course) {
    throw new NotFoundError("Course not found");
  }

  if (user.role !== "ADMIN" && course.instructorId !== user.id) {
    throw new ForbiddenError("You don't have permission to reorder these sections");
  }

  await Promise.all(
    data.sections.map((item) =>
      db.section.update({
        where: { id: item.id, courseId },
        data: { position: item.position },
      })
    )
  );

  return successResponse({ reordered: true });
});
