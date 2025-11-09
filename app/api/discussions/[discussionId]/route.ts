import { db } from "@/lib/db";
import {
  asyncHandler,
  successResponse,
  NotFoundError,
  ForbiddenError,
} from "@/lib/errors";
import { requireAuth, parseBody } from "@/lib/api-middleware";

/**
 * GET /api/discussions/[discussionId]
 * Get discussion with comments
 */
export const GET = asyncHandler(async (req: Request, { params }: { params: { discussionId: string } }) => {
  const user = await requireAuth(req);
  const { discussionId } = params;

  const discussion = await db.discussion.findUnique({
    where: { id: discussionId },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
          role: true,
          designation: true,
        },
      },
      course: {
        select: {
          id: true,
          title: true,
        },
      },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              imageUrl: true,
              role: true,
            },
          },
          votes: {
            select: {
              id: true,
              userId: true,
              value: true,
            },
          },
        },
      },
      votes: {
        select: {
          id: true,
          userId: true,
          value: true,
        },
      },
    },
  });

  if (!discussion) {
    throw new NotFoundError("Discussion not found");
  }

  // Increment view count
  await db.discussion.update({
    where: { id: discussionId },
    data: { views: { increment: 1 } },
  });

  return successResponse({ discussion });
});

/**
 * PATCH /api/discussions/[discussionId]
 * Update discussion
 */
export const PATCH = asyncHandler(async (req: Request, { params }: { params: { discussionId: string } }) => {
  const user = await requireAuth(req);
  const { discussionId } = params;

  const discussion = await db.discussion.findUnique({
    where: { id: discussionId },
  });

  if (!discussion) {
    throw new NotFoundError("Discussion not found");
  }

  // Only author, admins, or educators can update
  if (
    discussion.authorId !== user.id &&
    user.role !== "ADMIN" &&
    user.role !== "EDUCATOR"
  ) {
    throw new ForbiddenError("You don't have permission to update this discussion");
  }

  const body = await parseBody(req);
  const updateData: any = {};

  if (body.title) updateData.title = body.title;
  if (body.content !== undefined) updateData.content = body.content;
  if (body.tags) updateData.tags = body.tags;
  if (body.status && (user.role === "ADMIN" || user.role === "EDUCATOR")) {
    updateData.status = body.status;
  }
  if (body.isPinned !== undefined && (user.role === "ADMIN" || user.role === "EDUCATOR")) {
    updateData.isPinned = body.isPinned;
  }

  const updatedDiscussion = await db.discussion.update({
    where: { id: discussionId },
    data: updateData,
  });

  return successResponse({ discussion: updatedDiscussion });
});

/**
 * DELETE /api/discussions/[discussionId]
 * Delete discussion
 */
export const DELETE = asyncHandler(async (req: Request, { params }: { params: { discussionId: string } }) => {
  const user = await requireAuth(req);
  const { discussionId } = params;

  const discussion = await db.discussion.findUnique({
    where: { id: discussionId },
  });

  if (!discussion) {
    throw new NotFoundError("Discussion not found");
  }

  // Only author or admins can delete
  if (discussion.authorId !== user.id && user.role !== "ADMIN") {
    throw new ForbiddenError("You don't have permission to delete this discussion");
  }

  await db.discussion.delete({
    where: { id: discussionId },
  });

  return successResponse({ message: "Discussion deleted successfully" });
});
