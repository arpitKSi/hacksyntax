import { auth } from "@/shims/clerk-server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      firstName,
      lastName,
      departmentId,
      year,
      branch,
      enrollmentId,
    } = await req.json();

    // Validate required fields
    if (!firstName || !lastName || !departmentId || !year || !enrollmentId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Update user with student information
    const user = await db.user.update({
      where: { clerkId: userId },
      data: {
        firstName,
        lastName,
        departmentId,
        year: parseInt(year),
        branch,
        enrollmentId,
        role: "LEARNER",
        isOnboarded: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[ONBOARDING_STUDENT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
