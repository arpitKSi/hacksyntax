import { db } from "@/lib/db";
import {
  asyncHandler,
  successResponse,
  NotFoundError,
} from "@/lib/errors";
import { requireAuth, parseBody } from "@/lib/api-middleware";
import { createCommentSchema } from "@/lib/validations";

/**
 * POST /api/discussions/[discussionId]/comments
 * Add a comment to a discussion
 */
export const POST = asyncHandler(async (req: Request, { params }: { params: { discussionId: string } }) => {
  const user = await requireAuth(req);
  const { discussionId } = params;

  // Verify discussion exists
  const discussion = await db.discussion.findUnique({
    where: { id: discussionId },
  });

  if (!discussion) {
    throw new NotFoundError("Discussion not found");
  }

  const body = await parseBody(req);
  const validatedData = createCommentSchema.parse(body);

  const comment = await db.comment.create({
    data: {
      content: validatedData.content,
      authorId: user.id,
      discussionId,
    },
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
    },
  });

  return successResponse({ comment }, 201);
});
