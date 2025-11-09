import { NextRequest } from "next/server";
import { extractToken, getUserFromToken, hasRole } from "./auth";
import { UnauthorizedError, ForbiddenError, RateLimitError } from "./errors";
import { RateLimiterMemory } from "rate-limiter-flexible";

// Rate limiter configurations
const strictRateLimiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 60, // per 60 seconds
});

const moderateRateLimiter = new RateLimiterMemory({
  points: 20, // 20 requests
  duration: 60, // per 60 seconds
});

const relaxedRateLimiter = new RateLimiterMemory({
  points: 100, // 100 requests
  duration: 60, // per 60 seconds
});

function getTokenFromRequest(req: NextRequest | Request): string | null {
  const authHeader = req.headers.get("authorization");
  let token = extractToken(authHeader);

  if (token) {
    return token;
  }

  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .map((cookie) => {
      const [key, ...rest] = cookie.split("=");
      return [key, rest.join("=")];
    });

  const cookieMap = Object.fromEntries(cookies);
  return cookieMap.accessToken || null;
}

/**
 * Extract and verify user from request
 * Checks both Authorization header and cookies
 */
export async function requireAuth(req: NextRequest | Request) {
  const token = getTokenFromRequest(req);

  if (!token) {
    throw new UnauthorizedError("No authentication token provided");
  }

  const user = await getUserFromToken(token);

  if (!user) {
    throw new UnauthorizedError("Invalid or expired token");
  }

  return user;
}

/**
 * Check if user has required role
 */
export async function requireRole(req: NextRequest | Request, roles: string[]) {
  const user = await requireAuth(req);

  if (!hasRole(user.role, roles)) {
    throw new ForbiddenError(
      `Access denied. Required roles: ${roles.join(", ")}`
    );
  }

  return user;
}

/**
 * Require admin role
 */
export async function requireAdmin(req: NextRequest | Request) {
  return requireRole(req, ["ADMIN"]);
}

/**
 * Require educator or admin role
 */
export async function requireEducator(req: NextRequest | Request) {
  return requireRole(req, ["EDUCATOR", "ADMIN"]);
}

/**
 * Optional authentication (returns null if not authenticated)
 */
export async function optionalAuth(req: NextRequest | Request) {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return null;
    }

    const user = await getUserFromToken(token);
    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Rate limiting middleware
 */
export async function rateLimit(
  req: NextRequest | Request,
  limiter: "strict" | "moderate" | "relaxed" = "moderate"
) {
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const rateLimiter =
    limiter === "strict"
      ? strictRateLimiter
      : limiter === "moderate"
      ? moderateRateLimiter
      : relaxedRateLimiter;

  try {
    await rateLimiter.consume(ip);
  } catch (error) {
    throw new RateLimitError(
      "Too many requests. Please try again later."
    );
  }
}

/**
 * Parse request body JSON
 */
export async function parseBody<T = any>(req: Request): Promise<T> {
  try {
    return await req.json();
  } catch (error) {
    throw new Error("Invalid JSON body");
  }
}

/**
 * Parse query parameters
 */
export function parseQuery(req: NextRequest | Request): Record<string, string> {
  const url = new URL(req.url);
  const params: Record<string, string> = {};

  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

/**
 * Check resource ownership
 */
export function checkOwnership(
  userId: string,
  resourceOwnerId: string,
  userRole: string
): boolean {
  // Admins can access anything
  if (userRole === "ADMIN") return true;

  // Check if user owns the resource
  return userId === resourceOwnerId;
}

/**
 * Require resource ownership
 */
export function requireOwnership(
  userId: string,
  resourceOwnerId: string,
  userRole: string,
  message = "You do not have permission to access this resource"
) {
  if (!checkOwnership(userId, resourceOwnerId, userRole)) {
    throw new ForbiddenError(message);
  }
}

/**
 * Get pagination parameters
 */
export function getPagination(query: Record<string, string>) {
  const page = Math.max(1, parseInt(query.page || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || "10", 10)));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Get sort parameters
 */
export function getSort(query: Record<string, string>) {
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = (query.sortOrder || "desc") as "asc" | "desc";

  return { sortBy, sortOrder };
}

/**
 * Build Prisma where clause for search
 */
export function buildSearchWhere(searchTerm: string | undefined, fields: string[]) {
  if (!searchTerm) return {};

  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: "insensitive" as const,
      },
    })),
  };
}

/**
 * Sanitize user data for response (remove sensitive fields)
 */
export function sanitizeUser(user: any) {
  const { clerkId, ...sanitized } = user;
  return sanitized;
}

/**
 * Check if request is from localhost (for development)
 */
export function isLocalhost(req: NextRequest | Request): boolean {
  const host = req.headers.get("host") || "";
  return host.includes("localhost") || host.includes("127.0.0.1");
}

/**
 * Log request (for debugging)
 */
export function logRequest(
  req: NextRequest | Request,
  user?: { id: string; email: string } | null
) {
  if (process.env.NODE_ENV === "development") {
    const method = req.method;
    const url = new URL(req.url);
    const path = url.pathname;
    const userId = user?.id || "anonymous";

    console.log(`[${method}] ${path} - User: ${userId}`);
  }
}
