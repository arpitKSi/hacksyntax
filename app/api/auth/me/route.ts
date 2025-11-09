import { asyncHandler, successResponse } from "@/lib/errors";
import { requireAuth } from "@/lib/api-middleware";

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export const GET = asyncHandler(async (req: Request) => {
  const user = await requireAuth(req);

  return successResponse({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      imageUrl: user.imageUrl,
      departmentId: user.departmentId,
      designation: user.designation,
      isOnboarded: user.isOnboarded,
    },
  });
});
