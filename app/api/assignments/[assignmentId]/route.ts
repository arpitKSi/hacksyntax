import { db } from "@/lib/db";
import {
  asyncHandler,
  successResponse,
  NotFoundError,
  ForbiddenError,
} from "@/lib/errors";
import { requireAuth, requireEducator, parseBody } from "@/lib/api-middleware";
import { z } from "zod";

/**
 * GET /api/assignments/[assignmentId]
 * Get assignment details
 */
export const GET = asyncHandler(async (req: Request, { params }: { params: { assignmentId: string } }) => {
  const user = await requireAuth(req);
  const { assignmentId } = params;

  const assignment = await db.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      section: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              instructorId: true,
            },
          },
        },
      },
      submissions: {
        where: user.role === "STUDENT" || user.role === "LEARNER" 
          ? { studentId: user.id } 
          : undefined,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              imageUrl: true,
              email: true,
            },
          },
          gradedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { submittedAt: "desc" },
      },
    },
  });

  if (!assignment) {
    throw new NotFoundError("Assignment not found");
  }

  // Check access
  const isInstructor = assignment.section.course.instructorId === user.id;
  const isAdmin = user.role === "ADMIN";

  if (!isInstructor && !isAdmin && user.role !== "STUDENT" && user.role !== "LEARNER") {
    throw new ForbiddenError("Access denied");
  }

  // For students, check if enrolled
  if (user.role === "STUDENT" || user.role === "LEARNER") {
    const enrollment = await db.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId: assignment.section.course.id,
        },
      },
    });

    if (!enrollment) {
      throw new ForbiddenError("You must be enrolled in this course");
    }
  }

  return successResponse({ assignment });
});

/**
 * PATCH /api/assignments/[assignmentId]
 * Update assignment (educators only)
 */
export const PATCH = asyncHandler(async (req: Request, { params }: { params: { assignmentId: string } }) => {
  const user = await requireEducator(req);
  const { assignmentId } = params;

  const assignment = await db.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      section: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!assignment) {
    throw new NotFoundError("Assignment not found");
  }

  if (user.role !== "ADMIN" && assignment.section.course.instructorId !== user.id) {
    throw new ForbiddenError("You don't have permission to update this assignment");
  }

  const body = await parseBody(req);
  const updateData: any = {};

  if (body.title) updateData.title = body.title;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.instructions !== undefined) updateData.instructions = body.instructions;
  if (body.dueDate) updateData.dueDate = new Date(body.dueDate);
  if (body.maxScore !== undefined) updateData.maxScore = body.maxScore;
  if (body.attachments !== undefined) updateData.attachments = body.attachments;

  const updatedAssignment = await db.assignment.update({
    where: { id: assignmentId },
    data: updateData,
  });

  return successResponse({ assignment: updatedAssignment });
});

/**
 * DELETE /api/assignments/[assignmentId]
 * Delete assignment (educators only)
 */
export const DELETE = asyncHandler(async (req: Request, { params }: { params: { assignmentId: string } }) => {
  const user = await requireEducator(req);
  const { assignmentId } = params;

  const assignment = await db.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      section: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!assignment) {
    throw new NotFoundError("Assignment not found");
  }

  if (user.role !== "ADMIN" && assignment.section.course.instructorId !== user.id) {
    throw new ForbiddenError("You don't have permission to delete this assignment");
  }

  await db.assignment.delete({
    where: { id: assignmentId },
  });

  return successResponse({ message: "Assignment deleted successfully" });
});
