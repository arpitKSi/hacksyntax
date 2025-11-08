"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Users } from "lucide-react"

const RoleSelectionPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleRoleSelection = async (role: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/user/role", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      })

      if (response.ok) {
        // Redirect based on role
        if (role === "LEARNER") {
          router.push("/onboarding/student")
        } else if (role === "EDUCATOR") {
          router.push("/onboarding/educator")
        }
      }
    } catch (error) {
      console.error("Error setting role:", error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to College Academy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Let's get started by selecting your role
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Student Card */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500 cursor-pointer group">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold">I'm a Student</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Access courses, submit assignments, participate in discussions, and track your academic progress
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2 text-left w-full">
                <li>✓ Enroll in courses</li>
                <li>✓ Track assignments & grades</li>
                <li>✓ Join discussions</li>
                <li>✓ Access learning resources</li>
              </ul>
              <Button
                onClick={() => handleRoleSelection("LEARNER")}
                disabled={loading}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Continue as Student
              </Button>
            </div>
          </Card>

          {/* Educator Card */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-500 cursor-pointer group">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/30 group-hover:scale-110 transition-transform">
                <Users className="w-12 h-12 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold">I'm an Educator</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create and manage courses, grade assignments, engage with students, and monitor performance
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2 text-left w-full">
                <li>✓ Create & manage courses</li>
                <li>✓ Grade assignments & quizzes</li>
                <li>✓ Monitor student progress</li>
                <li>✓ Share research & publications</li>
              </ul>
              <Button
                onClick={() => handleRoleSelection("EDUCATOR")}
                disabled={loading}
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                Continue as Educator
              </Button>
            </div>
          </Card>
        </div>

        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          This information helps us personalize your experience. You can contact admin to change your role later.
        </p>
      </div>
    </div>
  )
}

export default RoleSelectionPage
