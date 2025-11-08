import { db } from "@/lib/db";
import { auth } from "@/shims/clerk-server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if course exists
    const course = await db.course.findUnique({
      where: { id: params.courseId },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Check if already enrolled
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (existingEnrollment) {
      return new NextResponse("Already enrolled", { status: 400 });
    }

    // Create enrollment
    const enrollment = await db.enrollment.create({
      data: {
        studentId: user.id,
        courseId: params.courseId,
        progress: 0,
      },
    });

    // Update course analytics
    const analytics = await db.courseAnalytics.upsert({
      where: { courseId: params.courseId },
      update: {
        totalEnrollments: {
          increment: 1,
        },
      },
      create: {
        courseId: params.courseId,
        totalEnrollments: 1,
      },
    });

    return NextResponse.json(enrollment);
  } catch (error) {
    console.log("[ENROLL]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
