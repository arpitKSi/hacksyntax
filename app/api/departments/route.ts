import { db } from "@/lib/db";
import { asyncHandler, successResponse } from "@/lib/errors";

export const GET = asyncHandler(async () => {
  const departments = await db.department.findMany({
    select: {
      id: true,
      name: true,
      code: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return successResponse({ departments });
});
