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
      designation,
      facultyId,
      bio,
      specialization,
      officeHours,
    } = await req.json();

    // Validate required fields
    if (!firstName || !lastName || !departmentId || !designation || !facultyId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Update user with educator information
    const user = await db.user.update({
      where: { clerkId: userId },
      data: {
        firstName,
        lastName,
        departmentId,
        designation,
        facultyId,
        bio,
        specialization,
        officeHours,
        role: "EDUCATOR",
        isOnboarded: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[ONBOARDING_EDUCATOR_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
