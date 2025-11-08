import { db } from "@/lib/db";
import { auth } from "@/shims/clerk-server";
import Link from "next/link";
import { MessageSquare, ThumbsUp, CheckCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DiscussionForumProps {
  courseId?: string;
}

export default async function DiscussionForum({ courseId }: DiscussionForumProps) {
  const { userId } = auth();

  // Fetch discussions
  const discussions = await db.discussion.findMany({
    where: courseId ? { courseId } : {},
    include: {
      author: true,
      comments: true,
      votes: true,
      course: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Discussion Forum</h2>
        <Link href={courseId ? `/courses/${courseId}/discussions/new` : "/discussions/new"}>
          <Button className="bg-[#FDAB04] hover:bg-[#FDAB04]/80">
            Start Discussion
          </Button>
        </Link>
      </div>

      {discussions.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No discussions yet. Be the first to start one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {discussions.map((discussion) => {
            const upvotes = discussion.votes.filter((v: any) => v.value === 1).length;
            const downvotes = discussion.votes.filter((v: any) => v.value === -1).length;
            const netVotes = upvotes - downvotes;

            return (
              <Link
                key={discussion.id}
                href={`/discussions/${discussion.id}`}
                className="block border rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Vote section */}
                  <div className="flex flex-col items-center gap-1">
                    <ThumbsUp className={`w-5 h-5 ${netVotes > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="font-semibold">{netVotes}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        {discussion.title}
                        {discussion.isResolved && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {discussion.content}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        by {discussion.author.firstName} {discussion.author.lastName}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {discussion.comments.length} replies
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {discussion.views} views
                      </span>
                      {discussion.course && (
                        <span className="text-blue-600">
                          {discussion.course.title}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
