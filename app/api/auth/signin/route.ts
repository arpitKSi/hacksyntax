import { db } from "@/lib/db";
import {
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/auth";
import { signInSchema } from "@/lib/validations";
import {
  asyncHandler,
  successResponse,
  UnauthorizedError,
} from "@/lib/errors";
import { rateLimit, parseBody } from "@/lib/api-middleware";
import { NextResponse } from "next/server";

/**
 * POST /api/auth/signin
 * Authenticate user and return tokens
 */
export const POST = asyncHandler(async (req: Request) => {
  // Rate limit: 5 login attempts per minute
  await rateLimit(req, "strict");

  const body = await parseBody(req);
  const { email, password } = signInSchema.parse(body);

  // Find user
  const user = await db.user.findUnique({
    where: { email },
    include: {
      department: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  // Check if user has password set
  if (!user.password) {
    throw new UnauthorizedError("Please use the correct sign-in method");
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password);

  if (!isValidPassword) {
    throw new UnauthorizedError("Invalid email or password");
  }

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  // Create response with user data
  const userData = {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      imageUrl: user.imageUrl,
      departmentId: user.departmentId,
      department: user.department,
      designation: user.designation,
      isOnboarded: user.isOnboarded,
    },
    accessToken,
    refreshToken,
  };

  // Create response and set cookies
  const response = NextResponse.json(
    { success: true, data: userData },
    { status: 200 }
  );

  // Set HTTP-only cookies for better security
  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15, // 15 minutes
    path: "/",
  });

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
});
