"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authHelpers } from "@/lib/api-client"
import OnboardingStudentForm from "@/components/onboarding/OnboardingStudentForm"

const StudentOnboardingPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [departments, setDepartments] = useState<any[]>([])

  useEffect(() => {
    const init = async () => {
      const userData = authHelpers.getUser()
      
      if (!userData) {
        router.push("/sign-in")
        return
      }

      // If already onboarded, redirect
      if (userData.isOnboarded) {
        router.push("/dashboard")
        return
      }

      // Fetch departments (you can create an API endpoint for this)
      // For now, we'll just set user
      setUser(userData)
      setLoading(false)
    }

    init()
  }, [router])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <OnboardingStudentForm userId={user.id} email={user.email} departments={departments} />
}

export default StudentOnboardingPage
