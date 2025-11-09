import { db } from "@/lib/db";
import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/auth";
import { signUpSchema, signInSchema } from "@/lib/validations";
import {
  asyncHandler,
  successResponse,
  ConflictError,
  UnauthorizedError,
  BadRequestError,
} from "@/lib/errors";
import { rateLimit, parseBody } from "@/lib/api-middleware";
import { NextResponse } from "next/server";

/**
 * POST /api/auth/signup
 * Register a new user
 */
export const POST = asyncHandler(async (req: Request) => {
  // Rate limit: 5 signups per minute
  await rateLimit(req, "strict");

  const body = await parseBody(req);
  const validatedData = signUpSchema.parse(body);

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { email: validatedData.email },
  });

  if (existingUser) {
    throw new ConflictError("User with this email already exists");
  }

  // Hash password
  const hashedPassword = await hashPassword(validatedData.password);

  // Create clerkId (temporary until real Clerk is integrated)
  const clerkId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Create user
  const user = await db.user.create({
    data: {
      clerkId,
      email: validatedData.email,
      password: hashedPassword,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      role: validatedData.role,
      departmentId: validatedData.departmentId,
      year: validatedData.year,
      enrollmentId: validatedData.enrollmentId,
      designation: validatedData.designation,
      facultyId: validatedData.facultyId,
    },
  });

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
      departmentId: user.departmentId,
      isOnboarded: user.isOnboarded,
    },
    accessToken,
    refreshToken,
  };

  // Create response and set cookies
  const response = NextResponse.json(
    { success: true, data: userData },
    { status: 201 }
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
