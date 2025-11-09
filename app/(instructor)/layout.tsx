"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authHelpers } from "@/lib/api-client"
import Topbar from "@/components/layout/Topbar"
import Sidebar from "@/components/layout/Sidebar"

const InstructorLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const token = authHelpers.getAccessToken()
      const user = authHelpers.getUser()
      
      if (!token || !user) {
        router.push("/sign-in")
        return
      }

      // Check if user has educator or admin role
      if (user.role !== "EDUCATOR" && user.role !== "ADMIN") {
        router.push("/")
        return
      }

      setIsAuthenticated(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="h-full flex flex-col">
      <Topbar />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}

export default InstructorLayout

