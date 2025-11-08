import { currentUser } from "@/shims/clerk-server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import OnboardingStudentForm from "@/components/onboarding/OnboardingStudentForm"

const StudentOnboardingPage = async () => {
  const user = await currentUser()

  if (!user) {
    return redirect("/sign-in")
  }

  // Check if user already onboarded
  let dbUser
  try {
    dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
    })
  } catch (error) {
    // User might not exist yet, that's okay
  }

  if (dbUser?.isOnboarded) {
    return redirect("/dashboard")
  }

  // Fetch departments
  const departments = await db.department.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <OnboardingStudentForm
        userId={user.id}
        email={user.emailAddresses[0]?.emailAddress || ""}
        departments={departments}
      />
    </div>
  )
}

export default StudentOnboardingPage
