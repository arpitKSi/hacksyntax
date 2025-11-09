"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authHelpers } from "@/lib/api-client"
import Topbar from "@/components/layout/Topbar"

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    if (!authHelpers.isAuthenticated()) {
      router.push("/sign-in")
    }
  }, [router])

  return (
    <>
      <Topbar />
      {children}
    </>
  )
}

export default HomeLayout