import { db } from "@/lib/db";
import {
  asyncHandler,
  successResponse,
  NotFoundError,
  BadRequestError,
} from "@/lib/errors";
import { requireAuth, parseBody } from "@/lib/api-middleware";
import { z } from "zod";

const voteSchema = z.object({
  value: z.number().int().min(-1).max(1), // -1 for downvote, 1 for upvote, 0 to remove vote
});

/**
 * POST /api/comments/[commentId]/vote
 * Vote on a comment (upvote or downvote)
 */
export const POST = asyncHandler(async (req: Request, { params }: { params: { commentId: string } }) => {
  const user = await requireAuth(req);
  const { commentId } = params;

  const comment = await db.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  const body = await parseBody(req);
  const { value } = voteSchema.parse(body);

  // Check for existing vote
  const existingVote = await db.vote.findFirst({
    where: {
      userId: user.id,
      commentId,
    },
  });

  if (value === 0) {
    // Remove vote
    if (existingVote) {
      await db.vote.delete({
        where: { id: existingVote.id },
      });
    }
    return successResponse({ message: "Vote removed" });
  }

  if (existingVote) {
    // Update existing vote
    await db.vote.update({
      where: { id: existingVote.id },
      data: { value },
    });
  } else {
    // Create new vote
    await db.vote.create({
      data: {
        userId: user.id,
        commentId,
        value,
      },
    });
  }

  // Get updated vote counts
  const votes = await db.vote.findMany({
    where: { commentId },
  });

  const upvotes = votes.filter((v: any) => v.value === 1).length;
  const downvotes = votes.filter((v: any) => v.value === -1).length;

  return successResponse({
    message: "Vote recorded",
    upvotes,
    downvotes,
    score: upvotes - downvotes,
  });
});
