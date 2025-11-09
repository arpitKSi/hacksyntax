// Auth handled by middleware;
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const PATCH = async (req: NextRequest) => {
  try {
    // const userId = "placeholder" // Auth via cookies;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { role } = await req.json();

    if (!role || !["LEARNER", "EDUCATOR", "ADMIN"].includes(role)) {
      return new NextResponse("Invalid role", { status: 400 });
    }

    // Update user role
    const user = await db.user.update({
      where: { clerkId: userId },
      data: { role },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_ROLE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
