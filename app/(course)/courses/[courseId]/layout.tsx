"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authHelpers } from "@/lib/api-client"
import CourseSideBar from "@/components/layout/CourseSideBar"
import Topbar from "@/components/layout/Topbar"

const CourseDetailsLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authHelpers.isAuthenticated()) {
      router.push("/sign-in")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Topbar />
      <div className="flex flex-1 flex-col md:flex-row">
        <CourseSideBar courseId={params.courseId} />
        <main className="flex-1 overflow-x-hidden px-4 py-6 md:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-5xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default CourseDetailsLayout
