/**
 * Server-side authentication helper
 * Use this in Server Components to get the authenticated user
 */

import { cookies } from "next/headers";
import { verifyAccessToken } from "./auth";
import { db } from "./db";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  imageUrl: string | null;
  departmentId: string | null;
  designation: string | null;
  isOnboarded: boolean | null;
}

/**
 * Get authenticated user from server-side request
 * Returns null if not authenticated
 */
export async function getServerUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return null;
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return null;
    }

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
  } catch (error) {
    console.error("Error getting server user:", error);
    return null;
  }
}

/**
 * Get user ID from server-side request
 * Returns null if not authenticated
 */
export async function getServerUserId(): Promise<string | null> {
  const user = await getServerUser();
  return user?.id || null;
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireServerAuth(): Promise<AuthUser> {
  const user = await getServerUser();
  if (!user) {
    throw new Error("Unauthorized - Please sign in");
  }
  return user;
}

/**
 * Check if user has specific role
 */
export async function hasRole(role: string | string[]): Promise<boolean> {
  const user = await getServerUser();
  if (!user) return false;

  if (Array.isArray(role)) {
    return role.includes(user.role);
  }
  return user.role === role;
}
