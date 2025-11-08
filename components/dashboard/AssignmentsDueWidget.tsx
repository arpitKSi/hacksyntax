"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, FileText, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface Assignment {
  id: string
  title: string
  courseName: string
  courseId: string
  dueDate: Date
  status: "pending" | "submitted" | "graded"
  points: number | null
  earnedPoints: number | null
}

interface AssignmentsDueWidgetProps {
  assignments: Assignment[]
}

export default function AssignmentsDueWidget({ assignments }: AssignmentsDueWidgetProps) {
  const getTimeRemaining = (dueDate: Date) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffMs = due.getTime() - now.getTime()
    
    if (diffMs < 0) return { text: "Overdue", color: "text-red-600", urgent: true }
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffDays > 7) return { text: `${diffDays} days`, color: "text-green-600", urgent: false }
    if (diffDays > 0) return { text: `${diffDays} days`, color: "text-yellow-600", urgent: diffDays <= 2 }
    if (diffHours > 0) return { text: `${diffHours} hours`, color: "text-orange-600", urgent: true }
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    return { text: `${diffMinutes} minutes`, color: "text-red-600", urgent: true }
  }

  const pendingAssignments = assignments.filter(a => a.status === "pending")
  const upcomingAssignments = pendingAssignments
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-red-600" />
          Assignments Due
          {pendingAssignments.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {pendingAssignments.length}
            </Badge>
          )}
        </h3>
      </div>

      {upcomingAssignments.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-3" />
          <p className="text-gray-500">All caught up! No pending assignments.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingAssignments.map((assignment) => {
            const timeRemaining = getTimeRemaining(assignment.dueDate)
            
            return (
              <Link
                key={assignment.id}
                href={`/courses/${assignment.courseId}/assignments/${assignment.id}`}
                className={`block p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  timeRemaining.urgent
                    ? "border-red-200 bg-red-50 dark:bg-red-900/10"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {timeRemaining.urgent && (
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      )}
                      <p className="font-semibold truncate">{assignment.title}</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {assignment.courseName}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className={`flex items-center gap-1 ${timeRemaining.color} font-semibold`}>
                        <Clock className="w-4 h-4" />
                        {timeRemaining.text}
                      </div>
                      {assignment.points && (
                        <span className="text-gray-500">
                          {assignment.points} points
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className={timeRemaining.urgent ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    Submit
                  </Button>
                </div>
              </Link>
            )
          })}
          
          {pendingAssignments.length > 5 && (
            <div className="text-center pt-2">
              <Link href="/assignments" className="text-blue-600 hover:underline text-sm">
                View All {pendingAssignments.length} Assignments →
              </Link>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
