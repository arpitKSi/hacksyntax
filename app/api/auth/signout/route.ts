import { asyncHandler, successResponse } from "@/lib/errors";

/**
 * POST /api/auth/signout
 * Clear auth cookies and end the session
 */
export const POST = asyncHandler(async () => {
  const response = successResponse({ message: "Signed out successfully" });

  response.cookies.set("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
});
