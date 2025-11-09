import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
const JWT_EXPIRES_IN = "15m"; // Access token expires in 15 minutes
const JWT_REFRESH_EXPIRES_IN = "7d"; // Refresh token expires in 7 days

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface RefreshTokenPayload {
  userId: string;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Compare password with hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate JWT access token
 */
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: "HS256",
  });
}

/**
 * Generate JWT refresh token
 */
export function generateRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    algorithm: "HS256",
  });
}

/**
 * Verify JWT access token
 */
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Verify JWT refresh token
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Get user from token
 */
export async function getUserFromToken(token: string) {
  const payload = verifyAccessToken(token);
  if (!payload) return null;

  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      imageUrl: true,
      departmentId: true,
      designation: true,
      isOnboarded: true,
    },
  });

  return user;
}

/**
 * Extract token from Authorization header
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

/**
 * Check if user is admin
 */
export function isAdmin(userRole: string): boolean {
  return userRole === "ADMIN";
}

/**
 * Check if user is educator
 */
export function isEducator(userRole: string): boolean {
  return userRole === "EDUCATOR" || userRole === "ADMIN";
}

/**
 * Generate password reset token
 */
export function generatePasswordResetToken(userId: string): string {
  return jwt.sign({ userId, type: "password-reset" }, JWT_SECRET, {
    expiresIn: "1h",
  });
}

/**
 * Verify password reset token
 */
export function verifyPasswordResetToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.type !== "password-reset") return null;
    return { userId: decoded.userId };
  } catch (error) {
    return null;
  }
}

/**
 * Generate email verification token
 */
export function generateEmailVerificationToken(email: string): string {
  return jwt.sign({ email, type: "email-verification" }, JWT_SECRET, {
    expiresIn: "24h",
  });
}

/**
 * Verify email verification token
 */
export function verifyEmailVerificationToken(token: string): { email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.type !== "email-verification") return null;
    return { email: decoded.email };
  } catch (error) {
    return null;
  }
}
