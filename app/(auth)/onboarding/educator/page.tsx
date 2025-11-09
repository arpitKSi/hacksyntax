"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authHelpers, extractApiData } from "@/lib/api-client"
import OnboardingEducatorForm from "@/components/onboarding/OnboardingEducatorForm"

const EducatorOnboardingPage = () => {
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
        router.push("/instructor/courses")
        return
      }

      setUser(userData)

      try {
        const response = await fetch("/api/departments")
        if (response.ok) {
          const payload = await response.json()
          const data = extractApiData<{ departments?: any[] }>(payload)
          setDepartments(data.departments ?? [])
        } else {
          console.error("Failed to load departments", response.statusText)
        }
      } catch (error) {
        console.error("Failed to load departments", error)
      }

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

  return <OnboardingEducatorForm userId={user.id} email={user.email} departments={departments} />
}

export default EducatorOnboardingPage
