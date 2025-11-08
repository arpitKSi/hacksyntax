"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, TrendingUp, Reply, Bell } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Discussion {
  id: string
  title: string
  category: "COURSE" | "DEPARTMENT" | "GENERAL"
  courseName?: string
  courseId?: string
  departmentName?: string
  author: {
    firstName: string | null
    lastName: string | null
    imageUrl: string | null
  }
  commentsCount: number
  unreadCount: number
  lastActivity: Date
  isPinned: boolean
}

interface RecentDiscussionsProps {
  discussions: Discussion[]
}

export default function RecentDiscussions({ discussions }: RecentDiscussionsProps) {
  const sortedDiscussions = [...discussions]
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    })
    .slice(0, 6)

  const totalUnread = discussions.reduce((sum, d) => sum + d.unreadCount, 0)

  const getCategoryColor = (category: Discussion["category"]) => {
    switch (category) {
      case "COURSE":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "DEPARTMENT":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      case "GENERAL":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    }
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - new Date(date).getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    if (diffMins > 0) return `${diffMins}m ago`
    return "Just now"
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-green-600" />
          Recent Discussions
          {totalUnread > 0 && (
            <Badge className="ml-2 bg-green-600">
              {totalUnread} new
            </Badge>
          )}
        </h3>
        <Link href="/discussions">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>

      {sortedDiscussions.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No discussions yet</p>
          <p className="text-sm text-gray-400 mt-1">Start a conversation with your classmates</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedDiscussions.map((discussion) => (
            <Link
              key={discussion.id}
              href={`/discussions/${discussion.id}`}
              className={`block p-4 rounded-lg border transition-all hover:shadow-md ${
                discussion.unreadCount > 0
                  ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={discussion.author.imageUrl || "/avatar_placeholder.jpg"}
                    alt={`${discussion.author.firstName} ${discussion.author.lastName}`}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold truncate">{discussion.title}</p>
                      {discussion.isPinned && (
                        <Badge variant="secondary" className="text-xs">
                          📌 Pinned
                        </Badge>
                      )}
                    </div>
                    {discussion.unreadCount > 0 && (
                      <Badge className="bg-blue-600 flex-shrink-0">
                        {discussion.unreadCount}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <Badge variant="outline" className={getCategoryColor(discussion.category)}>
                      {discussion.category}
                    </Badge>
                    {discussion.courseName && (
                      <span className="truncate">in {discussion.courseName}</span>
                    )}
                    {discussion.departmentName && (
                      <span className="truncate">• {discussion.departmentName}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>by {discussion.author.firstName} {discussion.author.lastName}</span>
                    <div className="flex items-center gap-1">
                      <Reply className="w-3 h-3" />
                      {discussion.commentsCount} replies
                    </div>
                    <span>{getTimeAgo(discussion.lastActivity)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  )
}
