import { db } from "@/lib/db";
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from "@/lib/auth";
import { refreshTokenSchema } from "@/lib/validations";
import {
  asyncHandler,
  successResponse,
  UnauthorizedError,
} from "@/lib/errors";
import { parseBody } from "@/lib/api-middleware";

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
export const POST = asyncHandler(async (req: Request) => {
  const body = await parseBody(req);
  const { refreshToken: token } = refreshTokenSchema.parse(body);

  // Verify refresh token
  const payload = verifyRefreshToken(token);

  if (!payload) {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }

  // Get user
  const user = await db.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  // Generate new tokens
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  return successResponse({
    accessToken,
    refreshToken,
  });
});
